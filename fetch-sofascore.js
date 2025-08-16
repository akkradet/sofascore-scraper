const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

  try {
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const formattedDate = date.toLocaleDateString('en-CA', {
        timeZone: 'Europe/London'
      });

      const url = `https://www.sofascore.com/api/v1/sport/football/scheduled-events/${formattedDate}`;
      const outputFile = `scheduled-events${i === 0 ? '' : i + 1}.json`;

      console.log(`📅 Fetching: ${formattedDate} -> ${outputFile}`);

      const response = await page.goto(url, { waitUntil: 'networkidle0' });
      const json = await response.json();
      fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
    }

    console.log('✅ All files saved successfully!');
  } catch (err) {
    console.error('❌ Fetch failed:', err);
  } finally {
    await browser.close();
  }
})();
