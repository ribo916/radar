import { csv } from 'd3-fetch'; // Import the csv function from d3-fetch
import { loadAndProcessDataFromAirtable } from './johnKew.airtable.js'; // Import the API data processor
import { loadAndProcessDataFromXano } from './johnKew.xano.js'; // Import the API data processor

const columnMapping = {
  'Company': 'company',
  'Paddle': 'paddle',
  'Core Thickness (mm)': 'thickness',
  'Power Percentile': 'power_percentile',
  'Spin Percentile': 'spin_percentile',
  'Twist Weight Percentile': 'twist_percentile',
  'Balance Point Percentile': 'balance_percentile',
  'Swing Weight Percentile': 'swing_percentile',
  'Pop Percentile': 'pop_percentile',
  'Shape': 'shape',
  'Surface Material': 'face_material',
  'Handle Length (in)': 'handle_length',
  'Spin RPM': 'spin_rpm',
  'Swing Weight': 'swing_weight',
  'Twist Weight': 'twist_weight',
  'Core Material': 'core_material',
  'Surface Texture': 'surface_texture',
  'Length (in)': 'length',
  'Width (in)': 'width',
  'Static Weight (oz)': 'static_weight',
  'Balance Point (cm)': 'balance_point_cm',
  'Serve Speed-MPH (Power)': 'serve_speed_mph',
  'Punch Volley Speed-MPH (Pop)': 'punch_volley_speed'
};

export async function processData(queryParams) {
  if (queryParams.get('useAirtable') === 'true') {
    return await loadAndProcessDataFromAirtable();
  } else if (queryParams.get('useXano') === 'true') {
    return await loadAndProcessDataFromXano();
  } else {
    return await loadAndProcessDataFromCSV();
  }
}

async function loadAndProcessDataFromCSV() {
  const data = await csv('/JohnKew_2024_10_09.csv');
  return processCSVData(data);
}

function processCSVData(data) {
  const mappedData = data.map((row) => {
    const mappedRow = {};
    for (const [originalColumn, newColumn] of Object.entries(columnMapping)) {
      mappedRow[newColumn] = row[originalColumn];
    }
    return mappedRow;
  });

  console.log('Mapped JohnKewdata:', mappedData);
  const xKey = ['power_percentile', 'spin_percentile', 'twist_percentile', 'balance_percentile', 'swing_percentile', 'pop_percentile'];

  const filteredData = mappedData.filter((d, index) => {
    let allValid = true;
    xKey.forEach(key => {
      let value = d[key];
      if (value !== undefined && value !== '' && !isNaN(parseFloat(value)) && parseFloat(value) > 0) {
        // Strip the '%' symbol and convert to decimal
        value = parseFloat(value.replace('%', '')) / 100;
        // Multiply by 100 and round the value to the nearest whole number, then divide by 10
        value = Math.round(value * 100) / 10;
        // Assign the rounded value back to the object
        d[key] = value;
      } else {
        allValid = false;
      }
    });
    return allValid;
  });

  // Sort by company and then by paddle
  filteredData.sort((a, b) => {
    if (a.company < b.company) return -1;
    if (a.company > b.company) return 1;
    if (a.paddle < b.paddle) return -1;
    if (a.paddle > b.paddle) return 1;
    return 0;
  });
  // console.log('Filtered JohnKewdata:', filteredData);

  const excludedPaddles = mappedData
    .filter(d => !filteredData.includes(d))
    .map(d => d.paddle)
    .sort((a, b) => a.localeCompare(b));
  // console.log('Excluded JohnKewpaddles:', excludedPaddles);

  return { filteredData, excludedPaddles };
}
