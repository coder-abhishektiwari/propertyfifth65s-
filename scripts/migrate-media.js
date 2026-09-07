require("dotenv/config");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const STORAGE_ROOT = process.env.PROPERTY_STORAGE_PATH || "./storage/properties";
const PUBLIC_PROPERTIES_DIR = path.join(process.cwd(), "public", "images", "properties");

function parseOldImageUrl(imageUrl) {
  const match = imageUrl.match(/^\/images\/properties\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  return { slug: match[1], filename: match[2] };
}

async function main() {
  console.log("=== Property Media Migration ===");
  console.log(`Storage root: ${path.resolve(STORAGE_ROOT)}`);
  console.log(`Public source: ${PUBLIC_PROPERTIES_DIR}\n`);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const images = await prisma.propertyImage.findMany({
      select: { id: true, imageUrl: true, propertyId: true },
    });

    console.log(`Found ${images.length} property images in database.\n`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const image of images) {
      const parsed = parseOldImageUrl(image.imageUrl);
      if (!parsed) {
        console.log(`  SKIP (unrecognized format): ${image.imageUrl}`);
        skipped++;
        continue;
      }

      const { slug, filename } = parsed;
      const srcPath = path.join(PUBLIC_PROPERTIES_DIR, slug, filename);
      const destDir = path.join(STORAGE_ROOT, slug, "images");
      const destPath = path.join(destDir, filename);

      if (!fs.existsSync(srcPath)) {
        console.log(`  SKIP (source missing): ${srcPath}`);
        skipped++;
        continue;
      }

      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(srcPath, destPath);

      if (!fs.existsSync(destPath)) {
        console.log(`  ERROR (copy failed): ${destPath}`);
        errors++;
        continue;
      }

      const newUrl = `/images/properties/${slug}/${filename}`;
      await prisma.propertyImage.update({
        where: { id: image.id },
        data: { imageUrl: newUrl },
      });

      console.log(`  OK: ${slug}/${filename}`);
      migrated++;
    }

    console.log(`\n=== Migration Complete ===`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped:  ${skipped}`);
    console.log(`Errors:   ${errors}`);

    if (errors === 0) {
      console.log(`\nAll files migrated successfully.`);
      console.log(`You can now safely remove: ${PUBLIC_PROPERTIES_DIR}`);
      console.log(`Run: Remove-Item -Recurse -Force "${PUBLIC_PROPERTIES_DIR}"`);
    } else {
      console.log(`\nSome files had errors. Fix them before removing public images.`);
    }
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
