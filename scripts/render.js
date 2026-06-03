const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = '/root/.cache/puppeteer/chrome/linux-149.0.7827.22/chrome-linux64/chrome';

async function render(htmlFile, outputFile) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
  const fileUrl = 'file://' + path.resolve(htmlFile);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outputFile, type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await browser.close();
  console.log('Rendered:', outputFile);
}

const [,, htmlFile, outputFile] = process.argv;
if (!htmlFile || !outputFile) { console.error('Usage: node render.js <input.html> <output.png>'); process.exit(1); }
render(htmlFile, outputFile).catch(e => { console.error(e); process.exit(1); });
