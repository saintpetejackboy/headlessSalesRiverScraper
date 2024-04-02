// Import necessary modules
const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cors = require('cors');
require('dotenv').config({ path: '/var/www/envfiles/caf.env' });

// Initialize Express app
const app = express();
const port = 3333;

// CORS configuration for secure cross-origin requests
const corsOptions = {
  origin: process.env.QUERY_SERVER,
};
app.use(cors(corsOptions));

// Route to handle web scraping
app.get('/scrape', async (req, res) => {
  console.log("Starting to scrape...");
  let browser;
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).send('Path parameter is required');
    }

    // Use the BASE_URL environment variable to construct target URL
    const loginUrl = `${process.env.BASE_URL}/login`;
    const targetUrl = `${process.env.BASE_URL}/dash/leads/${path}`;

    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.goto(loginUrl, { waitUntil: 'networkidle2' });

    // Perform login
    await page.type('input[name="email"]', process.env.EMAIL, { delay: 200 });
    await page.type('input[name="password"]', process.env.PASSWORD, { delay: 200 });
    await page.click('button[type="submit"]');

    try {
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
    } catch (error) {
      throw new Error('Login failed or took too long.');
    }

    // Navigate to the target URL
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    const pageHTML = await page.content();

    // Use Cheerio to parse HTML content
    const $ = cheerio.load(pageHTML);

    // Extract required information using Cheerio
    const nameText = $('h3.css-jfnbht').text().trim();
    const [fname, lname] = nameText.includes(' ') ? nameText.split(' ').reduce((acc, cur, idx, src) => idx < src.length - 1 ? [acc[0] + cur + ' ', acc[1]] : [acc[0].trim(), cur], ['', '']) : [nameText, ''];
    const phone = $('a[href^="tel:"]').text().replace(/\D/g, '');
    const email = $('a[href^="mailto:"]').map((i, el) => $(el).text().trim()).get().find(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    const campaign = $('a.css-13xfchu').last().text().trim();

    const addressBlock = $("span:contains('Address')").closest('div').parent();
    const addressInfo = addressBlock.find("span.css-mp5pz2").map((i, el) => $(el).text().trim()).get();
    const [address, cityStateZip] = addressInfo;
    const parts = cityStateZip.split(',').map(part => part.trim());
    const city = parts[0];
    const state = parts[1];
    const zip = parts.length > 2 ? parts[2] : undefined;

    // Construct and send JSON response
    const jsonResponse = { fname, lname, phone, email, address, city, state, zip, campaign };
    console.log(jsonResponse);
    res.json(jsonResponse);
    
  } catch (error) {
    console.error('An error occurred during the scraping process:', error);
    res.status(500).send('An error occurred during the scraping process');
  } finally {
    if (browser) await browser.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
