import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\utkar_0xlfx\\.gemini\\antigravity-ide\\brain\\2813a050-5387-41ea-92b8-1cc6ab74c083';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 950 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // 1. Step 1: Citizen Identification
  console.log('Capturing Step 1...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step1_citizen_id.png') });

  // Navigate to Step 2
  console.log('Navigating to Step 2...');
  await page.click('#btnNextToStep2');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step2_spoken_guide.png') });

  // Navigate to Step 3: Teach-Back Arena
  console.log('Navigating to Step 3...');
  await page.click('#btnNextToStep3');
  await new Promise(r => setTimeout(r, 600));

  // Test Blind Yes Preset (20%)
  console.log('Testing Blind Yes Preset...');
  await page.click('button[data-preset-id="blind_yes"]');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_blind_yes_warning.png') });

  // Test 100% Full Informed Consent
  console.log('Testing Full Informed Consent (100%)...');
  await page.click('button[data-preset-id="full_understanding"]');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step3_dignity_verified.png') });

  // Click Record Consent -> Step 4
  console.log('Recording consent -> Step 4...');
  await page.click('#btnRecordConsent');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step4_samman_patra.png') });

  // Go to Step 5: Revocation In Action
  console.log('Navigating to Step 5...');
  await page.click('#btnGoToStep5');
  await new Promise(r => setTimeout(r, 600));

  // Click Revoke button
  await page.click('#btnSimulateAshaRevoke');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'step5_revocation_test.png') });

  // Switch to Toolkit Tab
  console.log('Capturing Toolkit tab...');
  await page.click('button[data-tab="toolkit"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tab_toolkit.png') });

  // Switch to Dashboard Tab
  console.log('Capturing Dashboard tab...');
  await page.click('button[data-tab="dashboard"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tab_dashboard.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Walkthrough error:', err);
  process.exit(1);
});
