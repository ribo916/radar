import { csv } from 'd3-fetch';

const columnMapping = {
  'Power Percentile': 'power_percentile',
  'Spin (RPM)': 'spin_rpm',
  'Pop Percentile': 'pop_percentile',
  'Twistweight Percentile': 'twist_percentile',
  'Balance Point (mm)': 'balance_point',
  'Swingweight Percentile': 'swing_percentile',
  'Spin Rating': 'spin_rating',
  // Add new columns here
  'Price': 'price',
  'Year Released': 'year_released',
  'Generation/Build': 'generation_build',
  'Paddle Type': 'paddle_type',
  'Link to Paddle': 'link_to_paddle',
  'Discount Code': 'discount_code'
};

export async function processData() {
  const data = await csv('/PBEffect_2024_10_11.csv');
  
  const filteredData = data.filter(row => row['Paddle Name'] && row['Brand']);
  
  const mappedData = filteredData.map((row) => {
    const mappedRow = {};
    for (const [originalColumn, newColumn] of Object.entries(columnMapping)) {
      if (originalColumn.includes('Percentile')) {
        mappedRow[newColumn] = row[originalColumn] ? parseFloat(row[originalColumn].replace('%', '')) : null;
      } else {
        mappedRow[newColumn] = row[originalColumn];
      }
    }
    
    // Map other relevant fields
    mappedRow.paddle = row['Paddle Name'];
    mappedRow.company = row['Brand'];
    mappedRow.thickness = row['Core Thickness (mm)'];
    mappedRow.shape = row['Shape'];
    mappedRow.face_material = row['Face Material'];
    mappedRow.handle_length = row['Handle Length (in)'];
    mappedRow.power_mph = row['Power (MPH)'];
    mappedRow.pop_mph = row['Pop (MPH)'];
    mappedRow.swingweight = row['Swingweight'];
    mappedRow.twistweight = row['Twistweight'];
    mappedRow.surface_texture = row['Grit Type'];
    mappedRow.static_weight = row['Weight (oz)'];
    mappedRow.spin_rating = row['Spin Rating'] ? row['Spin Rating'].trim().toLowerCase() : null;

    return mappedRow;
  });

  const excludedPaddles = data
    .filter(row => !row['Paddle Name'] || !row['Brand'])
    .map(row => row['Paddle Name'] || 'Unknown')
    .sort((a, b) => a.localeCompare(b));

  console.log('Filtered PBEffect data:', mappedData);
  
  return { filteredData: mappedData, excludedPaddles };
}
