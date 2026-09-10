const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const admin = await prisma.admin.findFirst();
  if (!admin) {
    console.log("No admin found");
    await pool.end();
    return;
  }

  console.log("Email:", admin.email);
  console.log("Stored hash:", admin.passwordHash);

  const match = await bcrypt.compare("admin->Developer", admin.passwordHash);
  console.log("Match with 'admin->Developer':", match);

  if (!match) {
    const hash = await bcrypt.hash("admin->Developer", 12);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: hash },
    });
    console.log("Password updated to 'admin->Developer'");
    const verify = await bcrypt.compare("admin->Developer", hash);
    console.log("Verify after update:", verify);
  }

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
