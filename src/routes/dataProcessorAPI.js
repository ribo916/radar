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
  
  export async function loadAndProcessDataFromAPI() {
    const apiUrl = 'https://api.airtable.com/v0/app3MN0hMBADkRqSj/tblzA9TRV5BscXDHH';
    console.log(`Requesting data from API: ${apiUrl}`);
  
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': 'Bearer patjACwgjxO1E1Pdg.d01120f3140b22921d9f4e3cb0d1e70f0e6fd21e551718677aeb01885a0a0906'
      }
    });
  
    console.log(`Response status: ${response.status}`);
  
    const data = await response.json();
    console.log('Response data:', data);
  
    const mappedData = data.records.map((record, index) => {
      const mappedRow = {};
      for (const [originalColumn, newColumn] of Object.entries(columnMapping)) {
        mappedRow[newColumn] = record.fields[originalColumn];
      }
      return mappedRow;
    });
  
    console.log('Mapped data:', mappedData);
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
  
      if (d.paddle.startsWith('Carbon')) {
        if (allValid) {
          console.log(`Paddle ${d.paddle} approved`);
          console.log(d);
          console.log(`${d.pop_percentile}`);
        }
      }
  
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
    console.log('Filtered data:', filteredData);

    const excludedPaddles = mappedData
      .filter(d => !filteredData.includes(d))
      .map(d => d.paddle)
      .sort((a, b) => a.localeCompare(b));
    console.log('Excluded paddles:', excludedPaddles);
  
    return { filteredData, excludedPaddles };
  }