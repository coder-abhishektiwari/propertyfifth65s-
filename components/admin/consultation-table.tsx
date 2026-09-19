"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock, CalendarCheck, CheckCircle, Phone, Search, X } from "lucide-react";
import {
  getConsultationStatusLabel,
  getConsultationStatusLabelClass,
  getCategoryLabel,
  getCategoryLabelClass,
} from "@/lib/admin-utils";
import { updateConsultationStatus } from "@/lib/actions/property-actions";
import type { ConsultationRequest, ConsultationRequestStatus } from "@prisma/client";

type Request = ConsultationRequest & { property: { name: string; slug: string } | null };

const STAT_ICONS = { total: Users, new: Clock, contacted: Phone, scheduled: CalendarCheck, completed: CheckCircle } as const;

interface ConsultationTableProps {
  requests: Request[];
  total: number;
  stats: { key: keyof typeof STAT_ICONS; value: number; label: string; sub: string }[];
}

export default function ConsultationTable({ requests, total, stats }: ConsultationTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = requests.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function handleStatusUpdate(id: string, newStatus: ConsultationRequestStatus) {
    startTransition(async () => {
      await updateConsultationStatus(id, newStatus);
      router.refresh();
    });
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                {(() => { const Icon = STAT_ICONS[stat.key]; return <Icon className="w-5 h-5 text-accent" />; })()}
              </div>
              <span className="text-2xl font-bold text-primary">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-card"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-foreground mb-1">No consultation requests found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search || statusFilter !== "ALL" ? "Try adjusting your search or filter." : "Consultation requests from clients will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Contact</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Request Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden xl:table-cell">Preferred Time</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-primary">{request.name}</p>
                        <p className="text-xs text-muted-foreground">{request.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      {request.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{request.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryLabelClass(request.category)}`}>
                        {getCategoryLabel(request.category)}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div>
                        <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(request.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-xs text-muted-foreground">{request.preferredDate ? formatDate(request.preferredDate) : "Flexible"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConsultationStatusLabelClass(request.status)}`}>
                        {getConsultationStatusLabel(request.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {request.status === "NEW" && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, "CONTACTED")}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-accent transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Mark Contacted
                          </button>
                        )}
                        {request.status === "CONTACTED" && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, "SCHEDULED")}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-accent transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                            Mark Scheduled
                          </button>
                        )}
                        {(request.status === "SCHEDULED" || request.status === "CONTACTED") && (
                          <button
                            onClick={() => handleStatusUpdate(request.id, "COMPLETED")}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-success hover:text-success transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Complete
                          </button>
                        )}
                        {request.status === "COMPLETED" && (
                          <span className="text-xs text-muted-foreground">Done</span>
                        )}
                        {request.status === "CANCELLED" && (
                          <span className="text-xs text-muted-foreground">—</span>
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
          <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {total} requests
          </div>
        )}
      </div>
    </div>
  );
}
