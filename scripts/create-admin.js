require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  const existing = await prisma.admin.findUnique({
    where: { email: "admin@propertyfifth.com" },
  });

  if (existing) {
    console.log("Admin already exists:", existing.email);
    await prisma.$disconnect();
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      email: "admin@propertyfifth.com",
      passwordHash: "$2b$12$omgIsKHJgEC.APft/gD6C.B8xcULRmUD224J3OlqLnEI3RIEmzM6K",
    },
  });

  console.log("Admin created:", admin.email);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
