require("dotenv/config");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  console.log("Connecting to DB...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log("Querying admin...");
  const res = await pool.query('SELECT id, email, "passwordHash" FROM "Admin" LIMIT 1');

  if (res.rows.length === 0) {
    console.log("NO ADMIN FOUND");
    await pool.end();
    return;
  }

  const admin = res.rows[0];
  console.log("Admin email:", admin.email);
  console.log("Hash:", admin.passwordHash);

  const match = await bcrypt.compare("admin->Developer", admin.passwordHash);
  console.log("Match:", match);

  if (!match) {
    const newHash = await bcrypt.hash("admin->Developer", 12);
    await pool.query('UPDATE "Admin" SET "passwordHash" = $1 WHERE id = $2', [newHash, admin.id]);
    console.log("Password reset. New hash:", newHash);
    console.log("Verify:", await bcrypt.compare("admin->Developer", newHash));
  }

  await pool.end();
  console.log("Done.");
}

main().catch((e) => {
  console.error("CAUGHT:", e);
  process.exit(1);
});
