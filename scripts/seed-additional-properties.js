require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const additionalProperties = [
      {
        name: "PARK VIEW PREMIUM",
        slug: "park-view-premium",
        developerName: "Vaneet Group",
        propertyType: "APARTMENT",
        purpose: "END_USE",
        status: "READY_TO_MOVE",
        featured: false,
        published: true,
        address: "Sector 85, Zirakpur, Punjab",
        locality: "Sector 85",
        city: "Zirakpur",
        state: "Punjab",
        priceMin: 4500000,
        priceLabel: "Onwards",
        configuration: "2 & 3 BHK Apartments",
        areaMin: 1200,
        areaMax: 2200,
        areaUnit: "sq.ft.",
        shortDescription: "Ready-to-move premium apartments in a prime location with modern amenities.",
        description: "Park View Premium offers well-designed 2 and 3 BHK apartments in Sector 85, Zirakpur.",
        highlights: JSON.stringify(["Ready to Move", "Prime Location", "Modern Amenities", "24x7 Security"]),
        amenities: JSON.stringify(["Park", "Gym", "Children Play Area", "24x7 Security"]),
      },
      {
        name: "CELESTIAL HEIGHTS",
        slug: "celestial-heights",
        developerName: "Celestial Developers",
        propertyType: "APARTMENT",
        purpose: "BOTH",
        status: "UNDER_CONSTRUCTION",
        featured: false,
        published: true,
        address: "Sector 66, Mohali, Punjab",
        locality: "Sector 66",
        city: "Mohali",
        state: "Punjab",
        priceMin: 5800000,
        priceLabel: "Onwards",
        configuration: "3 & 4 BHK Residences",
        areaMin: 1650,
        areaMax: 3200,
        areaUnit: "sq.ft.",
        totalTowers: 3,
        totalUnits: 180,
        totalArea: "5 Acres",
        shortDescription: "Luxury residences offering panoramic views and world-class amenities.",
        description: "Celestial Heights is a premium residential project in Sector 66, Mohali.",
        highlights: JSON.stringify(["Panoramic Views", "World-Class Amenities", "Green Living", "Smart Home Features"]),
        amenities: JSON.stringify(["Infinity Pool", "Rooftop Garden", "Gym", "Spa", "Clubhouse", "Kids Zone"]),
      },
      {
        name: "ROYAL ENCLAVE",
        slug: "royal-enclave",
        developerName: "Royal Builders",
        propertyType: "VILLA",
        purpose: "END_USE",
        status: "READY_TO_MOVE",
        featured: true,
        published: true,
        address: "PR-7, Chandigarh Airport Road, Zirakpur",
        locality: "PR-7 Airport Road",
        city: "Zirakpur",
        state: "Punjab",
        priceMin: 12000000,
        priceLabel: "Onwards",
        configuration: "4 & 5 BHK Independent Villas",
        areaMin: 3500,
        areaMax: 6000,
        areaUnit: "sq.ft.",
        totalArea: "25 Acres",
        shortDescription: "Exclusive independent villas with private gardens and premium finishes.",
        description: "Royal Enclave offers exclusive 4 and 5 BHK independent villas on Airport Road.",
        highlights: JSON.stringify(["Private Gardens", "Premium Finishes", "Smart Home", "Gated Community", "Clubhouse"]),
        amenities: JSON.stringify(["Private Garden", "Swimming Pool", "Gym", "Tennis Court", "Jogging Track", "24x7 Security"]),
      },
      {
        name: "METRO SQUARE",
        slug: "metro-square",
        developerName: "Metro Group",
        propertyType: "COMMERCIAL",
        purpose: "INVESTMENT",
        status: "NEW_LAUNCH",
        featured: false,
        published: true,
        address: "Phase 5, Mohali, Punjab",
        locality: "Phase 5",
        city: "Mohali",
        state: "Punjab",
        priceMin: 8000000,
        priceLabel: "Onwards",
        configuration: "Retail Shops | Office Spaces",
        totalArea: "3 Acres",
        shortDescription: "Prime commercial spaces in the heart of Mohali's business district.",
        description: "Metro Square offers premium retail shops and office spaces in Phase 5, Mohali.",
        highlights: JSON.stringify(["Prime Location", "High Footfall", "Modern Design", "Ample Parking"]),
      },
      {
        name: "GREEN VALLEY HOMES",
        slug: "green-valley-homes",
        developerName: "Valley Developers",
        propertyType: "INDEPENDENT_FLOOR",
        purpose: "END_USE",
        status: "READY_TO_MOVE",
        featured: false,
        published: true,
        address: "Sector 125, Mohali, Punjab",
        locality: "Sector 125",
        city: "Mohali",
        state: "Punjab",
        priceMin: 3200000,
        priceLabel: "Onwards",
        configuration: "2 & 3 BHK Independent Floors",
        areaMin: 1100,
        areaMax: 1800,
        areaUnit: "sq.ft.",
        shortDescription: "Spacious independent floors surrounded by lush greenery.",
        description: "Green Valley Homes offers well-designed independent floors in Sector 125, Mohali.",
        highlights: JSON.stringify(["Green Surroundings", "Spacious Layout", "Ready to Move", "Family Friendly"]),
        amenities: JSON.stringify(["Garden", "Parking", "24x7 Water", "Power Backup"]),
      },
      {
        name: "THE PRISTINE HEIGHTS",
        slug: "the-pristine-heights",
        developerName: "Pristine Developers",
        propertyType: "APARTMENT",
        purpose: "BOTH",
        status: "NEW_LAUNCH",
        featured: false,
        published: true,
        address: "Sector 82, Mohali, Punjab",
        locality: "Sector 82",
        city: "Mohali",
        state: "Punjab",
        priceMin: 4200000,
        priceLabel: "Onwards",
        configuration: "2 & 3 BHK Apartments",
        areaMin: 1100,
        areaMax: 2400,
        areaUnit: "sq.ft.",
        totalTowers: 6,
        totalUnits: 480,
        shortDescription: "Modern apartments with excellent connectivity and premium amenities.",
        description: "The Pristine Heights offers modern 2 and 3 BHK apartments in Sector 82, Mohali.",
        highlights: JSON.stringify(["Excellent Connectivity", "Premium Amenities", "Modern Design", "Eco-Friendly"]),
        amenities: JSON.stringify(["Swimming Pool", "Gym", "Clubhouse", "Landscaped Gardens", "Kids Play Area"]),
      },
    ];

    let created = 0;
    for (const prop of additionalProperties) {
      const existing = await prisma.property.findUnique({ where: { slug: prop.slug } });
      if (!existing) {
        await prisma.property.create({ data: prop });
        created++;
        console.log(`Created: ${prop.name}`);
      } else {
        console.log(`Skipped (exists): ${prop.name}`);
      }
    }

    console.log(`\nAdditional seed completed! Created ${created} new properties.`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
