const { chromium } = require('playwright');
const OUT = 'C:\\Users\\marya\\AppData\\Local\\Temp\\claude\\c--Users-marya-Downloads-Africa-Web3-Institute\\6dd674b8-0289-4634-8340-35850fce06ec\\scratchpad';
const URL = 'https://africa-web3-institute.vercel.app/';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: OUT + '/live-01-hero.png' });

  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log('page height:', height);

  let y = 900;
  let i = 2;
  while (y < height && i < 10) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/live-${String(i).padStart(2,'0')}.png` });
    y += 900;
    i++;
  }

  console.log('ERRORS:', errors.join('\n') || '(none)');
  await browser.close();
})();
