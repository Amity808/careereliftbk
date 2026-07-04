const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse the .env file to avoid needing the 'dotenv' module
try {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;
    const key = trimmed.substring(0, separatorIndex).trim();
    const value = trimmed.substring(separatorIndex + 1).trim();
    envVars[key] = value;
  });

  const url = envVars.DATABASE_URL;
  console.log('Using DATABASE_URL from .env:', url);

  if (!url) {
    console.error('❌ ERROR: DATABASE_URL not found in .env file!');
    process.exit(1);
  }

  const client = new Client({ connectionString: url });
  
  console.log('Attempting to connect to PostgreSQL...');
  client.connect()
    .then(async () => {
      console.log('✅ SUCCESS: Connected to PostgreSQL database!');
      const res = await client.query('SELECT current_database(), now()');
      console.log('Result:', res.rows[0]);
      await client.end();
    })
    .catch(err => {
      console.error('❌ CONNECTION ERROR:', err.message);
      console.error('Code:', err.code);
      process.exit(1);
    });

} catch (err) {
  console.error('Script error:', err.message);
}
