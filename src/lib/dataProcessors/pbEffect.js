import { csv } from 'd3-fetch';

const columnMapping = {
  'Power (MPH)': 'power_percentile',
  'Spin (RPM)': 'spin_percentile',
  'Pop (MPH)': 'pop_percentile',
  'Twistweight Percentile': 'twist_percentile',
  'Balance Point (mm)': 'balance_percentile',
  'Swingweight Percentile': 'swing_percentile',
};

export async function processData(searchParams) {
  const data = await csv('/PBEffect_2024_10_11.csv');
  
  const filteredData = data.filter(row => row['Paddle Name'] && row['Brand']);
  
  const mappedData = filteredData.map((row) => {
    const mappedRow = {};
    for (const [originalColumn, newColumn] of Object.entries(columnMapping)) {
      mappedRow[newColumn] = row[originalColumn];
    }
    
    // Convert percentiles to decimal form
    ['Power', 'Spin', 'Pop', 'Twist', 'Balance', 'Swing'].forEach(attr => {
      if (mappedRow[`${attr.toLowerCase()}_percentile`]) {
        mappedRow[attr.toLowerCase()] = parseFloat(mappedRow[`${attr.toLowerCase()}_percentile`]) / 100;
      }
    });

    // Map other relevant fields
    mappedRow.paddle = row['Paddle Name'];
    mappedRow.company = row['Brand'];
    mappedRow.thickness = row['Core Thickness (mm)'];
    mappedRow.shape = row['Shape'];
    mappedRow.face_material = row['Face Material'];
    mappedRow.handle_length = row['Handle Length (in)'];
    mappedRow.spin_rpm = row['Spin (RPM)'];
    mappedRow.serve_speed_mph = row['Power (MPH)'];
    mappedRow.punch_volley_speed = row['Pop (MPH)'];
    mappedRow.swing_weight = row['Swingweight'];
    mappedRow.twist_weight = row['Twistweight'];
    mappedRow.core_material = 'N/A'; // Not provided in this dataset
    mappedRow.surface_texture = row['Grit Type'];
    mappedRow.length = 'N/A'; // Not provided in this dataset
    mappedRow.width = 'N/A'; // Not provided in this dataset
    mappedRow.static_weight = row['Weight (oz)'];
    mappedRow.balance_point_cm = parseFloat(row['Balance Point (mm)']) / 10; // Convert mm to cm

    return mappedRow;
  });

  const excludedPaddles = data
    .filter(row => !row['Paddle Name'] || !row['Brand'])
    .map(row => row['Paddle Name'] || 'Unknown')
    .sort((a, b) => a.localeCompare(b));

  console.log('Filtered data:', mappedData);
  console.log('Excluded paddles:', excludedPaddles);

  return { filteredData: mappedData, excludedPaddles };
}
