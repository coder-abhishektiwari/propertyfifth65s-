"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react";
import { updateAdminProfile, changeAdminPassword } from "@/lib/actions/admin-actions";

export default function AccountSettingsClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileMsg, setProfileMsg] = useState({ type: "" as "" | "success" | "error", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "" as "" | "success" | "error", text: "" });
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data.admin) {
          setName(data.admin.name || "");
          setEmail(data.admin.email || "");
          setRole(data.admin.role || "ADMIN");
        }
      })
      .catch(() => {
        setProfileMsg({ type: "error", text: "Failed to load account data." });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await updateAdminProfile({ name, email });
    if (result.success) {
      setProfileMsg({ type: "success", text: result.message });
    } else {
      setProfileMsg({ type: "error", text: result.message });
    }
    setSaving(false);
    setTimeout(() => setProfileMsg({ type: "", text: "" }), 3000);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      setTimeout(() => setPasswordMsg({ type: "", text: "" }), 3000);
      return;
    }
    setSaving(true);
    const result = await changeAdminPassword({ currentPassword, newPassword });
    if (result.success) {
      setPasswordMsg({ type: "success", text: result.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMsg({ type: "error", text: result.message });
    }
    setSaving(false);
    setTimeout(() => setPasswordMsg({ type: "", text: "" }), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[var(--navy)]">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account details and change your password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Profile Details</h2>
              <p className="text-xs text-gray-500">Update your name and email address.</p>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
                  required
                  minLength={2}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Role</label>
              <input
                type="text"
                value={role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>

            {profileMsg.text && (
              <p className={`text-xs ${profileMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                {profileMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[var(--navy-dark)] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-500">Update your password to keep your account secure.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
                  required
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNew ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)]"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {passwordMsg.text && (
              <p className={`text-xs ${passwordMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                {passwordMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[var(--navy)] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[var(--navy-dark)] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {saving ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
