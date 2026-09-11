try { require("dotenv/config"); } catch (e) { /* env vars set by platform */ }

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const STORAGE_BASE = process.env.PROPERTY_STORAGE_PATH || "./storage";
const STORAGE_ROOT = path.join(STORAGE_BASE, "properties");

function getPropertyImages(folderName, coverFileName) {
  const resolvedRoot = path.resolve(STORAGE_ROOT);
  const folderPath = path.join(resolvedRoot, folderName, "images");

  if (!fs.existsSync(folderPath)) {
    console.warn(`  ⚠ Images folder not found: ${folderPath} — skipping images`);
    return [];
  }

  const files = fs
    .readdirSync(folderPath)
    .filter((file) =>
      IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.warn(`  ⚠ No images in ${folderPath} — skipping images`);
    return [];
  }

  const coverExists = files.includes(coverFileName);

  return files.map((file, index) => ({
    imageUrl: `/images/properties/${folderName}/${file}`,
    sortOrder: index,
    isCover: coverExists ? file === coverFileName : index === 0,
  }));
}

function getBrochure(folderName) {
  const resolvedRoot = path.resolve(STORAGE_ROOT);
  const brochureDir = path.join(resolvedRoot, folderName, "brochure");

  if (!fs.existsSync(brochureDir)) {
    return null;
  }

  const pdfs = fs
    .readdirSync(brochureDir)
    .filter((file) => file.toLowerCase().endsWith(".pdf"));

  if (pdfs.length === 0) {
    return null;
  }

  const pdf = pdfs[0];
  const filePath = path.join(brochureDir, pdf);
  const stats = fs.statSync(filePath);
  const sizeKB = Math.round(stats.size / 1024);
  const sizeStr = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

  return {
    brochureUrl: `/brochures/${folderName}/${pdf}`,
    brochureName: pdf,
    brochureSize: sizeStr,
  };
}

async function main() {
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "loaded" : "MISSING"
  );

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Check if admin already exists — if yes, skip seeding
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      console.log("Database already seeded. Skipping.");
      return;
    }

    console.log("First run detected. Seeding database...");

    await prisma.propertyImage.deleteMany();
    await prisma.property.deleteMany();

    console.log("Cleared existing properties.");

    // ============================================================
    // ASCENT GRANDIS
    // ============================================================

    const ascentGrandis = await prisma.property.create({
      data: {
        name: "ASCENT GRANDIS",
        slug: "ascent-grandis",
        developerName: "Vaneet Infra",

        propertyType: "APARTMENT",
        purpose: "BOTH",
        status: "NEW_LAUNCH",

        featured: true,
        published: true,

        address: "Chandigarh Airport Road (PR-7), Zirakpur, Punjab",
        locality: "Chandigarh Airport Road (PR-7)",
        city: "Zirakpur",
        state: "Punjab",

        // No price value taken from brochure.
        priceMin: null,
        priceMax: null,
        priceLabel: null,

        configuration:
          "3 & 4 BHK Apartments | Penthouses | Duplex Apartments",

        // No verified area range in brochure.
        areaMin: null,
        areaMax: null,
        areaUnit: null,

        possession: null,

        // Brochure confirms 31 floors, not total tower count/units.
        totalTowers: null,
        totalUnits: null,
        totalArea: null,

        reraNumber: null,
        legalNote: null,

        shortDescription:
          "ASCENT GRANDIS is a residential development on Chandigarh Airport Road, rising 31 floors above the skyline and offering 3 & 4 BHK apartments, penthouses and duplex apartments.",

        description:
          "ASCENT GRANDIS is set to become Zirakpur's tallest residential development. Thoughtfully designed towers, expansive residences and curated lifestyle amenities come together to create a destination where space, privacy and design exist in balance.",

        highlights: [
          "Rising 31 Floors Above the Skyline",
          "3 & 4 BHK Apartments",
          "Penthouses",
          "Duplex Apartments",
          "102+ Experiential Lifestyle Amenities",
          "Signature Skywalk",
          "Sky Gardens",
          "Sky Lounge",
          "Rooftop Leisure Deck",
        ],

        amenities: [
          "State-of-the-art Gymnasium",
          "Yoga Studio",
          "Pilates Studio",
          "Dance Studio",
          "Meditation Room",
          "Steam Bath",
          "Sauna Room",
          "Indoor Fitness Studio",
          "Outdoor Gym Zone",
          "Jogging Track",
          "Walking Trails",
          "Aerobics Studio",
          "Wellness Lounge",
          "Reflexology Pathway",
          "Senior Citizen Fitness Zone",

          "Multipurpose Sports Court",
          "Basketball Court",
          "Lawn Tennis Court",
          "Pickleball Court",
          "Skating Rink",
          "Box Cricket Arena",
          "Table Tennis Room",
          "Indoor Games Lounge",
          "Badminton Court",
          "Cricket Practice Nets",
          "Cycling Track",
          "Kids Sports Arena",
          "Open Activity Lawn",
          "Recreational Play Court",

          "All-weather Swimming Pool",
          "Kids Swimming Pool",
          "Pool Deck Lounge",
          "Jacuzzi / Hydrotherapy Pool",
          "Landscape Water Features",
          "Reflective Water Bodies",

          "Signature Skywalk",
          "Sky Gardens",
          "Sky Lounge",
          "Rooftop Leisure Deck",
          "Sunset Viewing Deck",
          "Sky Meditation Zone",
          "Sky Seating Pavilions",
          "Elevated Viewing Terraces",

          "Central Green Park",
          "Flower Garden",
          "Butterfly Garden",
          "Zen Garden",
          "Herb Garden",
          "Therapy Garden",
          "Meditation Garden",

          "Indoor Kids Play Zone",
          "Outdoor Children Play Park",
          "Toddler Play Area",
          "Soft-floor Play Zone",
          "Sandpit Play Area",
          "Kids Arcade Gaming Zone",
          "Dedicated Day-care Facility",
          "Family Picnic Lawns",
          "Learning Activity Room",
          "Kids Disco",

          "CCTV Surveillance",
          "Biometric Tower Access",
          "24x7 Security Command Centre",
          "Emergency Alarm System",
          "Paramedic Assistance",
          "Dedicated Ambulance Provision",
          "Doctor-on-call Coordination",

          "Double Basement Parking",
          "Two Car Parks Per Residence",
          "EV Charging Stations",
          "Golf Cart Mobility",
          "Smart Boom Barrier Entry",
          "Visitor Parking",
          "Bicycle Parking",

          "Mini Theatre",
          "Banquet Hall",
          "Celebration Lawn",
          "Party Lounge",
          "Social Plaza",
          "Indoor Games Club",
          "Cafe Lounge",
          "Community Interaction Zone",
          "Reading Lounge",
          "Co-working Space",
        ],

        specifications: [
          { label: "Floors", value: "31 Floors" },
          { label: "Configurations", value: "3 & 4 BHK Apartments | Penthouses | Duplex Apartments" },
          { label: "Lifestyle Amenities", value: "102+ Experiential Lifestyle Amenities" },
          { label: "Security", value: "Biometric tower access, CCTV monitoring and 24x7 command centre" },
          { label: "Parking", value: "Double basement parking with stack provision; two car parks per residence" },
          { label: "Mobility", value: "EV charging stations, golf cart mobility and smart boom barrier entry" },
        ],

        ...getBrochure("ascent-grandis"),
      },
    });

    const ascentImages = getPropertyImages(
      "ascent-grandis",
      "ascent-grandis-exterior-03.jpg"
    );

    if (ascentImages.length > 0) {
      await prisma.propertyImage.createMany({
        data: ascentImages.map((image) => ({
          ...image,
          propertyId: ascentGrandis.id,
        })),
      });
    }

    console.log(
      `Created ASCENT GRANDIS with ${ascentImages.length} images`
    );

    // ============================================================
    // THE MALL OF CHANDIGARH
    // ============================================================

    const mallOfChandigarh = await prisma.property.create({
      data: {
        name: "THE MALL OF CHANDIGARH",
        slug: "the-mall-of-chandigarh",
        developerName: "Vaneet Infra",

        propertyType: "COMMERCIAL",
        purpose: "INVESTMENT",
        status: "NEW_LAUNCH",

        featured: true,
        published: true,

        address:
          "200' Wide PR-08 Chandigarh International Airport Road",
        locality: "Chandigarh International Airport Road (PR-08)",
        city: "Chandigarh",
        state: "Chandigarh",

        // No verified price in brochure.
        priceMin: null,
        priceMax: null,
        priceLabel: null,

        configuration:
          "Premium Retail | Entertainment | Food & Beverage",

        areaMin: null,
        areaMax: null,
        areaUnit: null,

        possession: null,

        totalTowers: null,
        totalUnits: null,
        totalArea: "19 Acres",

        reraNumber: null,
        legalNote: null,

        shortDescription:
          "A 19-acre open-air retail and lifestyle destination combining premium retail, entertainment, dining and leisure.",

        description:
          "The Mall of Chandigarh is a 19-acre retail destination blending shopping, dining, leisure and lifestyle. The development brings together premium retail, entertainment and food & beverage in an integrated destination.",

        highlights: [
          "19-Acre Retail Destination",
          "Premium Retail",
          "Entertainment",
          "Food & Beverage",
          "2.32-Acre Lake",
          "Landscaped Greens",
          "Water Promenades",
          "Wide Open Boulevards",
          "Golf-Range Leisure Areas",
          "Expansive Parking",
          "Multi-storey Shop Clusters",
        ],

        amenities: [
          "Premium Retail Spaces",
          "Entertainment",
          "Food & Beverage",
          "Central Lake",
          "Landscaped Greens",
          "Water Promenades",
          "Wide Open Boulevards",
          "Golf-Range Leisure Areas",
          "Expansive Parking",
          "Multi-storey Shop Clusters",
        ],

        specifications: [
          { label: "Development Size", value: "19 Acres" },
          { label: "Lake Size", value: "2.32 Acres" },
          { label: "Development Type", value: "Open-Air Retail & Lifestyle Destination" },
          { label: "Categories", value: "Retail, Entertainment, Food & Beverage" },
        ],

        ...getBrochure("the-mall-of-chandigarh"),
      },
    });

    const mallImages = getPropertyImages(
      "the-mall-of-chandigarh",
      "mall-of-chandigarh-page-03-image-01.jpeg"
    );

    if (mallImages.length > 0) {
      await prisma.propertyImage.createMany({
        data: mallImages.map((image) => ({
          ...image,
          propertyId: mallOfChandigarh.id,
        })),
      });
    }

    console.log(
      `Created THE MALL OF CHANDIGARH with ${mallImages.length} images`
    );

    // ============================================================
    // FASHIONTV PARC
    // ============================================================

    const fashiontvParc = await prisma.property.create({
      data: {
        name: "FashionTV Parc",
        slug: "fashiontv-parc",
        developerName: "Vaneet Infra",

        propertyType: "APARTMENT",
        purpose: "BOTH",
        status: "NEW_LAUNCH",

        featured: true,
        published: true,

        address:
          "PR-11 Chandigarh Airport Road, Derabassi, Punjab",
        locality: "PR-11 Chandigarh Airport Road",
        city: "Derabassi",
        state: "Punjab",

        // No verified price in brochure.
        priceMin: null,
        priceMax: null,
        priceLabel: null,

        configuration: "2 & 3 BHK Luxury Residences",

        areaMin: null,
        areaMax: null,
        areaUnit: null,

        possession: null,

        totalTowers: null,
        totalUnits: null,
        totalArea: null,

        reraNumber: null,

        legalNote:
          "The project brochure states that the land parcel is self-owned and mortgage free. This should be independently verified before making any legal or financial representation.",

        shortDescription:
          "A FashionTV branded luxury residential development offering 2 & 3 BHK residences with a 15,000 Sq. Ft. clubhouse and extensive lifestyle facilities.",

        description:
          "FashionTV Parc is a luxury residential development on PR-11 Chandigarh Airport Road, Derabassi. The brochure presents a gated community with designer lobbies, FashionTV Family Lounges, a 15,000 Sq. Ft. Club House, smart security and technology-enabled facilities.",

        highlights: [
          "2 & 3 BHK Luxury Residences",
          "15,000 Sq. Ft. Club House",
          "Approx. 500 Acres Green Area",
          "Gated Community",
          "Designer Entrance Lobbies",
          "FashionTV Family Lounge in Each Tower",
          "Library Café",
          "Co-working Lounge",
          "FashionTV Selfie Point",
          "High-Speed Wi-Fi Zones",
          "App-Based Facility Booking",
          "5-Level Security System",
          "EV Charging Stations",
          "Smart Door Locks",
          "On-Site Medical Room",
        ],

        amenities: [
          "Designer Lobby",
          "FashionTV Family Lounge",
          "Library Café",
          "Co-working Lounge",
          "FashionTV Selfie Point",
          "High-Speed Wi-Fi Zones",
          "App-Based Facility Booking",

          "5-Level Security System",
          "CCTV Surveillance",
          "Entry Guards",
          "Tower Security",
          "Smart Surveillance",

          "On-Site Medical Room",
          "EV Charging Stations",
          "Smart Door Locks",
          "Guest Entry via App",

          "Premium Elevators",
          "Intercom Connectivity",
          "24x7 Power Backup",
          "Individual Car Parking",
          "Cover Parking",
          "Retail Spaces",
          "Fire Safety System",
          "Fire Alarms",
        ],

        specifications: [
          { label: "Configurations", value: "2 & 3 BHK Luxury Residences" },
          { label: "Clubhouse", value: "15,000 Sq. Ft." },
          { label: "Security", value: "5-Level Security System — CCTV, Entry Guards, Tower Security, Smart Surveillance" },
          { label: "Technology", value: "Smart Door Locks, App-Based Facility Booking, Guest Entry via App, High-Speed Wi-Fi Zones" },
          { label: "Infrastructure", value: "Premium Elevators, Intercom Connectivity, 24x7 Power Backup, EV Charging Stations, Individual Car Parking, Cover Parking" },
        ],

        ...getBrochure("fashiontv-parc"),
      },
    });

    const fashionImages = getPropertyImages(
      "fashiontv-parc",
      "fashiontv-parc-page-21-image-02.jpeg"
    );

    if (fashionImages.length > 0) {
      await prisma.propertyImage.createMany({
        data: fashionImages.map((image) => ({
          ...image,
          propertyId: fashiontvParc.id,
        })),
      });
    }

    console.log(
      `Created FashionTV Parc with ${fashionImages.length} images`
    );

    console.log("\nSeed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();