import { Phone, Clock, CheckCircle, XCircle } from "lucide-react";
import { db } from "@/lib/db";
import {
  getCallbackStatusLabel,
  getCallbackStatusLabelClass,
  getCategoryLabel,
  getCategoryLabelClass,
} from "@/lib/admin-utils";

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
    {
      icon: Phone,
      value: total,
      label: "Total Requests",
      sub: "All callback requests",
    },
    {
      icon: Clock,
      value: pendingCount,
      label: "Pending",
      sub: "Awaiting response",
    },
    {
      icon: CheckCircle,
      value: contactedCount,
      label: "Contacted",
      sub: "We have called back",
    },
    {
      icon: XCircle,
      value: closedCount,
      label: "Closed",
      sub: "No further action needed",
    },
  ];

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[var(--navy)]">
          Call Back Requests (For a Property)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all callback requests made by users for specific properties.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <span className="text-2xl font-bold text-[var(--navy)]">
                {stat.value}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              No callback requests found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Callback requests from property pages will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Name & Contact
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Property
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Category
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                    Requested On
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                    Preferred Time
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--navy)] flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">
                            {getInitials(request.name)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--navy)] truncate">
                            {request.name}
                          </p>
                          {request.phone && (
                            <p className="text-xs text-gray-400 truncate">
                              {request.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">
                          {request.property?.name || "—"}
                        </p>
                        {request.property?.locality && (
                          <p className="text-xs text-gray-400 truncate">
                            {request.property.locality}
                            {request.property.city &&
                              `, ${request.property.city}`}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryLabelClass(
                          request.category
                        )}`}
                      >
                        {getCategoryLabel(request.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <div>
                        <p className="text-xs text-gray-600">
                          {formatDate(request.createdAt)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTime(request.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-xs text-gray-600">
                        {request.preferredDate
                          ? formatDate(request.preferredDate)
                          : "Flexible"}
                      </span>
                      {request.preferredTime && (
                        <p className="text-xs text-gray-400">
                          {request.preferredTime}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCallbackStatusLabelClass(
                          request.status
                        )}`}
                      >
                        {getCallbackStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {requests.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 text-xs text-gray-500">
            Showing {requests.length} of {total} requests
          </div>
        )}
      </div>
    </div>
  );
}
