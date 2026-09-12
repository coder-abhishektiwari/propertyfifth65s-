import { db } from "@/lib/db";
import CallbackTable from "@/components/admin/callback-table";

export const metadata = {
  title: "Call Back Requests — Admin — Property Fifth",
};

export default async function AdminCallbacksPage() {
  const [requests, total, pendingCount, contactedCount, closedCount] =
    await Promise.all([
      db.callbackRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          property: { select: { name: true, slug: true, city: true, locality: true } },
        },
      }),
      db.callbackRequest.count(),
      db.callbackRequest.count({ where: { status: "NEW" } }),
      db.callbackRequest.count({ where: { status: "CONTACTED" } }),
      db.callbackRequest.count({
        where: { status: { in: ["COMPLETED", "CANCELLED"] } },
      }),
    ]);

  const stats = [
    { key: "total" as const, value: total, label: "Total Requests", sub: "All callback requests" },
    { key: "pending" as const, value: pendingCount, label: "Pending", sub: "Awaiting response" },
    { key: "contacted" as const, value: contactedCount, label: "Contacted", sub: "We have called back" },
    { key: "closed" as const, value: closedCount, label: "Closed", sub: "No further action needed" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[var(--navy)]">Call Back Requests (For a Property)</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all callback requests made by users for specific properties.</p>
      </div>
      <CallbackTable requests={requests} total={total} stats={stats} />
    </div>
  );
}
