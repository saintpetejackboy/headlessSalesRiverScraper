const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const cheerio = require('cheerio');
const app = express();
const port = 3333;
const cors = require('cors');
require('dotenv').config({ path: '/var/www/envfiles/caf.env' });


let browser; // Declare browser at a higher scope
const corsOptions = {
  origin: 'https://esdbooking.us',
};

app.use(cors(corsOptions));

app.get('/scrape', async (req, res) => {
  try {
    console.log('Launching browser...');
   const { path } = req.query;
if (!path) {
    return res.status(400).send('Path parameter is required');
}


    const targetUrl = `https://marketplace.consumeraffairs.com/dash/leads/${path}`;
	console.log(targetUrl);
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    console.log('Navigating to login page...');
    await page.goto("https://marketplace.consumeraffairs.com/login", { waitUntil: 'networkidle2' });

    console.log('Filling in login form...');
    await page.click('input[name="email"]');
    await page.type('input[name="email"]', process.env.EMAIL, {delay: 200});
    await page.click('input[name="password"]');
    await page.type('input[name="password"]', process.env.PASSWORD, {delay: 200});
    await page.waitForSelector('button[type="submit"]:not(.disabled)', {visible: true});
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

    console.log('Navigating to the destination URL...');
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    const pageHTML = await page.content();
     // Directly load the HTML content into Cheerio, skipping the filesystem
     const $ = cheerio.load(pageHTML);

const nameText = $('h3.css-jfnbht').text().trim();
let fname = "", lname = "";

// Find the last space in the name to separate fname and lname
const lastSpaceIndex = nameText.lastIndexOf(' ');

if (lastSpaceIndex > -1) { // Ensure there is at least one space
  fname = nameText.substring(0, lastSpaceIndex).trim(); // Everything before the last space
  lname = nameText.substring(lastSpaceIndex + 1).trim(); // Everything after the last space
} else {
  // Handle cases with no spaces (e.g., a single name)
  fname = nameText; // Entire name is considered as fname
  lname = ""; // No lname
}

// Assuming the phone number extraction is correct
const phone = $('a[href^="tel:"]').text().replace(/\D/g, ''); // Removes all non-digit characters

const emailLinks = $('a[href^="mailto:"]').map(function() {
  return $(this).text().trim();
}).get();

const email = emailLinks.find(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

// Step 1: Locate the address block more reliably
const addressBlock = $("span:contains('Address')").closest('div').parent();

// Step 2: Extract the address information
// Adjusted to navigate based on the structure rather than relying on class names or exact positions
const addressInfoSpans = addressBlock.find("span.css-mp5pz2"); // Adjust the selector if needed

let fullAddressText = "";
let cityStateZipText = "";

if (addressInfoSpans.length >= 2) {
    // Assuming the first relevant span contains the full address and the second contains city, state, ZIP
    fullAddressText = $(addressInfoSpans[0]).text().trim();
    cityStateZipText = $(addressInfoSpans[1]).text().trim();
}
console.log(cityStateZipText);
let address = "";
let city = "";
let state = "";
let zip = "";


// Improved parsing logic
// Assuming the full address might not always follow "Street, City, State, ZIP, Country"
let parts = fullAddressText.split(',');
if (parts.length > 1) {
    address = parts[0].trim(); // Assuming the first part is always the street address
    // If the city is not in the second part, it might be in the cityStateZipText
    if (parts.length === 2) { // Likely format: "Street, Country"
        cityStateZipText = parts[1].trim() + ', ' + cityStateZipText; // Append to ensure city is included
    } else if (parts.length > 2) {
        city = parts[1].trim(); // Assuming the second part is the city if more than two parts exist
    }
} else {
    // Handle case where the address might not be in the expected format
    console.log("Unexpected address format:", fullAddressText);
    address = fullAddressText; // Fallback to using the full text
}
let cityStateZipParts = cityStateZipText.split(',').map(part => part.trim()); // Trim parts after splitting

if (cityStateZipParts.length >= 2) {
    city = cityStateZipParts[0]; // The first part is the city
    // Directly use the rest of the string for state and ZIP extraction to handle any format
    const stateZipText = cityStateZipParts.slice(1).join(',').trim(); // Join back if there were more commas

    // Adjusted regex to handle potential invisible characters (like non-breaking spaces) and more flexible formatting
    const stateZipPattern = /\b([A-Z]{2})\s*[\s,]*([0-9]{5})\b/;
    const matches = stateZipText.match(stateZipPattern);

    if (matches && matches.length >= 3) {
        state = matches[1];
        zip = matches[2];
    } else {
        console.log("Could not parse state and ZIP correctly from:", stateZipText);
    }
} else {
    console.log("Unexpected format for city, state, and ZIP:", cityStateZipText);
}

console.log(`Address: ${address}, City: ${city}, State: ${state}, ZIP: ${zip}`);



const campaign = $('a.css-13xfchu').last().text().trim(); // Assuming the last link contains the campaign name

// Forming JSON response
const jsonResponse = {
  fname,
  lname,
  phone,
  email,
  address,
  city,
  state,
  zip,
  campaign
};


  console.log("Scraping complete, closing browser...");
    await browser.close();

    res.json(jsonResponse);
    console.log("All tasks complete, response sent.");
  } catch (error) {
    console.error('An error occurred during the scraping process:', error);
    await browser?.close();
    res.status(500).send('An error occurred during the scraping process');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
	