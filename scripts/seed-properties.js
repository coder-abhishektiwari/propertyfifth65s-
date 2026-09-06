require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "loaded" : "MISSING");
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.propertyImage.deleteMany();
    await prisma.property.deleteMany();
    console.log("Cleared existing properties.");

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
        priceMin: 3500000,
        priceLabel: "Onwards",
        configuration: "3 & 4 BHK Apartments | Penthouses | Duplex Apartments",
        areaMin: 1800,
        areaMax: 4500,
        areaUnit: "sq.ft.",
        totalTowers: 4,
        totalUnits: 320,
        totalArea: "8 Acres",
        shortDescription: "A premium residential development offering luxury apartments, penthouses, and duplex apartments with 102+ lifestyle amenities.",
        description: "Ascent Grandis is a landmark residential project located on Chandigarh Airport Road.",
        highlights: JSON.stringify(["75% Open Green Space", "20,000+ Sq.Ft. Clubhouse", "3-Tier Security System", "EV Charging Stations"]),
        amenities: JSON.stringify(["Clubhouse", "Swimming Pool", "Gymnasium", "Kids Play Area", "Jogging Track", "24x7 Security"]),
      },
    });

    const ascentImages = [
      { imageUrl: "/images/properties/ascent-grandis/ascent-grandis-exterior-03.jpg", sortOrder: 0, isCover: true },
      { imageUrl: "/images/properties/ascent-grandis/ascent-grandis-exterior-01.jpg", sortOrder: 1, isCover: false },
      { imageUrl: "/images/properties/ascent-grandis/ascent-grandis-exterior-02.jpg", sortOrder: 2, isCover: false },
      { imageUrl: "/images/properties/ascent-grandis/ascent-grandis-clubhouse.jpg", sortOrder: 3, isCover: false },
      { imageUrl: "/images/properties/ascent-grandis/ascent-grandis-pool.jpg", sortOrder: 4, isCover: false },
      { imageUrl: "/images/properties/ascent-grandis/ascent-grandis-living-room.jpg", sortOrder: 5, isCover: false },
      { imageUrl: "/images/properties/ascent-grandis/ascent-grandis-bedroom.jpg", sortOrder: 6, isCover: false },
    ];
    for (const img of ascentImages) {
      await prisma.propertyImage.create({ data: { ...img, propertyId: ascentGrandis.id } });
    }
    console.log("Created: Ascent Grandis");

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
        address: "Chandigarh International Airport Road (PR-08), Chandigarh",
        locality: "Chandigarh International Airport Road (PR-08)",
        city: "Chandigarh",
        state: "Chandigarh",
        priceMin: 5000000,
        priceLabel: "Onwards",
        configuration: "Premium Retail | F&B | Entertainment",
        totalArea: "Approx. 500 Acres Green Area",
        shortDescription: "A premium commercial mall offering retail, food & beverage, and entertainment spaces in Chandigarh.",
        description: "The Mall of Chandigarh is a premier commercial destination located on the International Airport Road.",
        highlights: JSON.stringify(["Approx. 500 Acres Green Area", "15,000 Sq. Ft. Club House", "Premium Retail Spaces"]),
      },
    });

    const mallImages = [
      { imageUrl: "/images/properties/the-mall-of-chandigarh/mall-of-chandigarh-page-03-image-01.jpeg", sortOrder: 0, isCover: true },
      { imageUrl: "/images/properties/the-mall-of-chandigarh/mall-of-chandigarh-page-01-image-01.jpeg", sortOrder: 1, isCover: false },
      { imageUrl: "/images/properties/the-mall-of-chandigarh/mall-of-chandigarh-page-02-image-01.jpeg", sortOrder: 2, isCover: false },
      { imageUrl: "/images/properties/the-mall-of-chandigarh/mall-of-chandigarh-page-04-image-01.jpeg", sortOrder: 3, isCover: false },
    ];
    for (const img of mallImages) {
      await prisma.propertyImage.create({ data: { ...img, propertyId: mallOfChandigarh.id } });
    }
    console.log("Created: The Mall of Chandigarh");

    const fashiontvParc = await prisma.property.create({
      data: {
        name: "FashionTV Parc",
        slug: "fashiontv-parc",
        developerName: "Vaneet Infra",
        propertyType: "VILLA",
        purpose: "BOTH",
        status: "NEW_LAUNCH",
        featured: true,
        published: true,
        address: "PR-11 Chandigarh Airport Road, Derabassi, Punjab",
        locality: "PR-11 Chandigarh Airport Road",
        city: "Derabassi",
        state: "Punjab",
        priceMin: 4500000,
        priceLabel: "Onwards",
        configuration: "Luxury Residences",
        totalArea: "19 Acres",
        shortDescription: "India's first FashionTV branded residential development offering luxury villas and residences.",
        description: "FashionTV Parc is India's first FashionTV branded residential development.",
        highlights: JSON.stringify(["India's First FashionTV Branded Development", "19 Acres Premium Development", "Luxury Villas & Residences"]),
        amenities: JSON.stringify(["Clubhouse", "Swimming Pool", "Gymnasium", "Spa & Wellness", "Kids Play Area", "24x7 Security"]),
      },
    });

    const fashionImages = [
      { imageUrl: "/images/properties/fashiontv-parc/fashiontv-parc-page-21-image-02.jpeg", sortOrder: 0, isCover: true },
      { imageUrl: "/images/properties/fashiontv-parc/fashiontv-parc-page-03-image-01.jpeg", sortOrder: 1, isCover: false },
      { imageUrl: "/images/properties/fashiontv-parc/fashiontv-parc-page-04-image-01.jpeg", sortOrder: 2, isCover: false },
      { imageUrl: "/images/properties/fashiontv-parc/fashiontv-parc-page-05-image-01.jpeg", sortOrder: 3, isCover: false },
    ];
    for (const img of fashionImages) {
      await prisma.propertyImage.create({ data: { ...img, propertyId: fashiontvParc.id } });
    }
    console.log("Created: FashionTV Parc");

    console.log("\nSeed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
