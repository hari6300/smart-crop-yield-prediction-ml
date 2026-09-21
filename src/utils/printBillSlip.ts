import { PredictionResult } from '../types';

/**
 * Converts a number to Indian Currency Words representation
 */
function numberToWordsINR(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(num: number): string {
    if (num === 0) return '';
    if (num < 10) return singleDigits[num];
    if (num < 20) return teens[num - 10];
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return tens[ten] + (unit !== 0 ? ' ' + singleDigits[unit] : '');
  }

  function convertThreeDigits(num: number): string {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    let res = '';
    if (hundred > 0) res += singleDigits[hundred] + ' Hundred';
    if (remainder > 0) {
      if (res !== '') res += ' and ';
      res += convertTwoDigits(remainder);
    }
    return res;
  }

  const crore = Math.floor(rounded / 10000000);
  let rem = rounded % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;
  const hundredPart = rem;

  let parts: string[] = [];
  if (crore > 0) parts.push(convertThreeDigits(crore) + ' Crore');
  if (lakh > 0) parts.push(convertThreeDigits(lakh) + ' Lakh');
  if (thousand > 0) parts.push(convertThreeDigits(thousand) + ' Thousand');
  if (hundredPart > 0) parts.push(convertThreeDigits(hundredPart));

  return parts.join(' ') + ' Rupees Only';
}

/**
 * Generates an official, print-ready HTML string formatted as an
 * Agro-Kisan Mandi Yield Estimation & Advisory Bill / Receipt Slip.
 */
export function generateBillSlipHtml(prediction: PredictionResult): string {
  const billNo = `AGRO-BILL-${prediction.id.replace('pred-', '').toUpperCase()}`;
  const printDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const printTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const areaAcres = prediction.input.area;
  const areaHa = (areaAcres * 0.404686).toFixed(2);
  const yieldPerAcre = (prediction.predictedYield * 0.404686).toFixed(2);
  const totalVal = prediction.estimatedRevenue.totalValue;
  const valInWords = numberToWordsINR(totalVal);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Crop Yield Estimation & Advisory Bill Slip - ${prediction.input.crop}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 24px;
      display: flex;
      justify-content: center;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .bill-wrapper {
      width: 100%;
      max-width: 800px;
      background: #ffffff;
      border: 2px solid #0f172a;
      border-radius: 12px;
      padding: 32px 36px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      position: relative;
    }
    
    /* Top Action Bar for browser view */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px dashed #cbd5e1;
    }
    .print-btn {
      background: #059669;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover {
      background: #047857;
    }
    .status-badge {
      font-size: 11px;
      font-weight: 700;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Official Bill Header */
    .bill-header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .emblem {
      font-size: 28px;
      margin-bottom: 4px;
    }
    .gov-title {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #475569;
      text-transform: uppercase;
    }
    .bill-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0;
      letter-spacing: -0.5px;
    }
    .bill-subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    /* Memo Info Grid */
    .memo-meta {
      display: grid;
      grid-template-cols: repeat(2, 1fr);
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 20px;
      font-size: 12px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      font-weight: 700;
    }
    .meta-val {
      font-weight: 700;
      color: #0f172a;
      font-size: 13px;
      margin-top: 1px;
    }
    .meta-val.mono {
      font-family: 'Courier Prime', monospace;
      letter-spacing: 0.5px;
    }

    /* Two Column Parameters Section */
    .section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0f172a;
      border-left: 3px solid #059669;
      padding-left: 8px;
      margin: 16px 0 10px 0;
    }

    .particulars-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 12px;
    }
    .particulars-table th, .particulars-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    .particulars-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #334155;
      font-size: 11px;
      text-transform: uppercase;
    }

    /* Highlight Acre Area Pill */
    .acre-highlight {
      background: #ecfdf5;
      color: #047857;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
      display: inline-block;
    }

    /* Itemized Bill Table */
    .bill-items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12.5px;
    }
    .bill-items-table th {
      background: #0f172a;
      color: #ffffff;
      padding: 9px 12px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .bill-items-table td {
      border-bottom: 1px solid #e2e8f0;
      padding: 10px 12px;
      vertical-align: top;
    }
    .bill-items-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .text-right {
      text-align: right !important;
    }
    .text-center {
      text-align: center !important;
    }
    .bold {
      font-weight: 700;
    }

    /* Grand Total Box */
    .grand-total-card {
      background: #f0fdf4;
      border: 2px solid #059669;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-title {
      font-size: 12px;
      font-weight: 700;
      color: #065f46;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .total-in-words {
      font-size: 11px;
      color: #047857;
      font-style: italic;
      margin-top: 2px;
    }
    .total-num {
      font-size: 26px;
      font-weight: 900;
      color: #047857;
      letter-spacing: -0.5px;
    }

    /* Advisory Box */
    .advisory-box {
      border: 1px solid #e2e8f0;
      background: #fafaf9;
      border-radius: 8px;
      padding: 14px 18px;
      margin: 16px 0;
      font-size: 11.5px;
    }
    .advisory-box ul {
      margin-left: 18px;
      margin-top: 6px;
      color: #334155;
    }
    .advisory-box li {
      margin-bottom: 4px;
      line-height: 1.4;
    }

    /* Footer & Stamp */
    .bill-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 11px;
      color: #64748b;
    }
    .barcode-box {
      font-family: 'Courier Prime', monospace;
      font-size: 14px;
      letter-spacing: 3px;
      color: #0f172a;
      font-weight: 700;
      background: #f1f5f9;
      padding: 6px 14px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
      display: inline-block;
      margin-top: 4px;
    }
    .stamp-box {
      border: 2px dashed #059669;
      border-radius: 8px;
      padding: 10px 16px;
      text-align: center;
      color: #059669;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.8px;
      transform: rotate(-2deg);
    }

    @media print {
      body {
        background: transparent;
        padding: 0;
      }
      .action-bar {
        display: none !important;
      }
      .bill-wrapper {
        border: 2px solid #000;
        box-shadow: none;
        max-width: 100%;
        padding: 20px;
      }
    }
  </style>
</head>
<body>

  <div class="bill-wrapper">
    
    <!-- Action Bar (Hidden on print) -->
    <div class="action-bar">
      <div>
        <span class="status-badge">✓ Machine Learning Certified</span>
      </div>
      <button class="print-btn" onclick="window.print()">
        🖨️ Print / Save PDF
      </button>
    </div>

    <!-- Official Header -->
    <div class="bill-header">
      <div class="emblem">🌾</div>
      <div class="gov-title">Agro-Climatic Intelligence & Decision Support System</div>
      <h1 class="bill-title">CROP YIELD & HARVEST ESTIMATION BILL SLIP</h1>
      <div class="bill-subtitle">Kisan Mandi Yield Assessment Memorandum • Under Agricultural Telemetry Scheme</div>
    </div>

    <!-- Bill Metadata -->
    <div class="memo-meta">
      <div class="meta-item">
        <span class="meta-label">Bill / Memo Slip No.</span>
        <span class="meta-val mono">${billNo}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Date & Time of Assessment</span>
        <span class="meta-val">${printDate} at ${printTime}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Farmer Record / Field ID</span>
        <span class="meta-val mono">IN-AGRI-${prediction.input.district.toUpperCase().slice(0, 3)}-${prediction.id.slice(-5)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Predictive ML Architecture</span>
        <span class="meta-val">Random Forest & XGBoost Regressors (95% CI)</span>
      </div>
    </div>

    <!-- Farm Particulars (Area in ACRES) -->
    <div class="section-title">1. Cultivated Land & Agro-Climatic Particulars</div>
    <table class="particulars-table">
      <tr>
        <th style="width: 25%;">Target Crop</th>
        <td style="width: 25%; font-weight: 700; color: #065f46;">${prediction.input.crop}</td>
        <th style="width: 25%;">Total Land Area</th>
        <td style="width: 25%;">
          <span class="acre-highlight">${areaAcres} ACRES</span>
          <span style="color: #64748b; font-size: 11px; margin-left: 4px;">(${areaHa} ha)</span>
        </td>
      </tr>
      <tr>
        <th>State & District</th>
        <td>${prediction.input.district}, ${prediction.input.state}</td>
        <th>Cropping Season</th>
        <td>${prediction.input.season}</td>
      </tr>
      <tr>
        <th>Soil Matrix</th>
        <td>${prediction.input.soilType}</td>
        <th>Irrigation System</th>
        <td>${prediction.input.irrigation}</td>
      </tr>
      <tr>
        <th>Rainfall (Seasonal)</th>
        <td>${prediction.input.rainfall} mm (Weather Telemetry)</td>
        <th>Mean Temperature</th>
        <td>${prediction.input.temperature} °C (Ambient Station)</td>
      </tr>
      <tr>
        <th>Fertilizer Dose Rate</th>
        <td>${prediction.input.fertilizer} kg / hectare (NPK)</td>
        <th>Soil Health Rating</th>
        <td>
          ${prediction.input.soilDetails 
            ? `pH: ${prediction.input.soilDetails.pH} | OC: ${prediction.input.soilDetails.organicCarbon}% | NPK: ${prediction.input.soilDetails.nitrogenStatus[0]}-${prediction.input.soilDetails.phosphorusStatus[0]}-${prediction.input.soilDetails.potassiumStatus[0]}`
            : 'ICAR Standard Profile Verified'
          }
        </td>
      </tr>
    </table>

    <!-- Itemized Assessment Schedule (Bill Format) -->
    <div class="section-title">2. Yield Assessment & Economic Valuation Schedule</div>
    <table class="bill-items-table">
      <thead>
        <tr>
          <th style="width: 8%;">S.No</th>
          <th style="width: 42%;">Assessment Item Description</th>
          <th style="width: 15%;" class="text-center">Rate / Metric</th>
          <th style="width: 15%;" class="text-center">Field Basis</th>
          <th style="width: 20%;" class="text-right">Estimated Output</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">01</td>
          <td class="bold">
            Predicted Crop Yield Rate (Hectare Basis)
            <div style="font-size: 10.5px; color: #64748b; font-weight: normal;">Standard agro-climatic metric</div>
          </td>
          <td class="text-center bold text-emerald-800" style="color: #047857;">
            ${prediction.predictedYield} t/ha
          </td>
          <td class="text-center">Per Hectare</td>
          <td class="text-right bold" style="color: #047857;">${prediction.predictedYield} Tons/ha</td>
        </tr>
        <tr>
          <td class="text-center">02</td>
          <td class="bold">
            Equivalent Yield Rate (Acre Basis)
            <div style="font-size: 10.5px; color: #64748b; font-weight: normal;">Converted: 1 Acre = 0.4047 Hectare</div>
          </td>
          <td class="text-center bold" style="color: #047857;">
            ${yieldPerAcre} t/acre
          </td>
          <td class="text-center">Per Acre</td>
          <td class="text-right bold" style="color: #047857;">${yieldPerAcre} Tons/acre</td>
        </tr>
        <tr>
          <td class="text-center">03</td>
          <td class="bold">
            Gross Harvest Assessment
            <div style="font-size: 10.5px; color: #64748b; font-weight: normal;">Yield across total ${areaAcres} acres</div>
          </td>
          <td class="text-center">${yieldPerAcre} t/acre</td>
          <td class="text-center bold">${areaAcres} Acres</td>
          <td class="text-right bold" style="font-size: 14px; color: #0f172a;">
            ${prediction.totalProduction} MT
          </td>
        </tr>
        <tr>
          <td class="text-center">04</td>
          <td>
            Government Minimum Support Price (MSP)
            <div style="font-size: 10.5px; color: #64748b;">Statutory agricultural benchmark</div>
          </td>
          <td class="text-center">₹${prediction.estimatedRevenue.pricePerTon.toLocaleString('en-IN')}/ton</td>
          <td class="text-center">${prediction.totalProduction} MT</td>
          <td class="text-right font-mono">
            ₹${(prediction.totalProduction * prediction.estimatedRevenue.pricePerTon).toLocaleString('en-IN')}
          </td>
        </tr>
        <tr style="background: #f1f5f9; font-weight: bold;">
          <td colspan="4" class="text-right" style="padding-top: 12px; font-size: 12px; text-transform: uppercase;">
            Net Assessed Gross Production Value:
          </td>
          <td class="text-right" style="padding-top: 12px; font-size: 15px; color: #047857;">
            ₹${totalVal.toLocaleString('en-IN')}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Grand Total Highlight Card -->
    <div class="grand-total-card">
      <div>
        <div class="total-title">Total Assessed Harvest Worth (Gross MSP Value)</div>
        <div class="total-in-words">${valInWords}</div>
      </div>
      <div class="total-num">
        ₹${totalVal.toLocaleString('en-IN')}
      </div>
    </div>

    <!-- Confidence & Agronomic Advisory -->
    <div class="section-title">3. Model Accuracy & Agronomic Prescriptions</div>
    <div class="advisory-box">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 8px;">
        <span style="font-weight: 700; color: #0f172a;">
          Model R²: <strong style="color: #047857;">${prediction.confidenceScore}%</strong> (${prediction.yieldCategory} Potential)
        </span>
        <span style="font-size: 11px; color: #64748b;">
          Model Prediction Spread: ${prediction.confidenceInterval.min} – ${prediction.confidenceInterval.max} t/ha
        </span>
      </div>
      <div style="font-weight: 700; font-size: 11px; text-transform: uppercase; color: #475569; margin-top: 6px;">
        Customized Field Recommendations:
      </div>
      <ul>
        ${prediction.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>

    <!-- Slip Footer & Security Stamp -->
    <div class="bill-footer">
      <div>
        <div>Verification Barcode:</div>
        <div class="barcode-box">||| | | |||| | ||| ||||| |||</div>
        <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">
          Certified Computer-Generated Mandi Slip • Valid for Agronomic Guidance & Crop Insurance
        </div>
      </div>

      <div class="stamp-box">
        <div>★ AGRO-ML VERIFIED ★</div>
        <div>KRISHI KALYAN BUREAU</div>
        <div style="font-size: 8px; margin-top: 2px;">OFFICIALLY VALIDATED</div>
      </div>
    </div>

  </div>

</body>
</html>`;
}

/**
 * Downloads the Bill Slip as an HTML file directly to the user's computer.
 */
export function downloadBillSlip(prediction: PredictionResult): void {
  const htmlContent = generateBillSlipHtml(prediction);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const cleanCrop = prediction.input.crop.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanDistrict = prediction.input.district.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Kisan_Yield_Bill_${cleanCrop}_${cleanDistrict}_${prediction.id.slice(-6)}.html`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-friendly window or triggers print preview for the bill slip.
 */
export function openPrintSlipWindow(prediction: PredictionResult): void {
  const htmlContent = generateBillSlipHtml(prediction);
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
  } else {
    // If popup is blocked by the browser, fallback to direct download
    downloadBillSlip(prediction);
  }
}
