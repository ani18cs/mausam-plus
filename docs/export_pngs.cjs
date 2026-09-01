const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function exportPNGs() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  const files = [
    { svg: 'slide4_feasibility_cards_light.svg', png: 'slide4_feasibility_cards_light.png' },
    { svg: 'slide5_impact_benefits_cards_light.svg', png: 'slide5_impact_benefits_cards_light.png' }
  ];

  for (const item of files) {
    const svgPath = path.resolve(__dirname, 'assets', item.svg);
    const pngPath = path.resolve(__dirname, 'assets', item.png);
    const fileUrl = 'file:///' + svgPath.replace(/\\/g, '/');

    console.log(`Rendering ${item.svg} to high-res PNG...`);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: pngPath, fullPage: false, type: 'png' });
    console.log(`Saved PNG: ${pngPath}`);
  }

  await browser.close();
}

exportPNGs().catch(console.error);
