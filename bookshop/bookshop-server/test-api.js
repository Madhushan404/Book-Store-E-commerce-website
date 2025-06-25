const http = require('http');

const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'password123',
  contactNumber: '1234567890',
  address: '123 Test St'
};

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(testUser))
  }
};

console.log('Testing registration endpoint...');
console.log('Sending data:', JSON.stringify(testUser));

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

req.write(JSON.stringify(testUser));
req.end(); 