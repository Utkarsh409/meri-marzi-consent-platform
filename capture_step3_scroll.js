import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\utkar_0xlfx\\.gemini\\antigravity-ide\\brain\\2813a050-5387-41ea-92b8-1cc6ab74c083';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 950 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Navigate to Step 3
  await page.click('#btnNextToStep2');
  await new Promise(r => setTimeout(r, 400));
  await page.click('#btnNextToStep3');
  await new Promise(r => setTimeout(r, 400));

  // Select 100% full understanding preset
  await page.click('button[data-preset-id="full_understanding"]');
  await new Promise(r => setTimeout(r, 500));

  // Scroll down so the 3 pillars and unlocked button are prominently displayed
  await page.evaluate(() => {
    window.scrollBy(0, 450);
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_pillars_verified.png') });
  await browser.close();
}

run();
