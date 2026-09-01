const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

async function buildDossier() {
  const slide4Svg = fs.readFileSync(path.resolve(__dirname, 'assets', 'slide4_feasibility_cards_light.svg'), 'utf8');
  const slide5Svg = fs.readFileSync(path.resolve(__dirname, 'assets', 'slide5_impact_benefits_cards_light.svg'), 'utf8');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart India Hackathon 2026 — Mausam+ Presentation Dossier</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4 landscape;
      margin: 8mm 8mm 8mm 8mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0F172A;
      background: #F8FAFC;
      line-height: 1.4;
      font-size: 10pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      page-break-after: always;
      width: 100%;
      height: 194mm;
      max-height: 194mm;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 6px;
    }
    .page:last-child {
      page-break-after: avoid;
    }

    .slide-svg-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .slide-svg-container svg {
      width: 100%;
      height: 100%;
      max-height: 194mm;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
      background: #FFFFFF;
    }

    /* Detail Page Styles */
    .detail-container {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 16px 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    }

    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0284C7;
      padding-bottom: 8px;
    }
    .team-badge {
      background: #0284C7;
      color: #FFFFFF;
      font-size: 9pt;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 999px;
      letter-spacing: 0.5px;
    }
    .sih-badge {
      font-size: 9pt;
      font-weight: 800;
      color: #0F172A;
      background: #F1F5F9;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
    }

    h1 {
      font-size: 16pt;
      font-weight: 900;
      color: #0F172A;
      margin-top: 4px;
    }
    .subtitle {
      font-size: 9.5pt;
      font-weight: 600;
      color: #64748B;
    }

    h2 {
      font-size: 11pt;
      font-weight: 800;
      color: #0369A1;
      margin: 8px 0 4px 0;
      border-left: 3px solid #0284C7;
      padding-left: 8px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin: 6px 0;
    }
    th, td {
      border: 1px solid #CBD5E1;
      padding: 5px 8px;
      text-align: left;
    }
    th {
      background: #F1F5F9;
      color: #0F172A;
      font-weight: 700;
    }
    tr:nth-child(even) {
      background: #F8FAFC;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 6px 0;
    }

    .card {
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      padding: 8px 10px;
      font-size: 8.5pt;
    }
    .card.blue { border-top: 3px solid #0284C7; background: #F0F9FF; }
    .card.red { border-top: 3px solid #E11D48; background: #FFF1F2; }
    .card.green { border-top: 3px solid #059669; background: #F0FDF4; }
    .card.purple { border-top: 3px solid #7C3AED; background: #FAF5FF; }

    .card-title {
      font-weight: 800;
      font-size: 9.5pt;
      margin-bottom: 4px;
    }
    .card.blue .card-title { color: #0369A1; }
    .card.red .card-title { color: #BE123C; }
    .card.green .card-title { color: #047857; }
    .card.purple .card-title { color: #6D28D9; }

    .formula-box {
      background: #0F172A;
      color: #38BDF8;
      font-family: 'JetBrains Mono', monospace;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 8pt;
      line-height: 1.35;
      margin-top: 4px;
    }

    .badge {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
    }
    .badge.success { background: #DCFCE7; color: #166534; }

    .footer-note {
      font-size: 7.5pt;
      color: #94A3B8;
      border-top: 1px solid #E2E8F0;
      padding-top: 4px;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- ═══════════════════════════════════════════════════════════════════════
       PAGE 1: SLIDE 4 VISUAL PRESENTATION SLIDE (FEASIBILITY & VIABILITY)
  ═══════════════════════════════════════════════════════════════════════ -->
  <div class="page">
    <div class="slide-svg-container">
      ${slide4Svg}
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════
       PAGE 2: SLIDE 4 TECHNICAL ARCHITECTURE & THREAT MODELING DOSSIER
  ═══════════════════════════════════════════════════════════════════════ -->
  <div class="page">
    <div class="detail-container">
      <div>
        <div class="header-bar">
          <div>
            <span class="team-badge">TEAM ARC</span>
            <span style="margin-left: 8px; font-weight: 700; font-size: 9pt; color: #475569;">Smart India Hackathon 2026</span>
          </div>
          <span class="sih-badge">SLIDE 4 TECHNICAL SPECIFICATIONS</span>
        </div>

        <h1>Slide 4: Feasibility &amp; Viability Engineering Dossier</h1>
        <p class="subtitle">Architectural Readiness, Benchmarked Latency, Threat Mitigation &amp; Scale Blueprint</p>

        <h2>Production Readiness &amp; Performance Benchmarks</h2>
        <table>
          <thead>
            <tr>
              <th>Architecture Tier</th>
              <th>Technology Stack</th>
              <th>Operational Status</th>
              <th>Benchmarked Performance Metric</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Mobile &amp; Web Engine</strong></td>
              <td>React 18 + Capacitor 8 + Tailwind CSS</td>
              <td><span class="badge success">100% Production Ready</span></td>
              <td>Unified codebase compiles to Android APK/AAB, iOS &amp; PWA with 60fps UI.</td>
            </tr>
            <tr>
              <td><strong>Backend for Frontend (BFF)</strong></td>
              <td>Stateless Node.js Express + Redis / LRU</td>
              <td><span class="badge success">Operational</span></td>
              <td>Sub-100ms response time; 75% payload compression vs raw data feeds.</td>
            </tr>
            <tr>
              <td><strong>Multi-Agency Telemetry</strong></td>
              <td>37 IMD Radars, INSAT-3DS, CPCB, INCOIS, Damini</td>
              <td><span class="badge success">Live Ingest</span></td>
              <td>Automated schema normalization, diurnal forecast diff &amp; geocoding.</td>
            </tr>
            <tr>
              <td><strong>Zero-Connectivity Mode</strong></td>
              <td>PWA Service Worker (sw.js) + Local Hydration</td>
              <td><span class="badge success">Verified</span></td>
              <td>100% offline access to pre-synced forecasts, emergency radar maps &amp; SOPs.</td>
            </tr>
          </tbody>
        </table>

        <h2>Threat Modeling &amp; Engineered Risk Mitigations</h2>
        <div class="grid-3">
          <div class="card red">
            <div class="card-title">📡 Network Blackouts during Disasters</div>
            <p style="margin-bottom: 4px;"><strong>Risk</strong>: Cellular towers collapse during cyclones, floods, and severe storms, cutting off real-time updates.</p>
            <p style="color: #047857; font-weight: 600;"><strong>Mitigation</strong>: PWA offline cache retains full forecast models, emergency radar loops &amp; evacuation SOPs locally.</p>
          </div>

          <div class="card red">
            <div class="card-title">🤖 AI Hallucinations in Critical Advisories</div>
            <p style="margin-bottom: 4px;"><strong>Risk</strong>: Generative LLMs fabricating unverified safety guidelines during extreme emergency events.</p>
            <p style="color: #047857; font-weight: 600;"><strong>Mitigation</strong>: Dual-RAG engine anchored strictly to IMD/NDMA guidelines with mathematical proofs &amp; audit trace logs.</p>
          </div>

          <div class="card red">
            <div class="card-title">🗣️ Rural Bandwidth &amp; Literacy Barrier</div>
            <p style="margin-bottom: 4px;"><strong>Risk</strong>: 2G/3G packet loss, complex meteorological jargon, and low text literacy among rural farmers and fishermen.</p>
            <p style="color: #047857; font-weight: 600;"><strong>Mitigation</strong>: Natural female voice AI (English, हिन्दी, ಕನ್ನಡ) with continuous mic input and instant voice cancellation.</p>
          </div>
        </div>
      </div>

      <div class="footer-note">
        Mausam+ Hackathon Dossier • Team ARC • SIH 2026 Problem Statement: Development of Personalized Homepage for 'Mausam' Mobile App
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════
       PAGE 3: SLIDE 5 VISUAL PRESENTATION SLIDE (IMPACT & BENEFITS)
  ═══════════════════════════════════════════════════════════════════════ -->
  <div class="page">
    <div class="slide-svg-container">
      ${slide5Svg}
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════
       PAGE 4: SLIDE 5 TARGET AUDIENCE & MULTI-DIMENSIONAL ROI DOSSIER
  ═══════════════════════════════════════════════════════════════════════ -->
  <div class="page">
    <div class="detail-container">
      <div>
        <div class="header-bar">
          <div>
            <span class="team-badge">TEAM ARC</span>
            <span style="margin-left: 8px; font-weight: 700; font-size: 9pt; color: #475569;">Smart India Hackathon 2026</span>
          </div>
          <span class="sih-badge">SLIDE 5 IMPACT &amp; ROI MATRIX</span>
        </div>

        <h1>Slide 5: Multi-Dimensional Impact &amp; Mathematical Formulations</h1>
        <p class="subtitle">Persona-Centric User Value Proposition, Quantified Economic ROI &amp; Inspectable Scientific Formulations</p>

        <h2>Holistic 3-Pillar Benefit Matrix</h2>
        <div class="grid-3">
          <div class="card purple">
            <div class="card-title">👥 Social Impact &amp; Public Safety</div>
            <p>• <strong>Disaster Lead Times</strong>: 120-hr RSMC cyclone cone tracks &amp; Damini lightning alerts give administrations proactive evacuation lead times.</p>
            <p>• <strong>Zero-Literacy Accessibility</strong>: Voice AI breaks text barriers for 1.4B citizens regardless of regional language or reading ability.</p>
            <p>• <strong>Health Shielding</strong>: Biometeorological WBGT alerts reduce heat-stroke casualties and emergency hospitalizations.</p>
          </div>

          <div class="card blue">
            <div class="card-title">💰 Economic &amp; Livelihood ROI</div>
            <p>• <strong>Agrarian Cost Savings</strong>: Fertilizer/pesticide spray timing prevents rain wash-off, saving <strong>₹3,000–₹5,000 per acre</strong> per cycle.</p>
            <p>• <strong>Marine Asset Protection</strong>: INCOIS wave flux &amp; swell warnings prevent multi-lakh rupee fishing boat wreckage and gear destruction.</p>
            <p>• <strong>Workforce Output</strong>: Thermal stress scheduling preserves outdoor labor productivity without heat exhaustion.</p>
          </div>

          <div class="card green">
            <div class="card-title">🌿 Environmental Resilience</div>
            <p>• <strong>20–30% Water Conservation</strong>: FAO-56 Penman-Monteith ET₀ calculations guide precise micro-irrigation scheduling.</p>
            <p>• <strong>Reduced Agrochemical Leaching</strong>: Eliminating redundant chemical spraying prevents aquifer and river eco-toxicity.</p>
            <p>• <strong>Municipal Stormwater Action</strong>: Hyperlocal rainfall accumulation telemetry enables cities to deploy dewatering pumps proactively.</p>
          </div>
        </div>

        <h2>Inspectable Biometeorological Formulations (Zero AI Hallucinations)</h2>
        <div class="formula-box">
// 1. Wet-Bulb Globe Temperature (WBGT - Stull 2011 Formulation)
WBGT = T * atan(0.151977 * (RH + 8.313659)^0.5) + atan(T + RH) - atan(RH - 1.676331) + 0.00391838 * (RH^1.5) * atan(0.023101 * RH) - 4.686035

// 2. FAO-56 Penman-Monteith Evapotranspiration (ET0 in mm/day)
ET0 = (0.408 * Δ * (Rn - G) + γ * (900 / (T + 273)) * u2 * (es - ea)) / (Δ + γ * (1 + 0.34 * u2))

// 3. INCOIS Ocean Wave Power Density (P in kW/m)
P = (ρ * g^2 / (64 * π)) * (Hs^2) * Te ≈ 0.49 * (Hs^2) * Te
        </div>
      </div>

      <div class="footer-note">
        Mausam+ Hackathon Dossier • Team ARC • SIH 2026 Problem Statement: Development of Personalized Homepage for 'Mausam' Mobile App
      </div>
    </div>
  </div>

</body>
</html>`;

  const htmlPath = path.resolve(__dirname, 'SIH_2026_Mausam_Plus_Presentation_Dossier.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`Saved clean standalone HTML dossier: ${htmlPath}`);

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
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  console.log(`Rendering PDF from: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  const pdfPath = path.resolve(__dirname, 'SIH_2026_Mausam_Plus_Slides_Dossier.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: {
      top: '6mm',
      right: '6mm',
      bottom: '6mm',
      left: '6mm'
    }
  });

  console.log(`PDF successfully generated: ${pdfPath}`);
  await browser.close();
}

buildDossier().catch(console.error);
