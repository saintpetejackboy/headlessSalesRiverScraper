const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Consider security implications
  });
  const page = await browser.newPage();
  await page.goto('http://esdbooking.us');
  // Your code here
  await browser.close();
})();

