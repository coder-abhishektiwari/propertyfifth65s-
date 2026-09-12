import { Suspense } from "react";
import { Metadata } from "next";
import SharedListClient from "@/components/shared-list-client";

export const metadata: Metadata = {
  title: "Shared Property List | Property Fifth",
  description: "View a shared list of properties from Property Fifth.",
};

export default function SharedListPage() {
  return (
    <Suspense
      fallback={
        <div className="container-site py-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
        </div>
      }
    >
      <SharedListClient />
    </Suspense>
  );
}
