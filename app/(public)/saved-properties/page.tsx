import { Metadata } from "next";
import SavedPropertiesClient from "@/components/saved-properties-client";

export const metadata: Metadata = {
  title: "Saved Properties | Property Fifth",
  description: "View and manage your saved properties. Quick access to properties you've bookmarked for later.",
};

export default function SavedPropertiesPage() {
  return <SavedPropertiesClient />;
}
