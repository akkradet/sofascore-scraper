// fetch-sofascore.js
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Europe/London' // Important: SofaScore uses UTC+0 or London time
  });

  const url = `https://www.sofascore.com/api/v1/sport/football/scheduled-events/${today}`;
  const outputFile = `scheduled-events.json`;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
  );

  try {
    const response = await page.goto(url, {
      waitUntil: 'networkidle0'
    });

    const json = await response.json();

    fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
    console.log(`✅ Data saved to ${outputFile}`);
  } catch (err) {
    console.error('❌ Fetch failed:', err);
  } finally {
    await browser.close();
  }
})();
