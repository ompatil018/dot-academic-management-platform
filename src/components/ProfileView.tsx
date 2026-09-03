import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [department, setDepartment] = useState(user.department);
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, email, department });
    setIsEditing(false);
    setToast('Profile updated successfully.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17151C] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#6D3DE8] text-sm animate-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-[#6B6875] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      <div>
        <h2 className="font-manrope text-2xl sm:text-[28px] font-bold text-[#17151C] tracking-tight">
          User Profile & Academic Credentials
        </h2>
        <p className="text-[14px] text-[#6B6875]">
          Manage your institutional identity, contact information, and notifications
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl p-6 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={user.avatarUrl}
            alt={user.name}
            onError={(e) => {
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user.name
              )}`;
            }}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#6D3DE8] shadow-sm shrink-0"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-manrope text-2xl font-bold text-[#17151C]">{user.name}</h3>
              <span className="bg-[#F3EEFF] text-[#6D3DE8] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#E0D4FC]">
                {user.role} Portal
              </span>
            </div>
            <p className="text-[14px] text-[#6B6875] mt-0.5">{user.department}</p>
            <p className="text-[13px] text-[#6B6875] font-mono mt-1">
              UID: {user.id.toUpperCase()} • Registered Academic Year 2026–27
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-center px-4 py-2 border border-[#E8E4EE] text-[#6D3DE8] hover:bg-[#F3EEFF] rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isEditing ? 'close' : 'edit'}
            </span>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-[#E8E4EE] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Department / Academic Program
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E4EE]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] hover:bg-[#F3EEFF] rounded-xl text-[13px] font-semibold"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0]"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* System Settings & Notifications Configuration */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl p-6 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] space-y-4">
        <h3 className="font-manrope text-lg font-bold text-[#17151C]">Institutional Preferences & Privacy</h3>

        <div className="divide-y divide-[#E8E4EE]">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#17151C]">
                Instant Timetable Modification Alerts
              </p>
              <p className="text-[12px] text-[#6B6875]">
                Receive instant notifications when classrooms or slots change
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 accent-[#6D3DE8] cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#17151C]">
                Automated Attendance Status Relays
              </p>
              <p className="text-[12px] text-[#6B6875]">
                Send weekly digest of attendance percentages to proctor & parents
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 accent-[#6D3DE8] cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#17151C]">Two-Factor Authentication</p>
              <p className="text-[12px] text-[#6B6875]">
                Enforced by campus IT directory (SSO + TOTP)
              </p>
            </div>
            <span className="text-[12px] font-bold text-[#16A34A] bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0]">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
