"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Trash2, Key, Shield, X, Eye, EyeOff } from "lucide-react";
import { createAdmin, deleteAdmin, resetAdminPassword, isSuperAdmin } from "@/lib/actions/admin-actions";

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminAccountsClient() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showReset, setShowReset] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "" });
  const [resetPassword, setResetPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "" as "" | "success" | "error", text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [isSuper, adminsRes] = await Promise.all([
        isSuperAdmin(),
        fetch("/api/admin/admins"),
      ]);
      setSuperAdmin(isSuper);
      const data = await adminsRes.json();
      setAdmins(data.admins || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await createAdmin(createForm);
    if (result.success) {
      showMessage("success", result.message);
      setShowCreate(false);
      setCreateForm({ name: "", email: "", password: "" });
      loadData();
    } else {
      showMessage("error", result.message);
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    setSubmitting(true);
    const result = await deleteAdmin(id);
    if (result.success) {
      showMessage("success", result.message);
      loadData();
    } else {
      showMessage("error", result.message);
    }
    setSubmitting(false);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!showReset) return;
    setSubmitting(true);
    const result = await resetAdminPassword(showReset, resetPassword);
    if (result.success) {
      showMessage("success", result.message);
      setShowReset(null);
      setResetPassword("");
    } else {
      showMessage("error", result.message);
    }
    setSubmitting(false);
  }

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!superAdmin) {
    return (
      <div className="text-center py-20">
        <Shield className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-700 mb-2">Access Restricted</h3>
        <p className="text-sm text-gray-500">Only super admins can manage admin accounts.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[var(--navy)]">Admin Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin accounts, create new admins, and reset passwords.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[var(--navy-dark)] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Admins List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {admins.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-gray-700">No admin accounts found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Admin</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Created</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--navy)] flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">{getInitials(admin.name)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--navy)]">{admin.name}</p>
                          <p className="text-xs text-gray-400">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.role === "SUPER_ADMIN" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {new Date(admin.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setShowReset(admin.id); setResetPassword(""); }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5" />
                          Reset Password
                        </button>
                        {admin.role !== "SUPER_ADMIN" && (
                          <button
                            onClick={() => handleDelete(admin.id)}
                            disabled={submitting}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Create Admin Account</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={createForm.password}
                    onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] pr-10"
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[var(--navy)] rounded-lg hover:bg-[var(--navy-dark)] transition-colors cursor-pointer disabled:opacity-50">
                  {submitting ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showReset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowReset(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900">Reset Password</h3>
              <button onClick={() => setShowReset(null)} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] pr-10"
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowReset(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[var(--navy)] rounded-lg hover:bg-[var(--navy-dark)] transition-colors cursor-pointer disabled:opacity-50">
                  {submitting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
