const https = require('https');

https.get('https://www.dongyang.ac.kr/dmu/4904/subview.do', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // try to match <table or related notice list structure
    const match = data.substring(0, 100000); // just checking if we matched something
    console.log("Got data size:", data.length);
    // Find all rows
    const fs = require('fs');
    fs.writeFileSync('dmu.html', data);
    console.log("Written to dmu.html");
  });
});
