"use client";

import { useState } from "react";
import { Search, Mail, Phone, User, Calendar } from "lucide-react";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  query: string | null;
  createdAt: Date;
  customer: { name: string | null; category: string | null } | null;
};

interface InquiriesTableProps {
  inquiries: Inquiry[];
  total: number;
}

export default function InquiriesTable({ inquiries, total }: InquiriesTableProps) {
  const [search, setSearch] = useState("");

  const filtered = inquiries.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.includes(q)) ||
      (r.query && r.query.toLowerCase().includes(q))
    );
  });

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
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <span className="text-2xl font-bold text-[var(--navy)]">{total}</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Total Inquiries</p>
          <p className="text-xs text-gray-400 mt-0.5">All time</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <span className="text-2xl font-bold text-[var(--navy)]">
              {inquiries.filter((i) => {
                const d = new Date(i.createdAt);
                const now = new Date();
                return d.toDateString() === now.toDateString();
              }).length}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700">Today</p>
          <p className="text-xs text-gray-400 mt-0.5">Submitted today</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or query..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Contact</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Query</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-[var(--navy)]">{inquiry.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="text-gray-700">{inquiry.email}</p>
                        {inquiry.phone && (
                          <p className="text-gray-400 text-xs">{inquiry.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-gray-700 truncate" title={inquiry.query || ""}>
                        {inquiry.query || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {inquiry.customer?.category === "NRI_UHNI" ? "NRI / UHNI" : inquiry.customer?.category === "DEFENCE_PERSONNEL" ? "Defence Personnel" : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-gray-700">{formatDate(inquiry.createdAt)}</p>
                        <p className="text-gray-400 text-xs">{formatTime(inquiry.createdAt)}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {total} inquiry{total !== 1 ? "ies" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
