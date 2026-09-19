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
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <span className="text-2xl font-bold text-primary">{total}</span>
          </div>
          <p className="text-sm font-medium text-foreground">Total Inquiries</p>
          <p className="text-xs text-muted-foreground mt-0.5">All time</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <span className="text-2xl font-bold text-primary">
              {inquiries.filter((i) => {
                const d = new Date(i.createdAt);
                const now = new Date();
                return d.toDateString() === now.toDateString();
              }).length}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground">Today</p>
          <p className="text-xs text-muted-foreground mt-0.5">Submitted today</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or query..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-muted/50">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Query</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="border-b border-border-light hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-primary">{inquiry.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="text-foreground">{inquiry.email}</p>
                        {inquiry.phone && (
                          <p className="text-muted-foreground text-xs">{inquiry.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-foreground truncate" title={inquiry.query || ""}>
                        {inquiry.query || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {inquiry.customer?.category === "NRI_UHNI" ? "NRI / UHNI" : inquiry.customer?.category === "DEFENCE_PERSONNEL" ? "Defence Personnel" : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-foreground">{formatDate(inquiry.createdAt)}</p>
                        <p className="text-muted-foreground text-xs">{formatTime(inquiry.createdAt)}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border-light bg-muted/30">
            <p className="text-xs text-muted-foreground">
              Showing {filtered.length} of {total} inquiry{total !== 1 ? "ies" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
