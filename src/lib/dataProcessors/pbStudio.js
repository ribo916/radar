import { csv } from 'd3-fetch';

const columnMapping = {
  'Company': 'company',
  'Paddle': 'paddle',
  'Price': 'price',
  'Swing Weight': 'swing_weight',
  'Twist Weight': 'twist_weight',
  'Balance': 'balance_point',
  'My paddle weight': 'static_weight',
  'Core thickness in mm': 'thickness',
  'Grip length': 'handle_length',
  'Grip thickness': 'grip_thickness',
  'RPM': 'spin_rpm',
  'Shape': 'shape',
  'Face Material': 'face_material',
  'Core Material': 'core_material',
  'YouTube Review': 'youtube_review',
  'Link to purchase': 'link_to_paddle',
  'Discount code': 'discount_code',
  'Grams': 'weight_grams'
};

export async function processData() {
  const data = await csv('/PBStudio_2024_12_27.csv');
  
  const filteredData = data.filter(row => row['Company'] && row['Paddle']);
  
  const mappedData = filteredData.map((row) => {
    const mappedRow = {};
    for (const [originalColumn, newColumn] of Object.entries(columnMapping)) {
      if (originalColumn === 'Swing Weight' || originalColumn === 'Twist Weight' || originalColumn === 'Balance' || originalColumn === 'My paddle weight') {
        mappedRow[newColumn] = row[originalColumn] ? parseFloat(row[originalColumn]) : null;
      } else {
        mappedRow[newColumn] = row[originalColumn];
      }
    }
    
    // Convert grip length from inches to mm
    if (mappedRow.handle_length) {
      mappedRow.handle_length = (parseFloat(mappedRow.handle_length) * 25.4).toFixed(2);
    }

    // Convert static weight from oz to grams if weight_grams is not available
    if (mappedRow.static_weight && !mappedRow.weight_grams) {
      mappedRow.weight_grams = (parseFloat(mappedRow.static_weight) * 28.3495).toFixed(2);
    }

    return mappedRow;
  });

  const excludedPaddles = data
    .filter(row => !row['Company'] || !row['Paddle'])
    .map(row => row['Paddle'] || 'Unknown')
    .sort((a, b) => a.localeCompare(b));

  console.log('Filtered PBStudio data:', mappedData);
  
  return { filteredData: mappedData, excludedPaddles };
}
