"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Phone, Clock, CheckCircle, Search, X } from "lucide-react";
import {
  getCallbackStatusLabel,
  getCallbackStatusLabelClass,
  getCategoryLabel,
  getCategoryLabelClass,
} from "@/lib/admin-utils";
import { updateCallbackStatus } from "@/lib/actions/property-actions";
import type { CallbackRequest, CallbackRequestStatus } from "@prisma/client";

type Request = CallbackRequest & { property: { name: string; slug: string; city: string; locality: string } | null };

const STAT_ICONS = { total: Phone, pending: Clock, contacted: CheckCircle, scheduled: Phone, completed: CheckCircle } as const;

interface CallbackTableProps {
  requests: Request[];
  total: number;
  stats: { key: keyof typeof STAT_ICONS; value: number; label: string; sub: string }[];
}

export default function CallbackTable({ requests, total, stats }: CallbackTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = requests.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search) || r.property?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleStatusUpdate(id: string, newStatus: CallbackRequestStatus) {
    startTransition(async () => {
      await updateCallbackStatus(id, newStatus);
      router.refresh();
    });
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                {(() => { const Icon = STAT_ICONS[stat.key]; return <Icon className="w-5 h-5 text-[var(--gold)]" />; })()}
              </div>
              <span className="text-2xl font-bold text-[var(--navy)]">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">Pending</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CALLBACK_SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-gray-700 mb-1">No callback requests found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {search || statusFilter !== "ALL" ? "Try adjusting your search or filter." : "Callback requests from property pages will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Name & Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Property</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden xl:table-cell">Requested On</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden xl:table-cell">Preferred Time</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--navy)] flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">{getInitials(request.name)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--navy)] truncate">{request.name}</p>
                          {request.phone && <p className="text-xs text-gray-400 truncate">{request.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{request.property?.name || "—"}</p>
                        {request.property?.locality && (
                          <p className="text-xs text-gray-400 truncate">{request.property.locality}{request.property.city && `, ${request.property.city}`}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryLabelClass(request.category)}`}>
                        {getCategoryLabel(request.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <div>
                        <p className="text-xs text-gray-600">{formatDate(request.createdAt)}</p>
                        <p className="text-xs text-gray-400">{formatTime(request.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-xs text-gray-600">{request.preferredDate ? formatDate(request.preferredDate) : "Flexible"}</span>
                      {request.preferredTime && <p className="text-xs text-gray-400">{request.preferredTime}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCallbackStatusLabelClass(request.status)}`}>
                        {getCallbackStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {request.status === "NEW" && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, "CONTACTED")}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Contacted
                          </button>
                        )}
                        {request.status === "CONTACTED" && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, "CALLBACK_SCHEDULED")}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Schedule
                          </button>
                        )}
                        {(request.status === "CALLBACK_SCHEDULED" || request.status === "CONTACTED") && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, "COMPLETED")}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Complete
                          </button>
                        )}
                        {request.status === "COMPLETED" && (
                          <span className="text-xs text-gray-400">Done</span>
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

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 text-xs text-gray-500">
            Showing {filtered.length} of {total} requests
          </div>
        )}
      </div>
    </div>
  );
}
