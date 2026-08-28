const http = require('http');
http.get('http://localhost:5173/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Response size:', data.length, 'bytes'));
});
