const fs = require('fs');
const path = require('path');

const envContent = `MONGODB_URI=mongodb+srv://daspi:bmjdaspi810@cluster0d-bookstore.ecagoyx.mongodb.net/?retryWrites=true&w=majority
PORT=5001
JWT_SECRET=bookshop_secret_key`;

try {
  const envPath = path.resolve(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);
  console.log('.env file created successfully at:', envPath);
  console.log('Content written:', envContent);
  
  // Verify the file was created
  if (fs.existsSync(envPath)) {
    console.log('File exists after creation');
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('Content read back:', content);
  } else {
    console.log('File does not exist after attempted creation');
  }
} catch (error) {
  console.error('Error creating .env file:', error);
} 