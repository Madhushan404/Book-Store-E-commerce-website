const http = require('http');

const loginCredentials = {
  email: 'test@example.com',
  password: 'password123'
};

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(loginCredentials))
  }
};

console.log('Testing login endpoint...');
console.log('Sending data:', JSON.stringify(loginCredentials));

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Body:', data);
    try {
      const parsedData = JSON.parse(data);
      console.log('Parsed JSON:', parsedData);
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(JSON.stringify(loginCredentials));
req.end(); 