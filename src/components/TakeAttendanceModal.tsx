import React, { useState, useEffect } from 'react';
import { StudentAttendanceEntry } from '../types';

interface TakeAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students?: StudentAttendanceEntry[];
  onSubmit: (updatedStudents: StudentAttendanceEntry[]) => void;
  subject?: string;
  className?: string;
  room?: string;
  time?: string;
}

export const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({
  isOpen,
  onClose,
  students: initialStudents = [],
  onSubmit,
  subject = 'Data Structures & Algorithms',
  className = 'TE CSD-A',
  room = 'Room B-204',
  time = '10:00 – 11:00 AM',
}) => {
  const [students, setStudents] = useState<StudentAttendanceEntry[]>(initialStudents || []);
  const [filter, setFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialStudents && Array.isArray(initialStudents)) {
      setStudents(initialStudents);
    }
  }, [initialStudents, isOpen]);

  if (!isOpen) return null;

  const safeStudents = Array.isArray(students) ? students : [];
  const presentCount = safeStudents.filter((s) => s.status === 'present').length;
  const absentCount = safeStudents.filter((s) => s.status === 'absent').length;
  const lateCount = safeStudents.filter((s) => s.status === 'late').length;
  const total = safeStudents.length;
  const percentage = Math.round((presentCount / (total || 1)) * 100);

  const handleStatusChange = (id: string, newStatus: 'present' | 'absent' | 'late') => {
    setStudents((prev) =>
      (prev || []).map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const markAll = (status: 'present' | 'absent') => {
    setStudents((prev) => (prev || []).map((s) => ({ ...s, status })));
  };

  const filteredStudents = safeStudents.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      id="take-attendance-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="take-attendance-modal-card"
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8E4EE] bg-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#6D3DE8] animate-pulse" />
              <span className="text-[11px] font-bold text-[#6D3DE8] uppercase tracking-wider bg-[#F3EEFF] border border-[#E0D4FC] px-2.5 py-0.5 rounded-full">
                Active Verified Session
              </span>
            </div>
            <h2 className="font-manrope text-xl sm:text-2xl font-bold text-[#17151C]">
              Take Attendance: {subject} ({className})
            </h2>
            <p className="text-[13px] text-[#6B6875] mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#6D3DE8]">
                  location_on
                </span>
                {room}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#6D3DE8]">
                  schedule
                </span>
                {time}
              </span>
              <span>•</span>
              <span className="text-[#6D3DE8] font-bold">Offline-Resilient Synced</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B6875] hover:text-[#17151C] hover:bg-[#F3EEFF] rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Live Metrics Strip */}
        <div className="px-5 sm:px-6 py-3 bg-[#FDF7FF] border-b border-[#E8E4EE] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[13px] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              Present:{' '}
              <strong className="text-[#6D3DE8] font-manrope text-base">{presentCount}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              Absent:{' '}
              <strong className="text-[#DC2626] font-manrope text-base">{absentCount}</strong>
            </span>
            {lateCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                Late:{' '}
                <strong className="text-[#F59E0B] font-manrope text-base">{lateCount}</strong>
              </span>
            )}
            <span className="text-[#6B6875]">
              Total: <strong className="text-[#17151C] font-manrope text-base">{total}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#6D3DE8] bg-[#F3EEFF] border border-[#E0D4FC] px-2.5 py-1 rounded-full">
              Rate: {percentage}%
            </span>
            <button
              onClick={() => markAll('present')}
              className="text-[12px] font-bold text-[#6D3DE8] hover:bg-[#F3EEFF] px-2.5 py-1 rounded-xl border border-[#E8E4EE] transition-colors"
            >
              All Present
            </button>
            <button
              onClick={() => markAll('absent')}
              className="text-[12px] font-bold text-[#DC2626] hover:bg-red-50 px-2.5 py-1 rounded-xl border border-[#E8E4EE] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Search & Filter bar */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-[#E8E4EE] flex items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6875] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or roll no..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
            />
          </div>

          <div className="flex items-center gap-1 text-[12px]">
            {(['all', 'present', 'absent', 'late'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-xl capitalize font-bold transition-all ${
                  filter === t
                    ? 'bg-[#6D3DE8] text-white shadow-xs'
                    : 'text-[#6B6875] hover:bg-[#F3EEFF]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Students Roster */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-[#E8E4EE]">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-[#6B6875] text-sm">
              No students found matching your criteria.
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#FDF7FF] px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#E8E4EE] bg-white"
                  />
                  <div>
                    <p className="text-[14px] font-bold text-[#17151C] leading-tight font-manrope">
                      {student.name}
                    </p>
                    <p className="text-[11px] font-mono text-[#6B6875]">{student.rollNo}</p>
                  </div>
                </div>

                {/* Status Toggle buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(student.id, 'present')}
                    className={`w-8 h-8 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center ${
                      student.status === 'present'
                        ? 'bg-[#16A34A] text-white shadow-xs'
                        : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE] hover:bg-[#E8E4EE]'
                    }`}
                  >
                    P
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, 'late')}
                    className={`w-8 h-8 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center ${
                      student.status === 'late'
                        ? 'bg-[#F59E0B] text-white shadow-xs'
                        : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE] hover:bg-[#E8E4EE]'
                    }`}
                  >
                    L
                  </button>
                  <button
                    onClick={() => handleStatusChange(student.id, 'absent')}
                    className={`w-8 h-8 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center ${
                      student.status === 'absent'
                        ? 'bg-[#DC2626] text-white shadow-xs'
                        : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE] hover:bg-[#E8E4EE]'
                    }`}
                  >
                    A
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8E4EE] bg-[#FDF7FF] flex items-center justify-between">
          <span className="text-[13px] text-[#6B6875]">
            Ready to log: <strong className="text-[#17151C] font-bold">{presentCount} present</strong> of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] hover:bg-[#F3EEFF] rounded-xl text-[13px] font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSubmit(students);
                onClose();
              }}
              className="px-5 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Submit Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
