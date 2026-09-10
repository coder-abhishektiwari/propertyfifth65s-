import { Users, Clock, CalendarCheck, CheckCircle, Phone } from "lucide-react";
import { db } from "@/lib/db";
import {
  getConsultationStatusLabel,
  getConsultationStatusLabelClass,
  getCategoryLabel,
  getCategoryLabelClass,
} from "@/lib/admin-utils";

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
    {
      icon: Users,
      value: total,
      label: "Total Requests",
      sub: "All time",
    },
    {
      icon: Clock,
      value: newCount,
      label: "New Requests",
      sub: "Awaiting your action",
    },
    {
      icon: CalendarCheck,
      value: scheduledCount,
      label: "Scheduled",
      sub: "Consultations booked",
    },
    {
      icon: CheckCircle,
      value: completedCount,
      label: "Completed",
      sub: "This week",
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[var(--navy)]">
          Consultation Requests
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track property consultation requests from interested
          clients.
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
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              No consultation requests found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Consultation requests from clients will appear here once they
              submit the form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Contact
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Request Date
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
                      <div>
                        <p className="font-semibold text-[var(--navy)]">
                          {request.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {request.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      {request.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {request.phone}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryLabelClass(
                          request.category
                        )}`}
                      >
                        {getCategoryLabel(request.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
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
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConsultationStatusLabelClass(
                          request.status
                        )}`}
                      >
                        {getConsultationStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {request.status === "NEW" && (
                          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors cursor-pointer">
                            <CalendarCheck className="w-3.5 h-3.5" />
                            Mark Scheduled
                          </button>
                        )}
                        {request.status === "SCHEDULED" && (
                          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors cursor-pointer">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Completed
                          </button>
                        )}
                        {request.status === "CONTACTED" && (
                          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors cursor-pointer">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Completed
                          </button>
                        )}
                        {request.status === "COMPLETED" && (
                          <span className="text-xs text-gray-400">
                            View Details
                          </span>
                        )}
                        {request.status === "CANCELLED" && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
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
