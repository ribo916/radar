const columnMapping = {
  'Company': 'company',
  'Paddle': 'paddle',
  'Core_Thickness_mm': 'thickness',
  'Power_Percentile': 'power_percentile',
  'Spin_Percentile': 'spin_percentile',
  'Twist_Weight_Percentile': 'twist_percentile',
  'Balance_Point_Percentile': 'balance_percentile',
  'Swing_Weight_Percentile': 'swing_percentile',
  'Pop_Percentile': 'pop_percentile',
  'Shape': 'shape',
  'Surface_Material': 'face_material',
  'Handle_Length_in': 'handle_length',
  'Spin_RPM': 'spin_rpm',
  'Swing_Weight': 'swing_weight',
  'Twist_Weight': 'twist_weight',
  'Core_Material': 'core_material',
  'Surface_Texture': 'surface_texture',
  'Length_in': 'length',
  'Width_in': 'width',
  'Static_Weight_oz': 'static_weight',
  'Balance_Point_cm': 'balance_point_cm',
  'Serve_Speed_MPH_Power': 'serve_speed_mph',
  'Punch_Volley_Speed_MPH_Pop': 'punch_volley_speed'
};

export async function loadAndProcessDataFromXano() {
  const apiUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:l0-i5bo6/2024_09_12_paddles';
  console.log(`Requesting data from API: ${apiUrl}`);

  const response = await fetch(apiUrl, {
    headers: {
      'Authorization': 'none'
    }
  });

  console.log(`Response status: ${response.status}`);

  const data = await response.json();
  console.log('Response data:', data);

  const mappedData = data.map((record, index) => {
    const mappedRow = {};
    for (const [originalColumn, newColumn] of Object.entries(columnMapping)) {
      mappedRow[newColumn] = record[originalColumn];
    }
    return mappedRow;
  });

  console.log('Mapped data:', mappedData);

  const xKey = ['power_percentile', 'spin_percentile', 'twist_percentile', 'balance_percentile', 'swing_percentile', 'pop_percentile'];

  mappedData.forEach((d) => {
    xKey.forEach(key => {
      let value = d[key];
      if (value !== undefined && value !== '' && !isNaN(parseFloat(value))) {
        // Strip the '%' symbol and convert to decimal
        value = parseFloat(value.replace('%', '')) / 100;
        // Multiply by 100 and round the value to the nearest whole number, then divide by 10
        value = Math.round(value * 100) / 10;
        // Assign the rounded value back to the object
        d[key] = value;
      } else {
        d[key] = 0; // Set to 0 if invalid or missing
      }
    });
  });

  // Sort by company and then by paddle
  mappedData.sort((a, b) => {
    if (a.company < b.company) return -1;
    if (a.company > b.company) return 1;
    if (a.paddle < b.paddle) return -1;
    if (a.paddle > b.paddle) return 1;
    return 0;
  });

  return { filteredData: mappedData };
}
