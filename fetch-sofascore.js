const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Europe/London'
  });

  const url = `https://www.sofascore.com/api/v1/sport/football/scheduled-events/${today}`;
  const outputFile = 'scheduled-events.json';

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle0' });
    const json = await response.json();
    fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
    console.log(`✅ Data saved to ${outputFile}`);
  } catch (err) {
    console.error('❌ Fetch failed:', err);
  } finally {
    await browser.close();
  }
})();
