import React, { useState } from 'react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications?: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications = [],
  onMarkAllRead,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<'all' | 'alert' | 'info' | 'graded'>('all');

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const filtered = safeNotifications.filter((n) => (filter === 'all' ? true : n.type === filter));

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-manrope text-2xl sm:text-[28px] font-bold text-[#17151C] tracking-tight">
            Notifications & Institutional Bulletins
          </h2>
          <p className="text-[14px] text-[#6B6875]">
            Real-time timetable changes, examination circulars, and attendance alerts
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onMarkAllRead}
            className="bg-white border border-[#E8E4EE] text-[#6D3DE8] hover:bg-[#F3EEFF] font-bold text-[13px] px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            Mark All Read
          </button>
          <button
            onClick={onClearAll}
            className="bg-white border border-[#E8E4EE] text-[#DC2626] hover:bg-red-50 font-bold text-[13px] px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            Clear All
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E4EE] pb-2">
        {(['all', 'alert', 'info', 'graded'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold capitalize transition-all ${
              filter === t
                ? 'bg-[#6D3DE8] text-white shadow-xs'
                : 'text-[#6B6875] hover:bg-[#F3EEFF]'
            }`}
          >
            {t === 'all' ? 'All Updates' : t}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E4EE] text-[#6B6875] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
            <span className="material-symbols-outlined text-[36px] text-[#6B6875] mb-2">
              notifications_off
            </span>
            <p className="font-bold text-base text-[#17151C] font-manrope">No notifications in this folder</p>
            <p className="text-[13px] text-[#6B6875] mt-1">You are all caught up!</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isAlert = item.type === 'alert';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] ${
                  isAlert
                    ? 'bg-red-50/70 border-red-200'
                    : 'bg-white border-[#E8E4EE] hover:bg-[#FDF7FF]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isAlert
                      ? 'bg-red-100 text-red-600'
                      : 'bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isAlert
                      ? 'warning'
                      : item.type === 'info'
                      ? 'info'
                      : item.type === 'graded'
                      ? 'grade'
                      : 'schedule'}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4
                      className={`text-[14px] font-bold font-manrope ${
                        isAlert ? 'text-red-900' : 'text-[#17151C]'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[11px] font-medium text-[#6B6875]">{item.timeAgo}</span>
                  </div>
                  <p
                    className={`text-[13px] mt-1 leading-relaxed ${
                      isAlert ? 'text-red-700' : 'text-[#6B6875]'
                    }`}
                  >
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
