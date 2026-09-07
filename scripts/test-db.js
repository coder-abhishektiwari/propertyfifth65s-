const { Pool } = require('pg');

async function test() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    const r = await pool.query('SELECT count(*) FROM "Property"');
    console.log('DB OK, properties:', r.rows[0].count);
  } catch (e) {
    console.error('DB ERROR:', e.message);
  } finally {
    await pool.end();
  }
}
require('dotenv/config');
test();
