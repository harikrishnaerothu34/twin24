import http from 'http';

console.log('🔍 Fetching your public IP address...\n');

http.get('http://ipv4.icanhazip.com/', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const publicIP = data.trim();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 Your Public IP Address: ' + publicIP);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('✅ STEPS TO WHITELIST YOUR IP IN MONGODB ATLAS:\n');
    console.log('1. Go to: https://cloud.mongodb.com/');
    console.log('2. Log in with your account');
    console.log('3. Click on your project "cluster0"');
    console.log('4. Go to: NETWORK ACCESS (left sidebar)');
    console.log('5. Click: "ADD IP ADDRESS"');
    console.log(`6. Enter this IP: ${publicIP}`);
    console.log('7. Click: "ADD IP ADDRESS" button');
    console.log('8. Wait 1-2 minutes for changes to apply\n');
    
    console.log('OR for development (less secure):\n');
    console.log('5. Click: "ADD IP ADDRESS"');
    console.log('6. Select: "Allow Access from Anywhere"');
    console.log('7. Enter: 0.0.0.0/0');
    console.log('8. Click: "ADD IP ADDRESS" button\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('After whitelisting, run: npm run dev');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });
}).on('error', () => {
  console.log('⚠️  Could not fetch public IP automatically.\n');
  console.log('Alternative methods to find your public IP:\n');
  console.log('1. Visit: https://www.whatismyipaddress.com/');
  console.log('2. Or: https://ipinfo.io/');
  console.log('3. Or Google: "what is my ip"\n');
  console.log('Then whitelist that IP in MongoDB Atlas Network Access settings.\n');
});
