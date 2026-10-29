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

  // 1. Switch to English
  console.log('Switching to English...');
  await page.select('#langSelector', 'en');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'lang_english_step1.png') });

  // Navigate to Step 3 in English
  await page.click('#btnNextToStep2');
  await new Promise(r => setTimeout(r, 500));
  await page.click('#btnNextToStep3');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'lang_english_step3.png') });

  // 2. Switch to Tamil
  console.log('Switching to Tamil...');
  await page.select('#langSelector', 'ta');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'lang_tamil.png') });

  // 3. Switch to Marathi
  console.log('Switching to Marathi...');
  await page.select('#langSelector', 'mr');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'lang_marathi.png') });

  console.log('Language testing completed!');
  await browser.close();
}

run();
