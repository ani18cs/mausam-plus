const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;
  console.log(`Using browser binary: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, 'SIH_2026_Mausam_Plus_Presentation_Dossier.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  
  console.log(`Loading dossier URL: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Wait a bit for SVG images and fonts to render perfectly
  await new Promise(r => setTimeout(r, 2000));

  const pdfPath = path.resolve(__dirname, 'SIH_2026_Mausam_Plus_Slides_Dossier.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      right: '12mm',
      bottom: '12mm',
      left: '12mm'
    }
  });

  console.log(`PDF successfully generated at: ${pdfPath}`);
  await browser.close();
}

generatePDF().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
