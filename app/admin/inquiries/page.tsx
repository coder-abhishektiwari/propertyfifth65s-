import { db } from "@/lib/db";
import InquiriesTable from "@/components/admin/inquiries-table";

export const metadata = {
  title: "Contact Inquiries — Admin — Property Fifth",
};

export default async function AdminInquiriesPage() {
  const [inquiries, total] = await Promise.all([
    db.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, category: true } },
      },
    }),
    db.contactInquiry.count(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[var(--navy)]">Contact Inquiries</h1>
        <p className="text-sm text-gray-500 mt-1">Site-related issues and technical support queries from visitors.</p>
      </div>
      <InquiriesTable inquiries={inquiries} total={total} />
    </div>
  );
}
