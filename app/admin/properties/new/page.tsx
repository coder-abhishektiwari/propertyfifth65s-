import PropertyForm from "@/components/admin/property-form";
import { getUniqueAmenities } from "@/lib/properties";

export const metadata = {
  title: "Add Property — Admin — Property Fifth",
};

export default async function AddPropertyPage() {
  const amenityOptions = await getUniqueAmenities();

  return <PropertyForm mode="create" amenityOptions={amenityOptions} />;
}
