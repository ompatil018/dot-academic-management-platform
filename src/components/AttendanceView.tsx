import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { academicStore } from '../data/academicStore';

interface AttendanceViewProps {
  role: UserRole;
  onOpenTakeAttendance?: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  role,
  onOpenTakeAttendance,
}) => {
  const [filter, setFilter] = useState<'all' | 'warning' | 'good'>('all');
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [storeState, setStoreState] = useState(academicStore.getState());

  useEffect(() => {
    const unsub = academicStore.subscribe(() => {
      setStoreState({ ...academicStore.getState() });
    });
    return unsub;
  }, []);

  // Dynamically derive subject attendance from academic store
  const storeSubjects = storeState.subjects || [];
  const subjectData = storeSubjects.length > 0
    ? storeSubjects.map((s) => {
        const total = 40;
        const attended = Math.round((total * (s.attendancePercentage || 85)) / 100);
        return {
          id: s.id,
          name: s.name,
          total,
          attended,
          percent: s.attendancePercentage || 85,
          teacher: s.teacherName || 'Faculty Member',
        };
      })
    : [
        { id: 'sub-1', name: 'Data Structures & Algorithms', total: 40, attended: 37, percent: 92, teacher: 'Prof. Anjali Sharma' },
        { id: 'sub-2', name: 'Database Management Systems', total: 38, attended: 32, percent: 84, teacher: 'Mr. Amit Gupta' },
        { id: 'sub-3', name: 'Computer Networks', total: 36, attended: 31, percent: 86, teacher: 'Prof. Sharma' },
        { id: 'sub-4', name: 'Operating Systems', total: 36, attended: 26, percent: 72, teacher: 'Prof. Verma' },
        { id: 'sub-5', name: 'Discrete Mathematics & Logic', total: 32, attended: 29, percent: 90, teacher: 'Dr. Ramanujan' },
      ];

  const totalSessions = subjectData.reduce((acc, s) => acc + s.total, 0);
  const totalAttended = subjectData.reduce((acc, s) => acc + s.attended, 0);
  const aggregatePercentage = totalSessions > 0 ? ((totalAttended / totalSessions) * 100).toFixed(1) : '84.8';
  const atRiskList = subjectData.filter((s) => s.percent < 75);
  const atRiskCount = atRiskList.length;

  const filteredSubjects = subjectData.filter((s) => {
    if (filter === 'warning') return s.percent < 75;
    if (filter === 'good') return s.percent >= 85;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-manrope text-2xl sm:text-[28px] font-bold text-[#17151C] tracking-tight">
            Attendance Records & Regulatory Compliance
          </h2>
          <p className="text-[14px] text-[#6B6875]">
            University statutory rule: Minimum 75.0% aggregate attendance required to sit for semester finals.
          </p>
        </div>

        <div className="flex gap-2">
          {(role === 'teacher' || role === 'CLASS_TEACHER' || role === 'SUBJECT_TEACHER') && onOpenTakeAttendance && (
            <button
              onClick={onOpenTakeAttendance}
              className="bg-[#6D3DE8] text-white font-bold text-[13px] px-4 py-2 rounded-xl hover:bg-[#5416D0] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              Take Class Attendance
            </button>
          )}

          {(role === 'student' || role === 'STUDENT') && (
            <button
              onClick={() => setLeaveModalOpen(true)}
              className="bg-white border border-[#E8E4EE] text-[#6D3DE8] font-bold text-[13px] px-4 py-2 rounded-xl hover:bg-[#F3EEFF] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">event_busy</span>
              Submit Leave Application
            </button>
          )}
        </div>
      </div>

      {/* Aggregate KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Aggregate Attendance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-manrope text-3xl font-extrabold text-[#6D3DE8]">{aggregatePercentage}%</span>
            <span className="text-[12px] text-[#16A34A] font-bold">
              {Number(aggregatePercentage) >= 75
                ? `+${(Number(aggregatePercentage) - 75).toFixed(1)}% over threshold`
                : `${(Number(aggregatePercentage) - 75).toFixed(1)}% below requirement`}
            </span>
          </div>
          <div className="w-full bg-[#E8E4EE] h-2 rounded-full mt-3">
            <div className="bg-[#6D3DE8] h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, Number(aggregatePercentage)))}%` }} />
          </div>
        </div>

        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Total Sessions Logged</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-manrope text-3xl font-extrabold text-[#17151C]">{totalSessions}</span>
            <span className="text-[12px] text-[#6B6875] font-medium">classes tracked</span>
          </div>
          <p className="text-[12px] text-[#6B6875] mt-3">{totalAttended} attended • {totalSessions - totalAttended} absences documented</p>
        </div>

        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <span className={`text-[12px] font-bold uppercase tracking-wider ${atRiskCount > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
            {atRiskCount > 0 ? 'At-Risk Courses (<75%)' : 'Compliance Status'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-manrope text-3xl font-extrabold ${atRiskCount > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
              {atRiskCount} {atRiskCount === 1 ? 'Course' : 'Courses'}
            </span>
            {atRiskCount > 0 && (
              <span className="text-[12px] text-[#DC2626] font-bold">{atRiskList[0]?.name} ({atRiskList[0]?.percent}%)</span>
            )}
          </div>
          <p className="text-[12px] text-[#6B6875] mt-3">
            {atRiskCount > 0
              ? 'Attend next 3 lectures consecutively to recover to 75%'
              : 'All registered courses meet the university regulatory attendance threshold'}
          </p>
        </div>
      </div>

      {/* Subject Wise Cards */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl p-6 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <div>
            <h3 className="font-manrope text-lg font-bold text-[#17151C]">Subject-wise Attendance Breakdown</h3>
            <p className="text-[12px] text-[#6B6875]">Detailed percentage and lecture attendance ratios per subject</p>
          </div>

          <div className="flex gap-1.5 text-[12px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'all'
                  ? 'bg-[#6D3DE8] text-white'
                  : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE] hover:bg-[#F3EEFF]'
              }`}
            >
              All Subjects
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'warning'
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE] hover:bg-[#F3EEFF]'
              }`}
            >
              Warning (&lt;75%)
            </button>
            <button
              onClick={() => setFilter('good')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'good'
                  ? 'bg-[#16A34A] text-white'
                  : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE] hover:bg-[#F3EEFF]'
              }`}
            >
              Good (&ge;85%)
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredSubjects.map((subject) => {
            const isWarning = subject.percent < 75;
            return (
              <div
                key={subject.name}
                className={`p-4 rounded-xl border transition-all ${
                  isWarning
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-[#E8E4EE] bg-white hover:bg-[#FDF7FF]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="font-manrope font-bold text-base text-[#17151C]">
                      {subject.name}
                    </span>
                    <p className="text-[12px] text-[#6B6875]">{subject.teacher}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-[#6B6875]">
                      <strong className="text-[#17151C]">{subject.attended}</strong> of {subject.total} attended
                    </span>
                    <span
                      className={`text-lg font-manrope font-extrabold ${
                        isWarning ? 'text-[#DC2626]' : 'text-[#16A34A]'
                      }`}
                    >
                      {subject.percent}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-[#E8E4EE] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isWarning ? 'bg-[#DC2626]' : 'bg-[#6D3DE8]'
                    }`}
                    style={{ width: `${subject.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Application Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)]">
            <h3 className="font-manrope text-xl font-bold text-[#17151C] mb-2">
              Submit Leave Request
            </h3>
            <p className="text-[13px] text-[#6B6875] mb-4">
              Apply for an authorized medical or academic leave to exempt missed sessions.
            </p>

            {leaveSubmitted ? (
              <div className="py-6 text-center text-[#16A34A]">
                <span className="material-symbols-outlined text-[42px] mb-2">check_circle</span>
                <p className="font-bold text-[#17151C] font-manrope">Leave Request Submitted!</p>
                <p className="text-[12px] text-[#6B6875] mt-1">Relayed to Class Teacher and HOD for official approval.</p>
                <button
                  onClick={() => {
                    setLeaveModalOpen(false);
                    setLeaveSubmitted(false);
                  }}
                  className="mt-4 px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setLeaveSubmitted(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Leave Type
                  </label>
                  <select className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none">
                    <option>Medical Leave (Doctor Certificate Attached)</option>
                    <option>Inter-College Hackathon / Technical Symposium</option>
                    <option>University Sports Meet / NSS Activity</option>
                    <option>Family Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Duration (Dates)
                  </label>
                  <input
                    type="text"
                    defaultValue="Oct 16 – Oct 18, 2026"
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Reason & Explanation
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Brief explanation of your leave..."
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E4EE]">
                  <button
                    type="button"
                    onClick={() => setLeaveModalOpen(false)}
                    className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] hover:bg-[#F3EEFF] rounded-xl text-[13px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0]"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
