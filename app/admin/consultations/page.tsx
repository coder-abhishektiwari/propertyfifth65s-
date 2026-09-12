import { db } from "@/lib/db";
import ConsultationTable from "@/components/admin/consultation-table";

export const metadata = {
  title: "Consultation Requests — Admin — Property Fifth",
};

export default async function AdminConsultationsPage() {
  const [requests, total, newCount, scheduledCount, completedCount] =
    await Promise.all([
      db.consultationRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          property: { select: { name: true, slug: true } },
        },
      }),
      db.consultationRequest.count(),
      db.consultationRequest.count({ where: { status: "NEW" } }),
      db.consultationRequest.count({ where: { status: "SCHEDULED" } }),
      db.consultationRequest.count({ where: { status: "COMPLETED" } }),
    ]);

  const stats = [
    { key: "total" as const, value: total, label: "Total Requests", sub: "All time" },
    { key: "new" as const, value: newCount, label: "New Requests", sub: "Awaiting your action" },
    { key: "scheduled" as const, value: scheduledCount, label: "Scheduled", sub: "Consultations booked" },
    { key: "completed" as const, value: completedCount, label: "Completed", sub: "This week" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[var(--navy)]">Consultation Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track property consultation requests from interested clients.</p>
      </div>
      <ConsultationTable requests={requests} total={total} stats={stats} />
    </div>
  );
}
