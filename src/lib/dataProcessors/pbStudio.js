import { csv } from 'd3-fetch';

const columnMapping = {
  'Power': 'power_percentile',
  'Spin': 'spin_percentile',
  'Control': 'pop_percentile',
  'Maneuverability': 'twist_percentile',
  'Touch': 'balance_percentile',
  'Stability': 'swing_percentile',
};

export async function processData(searchParams) {
  const data = await csv('/PBStudio_2024_10_11.csv');
  
  const filteredData = data.filter(row => row['Company'] && row['Paddle']);
  
  const mappedData = filteredData.map((row) => {
    const mappedRow = {
      paddle: row['Paddle'],
      company: row['Company'],
      thickness: row['Core thickness in mm'],
      shape: row['Shape'],
      face_material: row['Face Material'],
      handle_length: row['Grip length'],
      core_material: row['Core Material'],
      surface_texture: '', // Not available in this dataset
      length: '', // Not available in this dataset
      width: '', // Not available in this dataset
      static_weight: row['My paddle weight'],
      balance_point_cm: row['Balance'],
      swing_weight: row['Swing Weight'],
      twist_weight: row['Twist Weight'],
      spin_rpm: row['RPM'],
    };

    // Map the percentile values
    for (const [key, value] of Object.entries(columnMapping)) {
      mappedRow[value] = parseFloat(row[key] || 0) / 100; // Assuming these values are already percentages
    }

    return mappedRow;
  });

  const excludedPaddles = data
    .filter(row => !row['Company'] || !row['Paddle'])
    .map(row => row['Paddle'] || 'Unknown')
    .sort((a, b) => a.localeCompare(b));

  console.log('Filtered data:', mappedData);
  console.log('Excluded paddles:', excludedPaddles);

  return { filteredData: mappedData, excludedPaddles };
}
