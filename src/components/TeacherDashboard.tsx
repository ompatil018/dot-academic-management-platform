import React, { useState } from 'react';
import { LectureHistoryItem, StudentAttendanceEntry, TimetableLecture, UserRole } from '../types';
import { TakeAttendanceModal } from './TakeAttendanceModal';
import { getDynamicLectureStatus } from '../utils/lectureSchedule';

interface TeacherDashboardProps {
  userRole?: UserRole;
  lectureHistory?: LectureHistoryItem[];
  studentsRoster?: StudentAttendanceEntry[];
  timetable?: TimetableLecture[];
  onAttendanceSubmitted: (
    updatedRoster: StudentAttendanceEntry[],
    sessionDetails?: { subject: string; className: string; room: string; time: string }
  ) => void;
  onNavigateTab: (tab: string) => void;
  teacherName?: string;
  isClassTeacher?: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  userRole,
  lectureHistory = [],
  studentsRoster = [],
  timetable = [],
  onAttendanceSubmitted,
  onNavigateTab,
  teacherName = 'Prof. Anjali Sharma',
  isClassTeacher = true,
}) => {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic calculations from students roster safely
  const safeRoster = Array.isArray(studentsRoster) ? studentsRoster : [];
  const safeLectureHistory = Array.isArray(lectureHistory) ? lectureHistory : [];
  const safeTimetable = Array.isArray(timetable) ? timetable : [];

  const presentCount = safeRoster.filter((s) => s.status === 'present').length;
  const absentCount = safeRoster.filter((s) => s.status === 'absent' || s.status === 'late').length;
  const totalCount = safeRoster.length;

  // Identify low attendance students (<75%)
  const lowAttendanceStudents = safeRoster.filter((s) => (s.percentage || 100) < 75);

  // Compute live dynamic lecture status based on schedule
  const lectureStatus = getDynamicLectureStatus(safeTimetable);

  // If teacher is Rajesh Verma, select his lecture
  const rajeshLecture = safeTimetable.find(
    (l) => l.teacher?.includes('Verma') || l.subject?.includes('Database')
  );

  const currentLecture = (!isClassTeacher && rajeshLecture)
    ? rajeshLecture
    : lectureStatus.currentLecture || {
        id: 'lec-default-now',
        subject: isClassTeacher ? 'Data Structures & Algorithms' : 'Database Management Systems',
        className: 'TE CSD-A',
        classId: 'class-csd-a',
        room: 'Room B-204',
        time: '10:00 AM',
        endTime: '11:00 AM',
        teacher: teacherName,
        day: 'Monday',
        type: 'Theory',
        active: true,
      };

  const nextLecture = lectureStatus.nextLecture || {
    id: 'lec-default-next',
    subject: isClassTeacher ? 'Computer Networks' : 'DBMS & Web Lab',
    className: 'TE CSD-A',
    classId: 'class-csd-a',
    room: isClassTeacher ? 'Room B-204' : 'Lab L-102',
    time: '11:15 AM',
    endTime: '12:15 PM',
    teacher: isClassTeacher ? 'Prof. Anjali Sharma' : 'Prof. Rajesh Verma',
    day: 'Monday',
    type: isClassTeacher ? 'Theory' : 'Lab',
  };

  const handleAttendanceSubmit = (updatedRoster: StudentAttendanceEntry[]) => {
    onAttendanceSubmitted(updatedRoster, {
      subject: currentLecture.subject,
      className: currentLecture.className || 'TE CSD-A',
      room: currentLecture.room || 'Room B-204',
      time: currentLecture.time || '10:00 AM',
    });
    const safeUpdated = Array.isArray(updatedRoster) ? updatedRoster : [];
    const pres = safeUpdated.filter((s) => s.status === 'present').length;
    setToastMessage(`Attendance for ${currentLecture.subject} (${currentLecture.className || 'TE CSD-A'}) submitted successfully (${pres}/${safeUpdated.length} Present). Saved to offline cache & synced.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17151C] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#4C1D95]/40 text-sm animate-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#6B6875] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope text-2xl sm:text-[28px] font-bold text-[#17151C] tracking-tight">
            {isClassTeacher ? 'Class Teacher Dashboard' : 'Teacher Dashboard'} | {teacherName}
          </h1>
          <p className="text-[14px] text-[#6B6875] mt-0.5">
            Academic Year 2026–27 • Department of Computer Science & Engineering {isClassTeacher ? '• TE CSD-A' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isClassTeacher && (
            <>
              <button
                onClick={() => onNavigateTab('my-class')}
                className="px-3.5 py-2 bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC] text-[13px] font-bold rounded-xl border border-[#E0D4FC] flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">school</span>
                My Class (TE CSD - AI)
              </button>
              <button
                onClick={() => onNavigateTab('lecture-history')}
                className="px-3.5 py-2 bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC] text-[13px] font-bold rounded-xl border border-[#E0D4FC] flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">history_edu</span>
                Daily Lecture Logs
              </button>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="px-3.5 py-2 bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC] text-[13px] font-bold rounded-xl border border-[#E0D4FC] flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                Manage Timetable
              </button>
            </>
          )}
          {!isClassTeacher && (
            <button
              onClick={() => onNavigateTab('current-next')}
              className="px-3.5 py-2 bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC] text-[13px] font-bold rounded-xl border border-[#E0D4FC] flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">timelapse</span>
              NOW / NEXT Lecture
            </button>
          )}
          <button
            onClick={() => setIsAttendanceModalOpen(true)}
            className="px-4 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white text-[13px] font-bold rounded-xl shadow-[0_4px_12px_rgba(109,61,232,0.25)] flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            Take Attendance
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Current Lecture Card (Takes 8 cols) */}
        <div className="md:col-span-8 bg-[#FFFFFF] border border-[#E8E4EE] rounded-2xl p-6 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#6D3DE8] opacity-5 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[#6D3DE8] text-[12px] font-bold mb-3 bg-[#F3EEFF] border border-[#E0D4FC] px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#6D3DE8] animate-pulse" />
                  In Progress (NOW)
                </span>
                <h2 className="font-manrope text-xl sm:text-2xl font-bold text-[#17151C] mb-2">
                  {currentLecture.subject} ({currentLecture.className || 'TE CSD-A'})
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-[#6B6875] text-[14px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">
                      location_on
                    </span>
                    {currentLecture.room || 'Room B-204'}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">
                      schedule
                    </span>
                    {currentLecture.time}–{currentLecture.endTime || '11:00 AM'} ({lectureStatus.timeRemainingMinutes || 45} min left)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">
                      group
                    </span>
                    {totalCount} Registered Students
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#E8E4EE] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                id="take-attendance-cta-btn"
                onClick={() => setIsAttendanceModalOpen(true)}
                className="w-full sm:w-auto bg-[#6D3DE8] text-white font-bold text-[14px] px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(109,61,232,0.3)] hover:bg-[#5416D0] transition-all flex items-center justify-center gap-2 cursor-pointer font-manrope"
              >
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                TAKE ATTENDANCE
              </button>
              <button
                onClick={() => onNavigateTab('current-next')}
                className="px-4 py-2.5 bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC] text-[13px] font-bold rounded-xl border border-[#E0D4FC] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">timelapse</span>
                Session Console
              </button>
            </div>

            <button
              onClick={() => onNavigateTab('timetable')}
              className="text-[13px] font-bold text-[#6D3DE8] hover:text-[#4C1D95] flex items-center gap-1 transition-colors"
            >
              View Full Timetable
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Next Lecture Card (Takes 4 cols) */}
        <div className="md:col-span-4 bg-[#FDF7FF] border border-[#E8E4EE] rounded-2xl p-6 flex flex-col justify-between shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-block text-[11px] font-bold text-[#6B6875] uppercase tracking-wider">
                Next Lecture (NEXT)
              </span>
              <button
                onClick={() => onNavigateTab('current-next')}
                className="text-[11px] font-bold text-[#6D3DE8] hover:underline"
              >
                Console →
              </button>
            </div>
            <h4 className="font-manrope text-lg sm:text-xl font-bold text-[#17151C] mb-1">
              {nextLecture.subject} ({nextLecture.className || 'TE CSD-A'})
            </h4>
            <p className="text-[13px] text-[#6B6875] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#6D3DE8]">
                location_on
              </span>
              {nextLecture.room} • {nextLecture.type === 'Lab' ? 'Lab Session' : 'Theory Lecture'}
            </p>
          </div>

          <div className="flex items-center justify-between text-[#6B6875] text-[13px] mt-6 pt-4 border-t border-[#E8E4EE]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6D3DE8] text-[17px]">schedule</span>
              <span className="font-bold text-[#17151C]">{nextLecture.time}</span>
            </div>
            <button
              onClick={() => onNavigateTab('current-next')}
              className="text-[12px] font-bold text-[#6D3DE8] hover:underline flex items-center gap-0.5"
            >
              Checklist
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Attendance Summary Stats */}
        <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FFFFFF] border border-[#E8E4EE] rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider mb-1">
              Present Today
            </span>
            <span className="font-manrope text-[36px] sm:text-[40px] font-extrabold text-[#6D3DE8] leading-none">
              {presentCount}
            </span>
            <span className="text-[12px] text-[#16A34A] font-bold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}% Active Attendance
            </span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8E4EE] rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider mb-1">
              Absent
            </span>
            <span className="font-manrope text-[36px] sm:text-[40px] font-extrabold text-[#DC2626] leading-none">
              {absentCount}
            </span>
            <span className="text-[12px] text-[#DC2626] font-semibold mt-2">
              Requires Parent / Proctor Notify
            </span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E8E4EE] rounded-2xl p-6 flex flex-col items-center justify-center shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider mb-1">
              Total Class Roster
            </span>
            <span className="font-manrope text-[36px] sm:text-[40px] font-extrabold text-[#17151C] leading-none">
              {totalCount}
            </span>
            <span className="text-[12px] text-[#6B6875] font-semibold mt-2">
              TE CSD-A Enrolled Students
            </span>
          </div>
        </div>

        {/* Low Attendance Warning Panel (Phase 11 requirement) */}
        {isClassTeacher && lowAttendanceStudents.length > 0 && (
          <div className="md:col-span-12 bg-white border border-[#FECACA] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(220,38,38,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#DC2626] text-[24px]">warning</span>
                <div>
                  <h3 className="font-manrope text-base font-bold text-[#17151C]">
                    Low Attendance Alerts ({lowAttendanceStudents.length} Students &lt; 75%)
                  </h3>
                  <p className="text-[12px] text-[#6B6875]">
                    Students at risk of semester detention threshold under academic regulation
                  </p>
                </div>
              </div>
              <span className="text-[12px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-3 py-1 rounded-full">
                Immediate Action Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {lowAttendanceStudents.slice(0, 6).map((student) => (
                <div
                  key={student.id}
                  className="bg-[#FEF2F2]/60 border border-[#FECACA] rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-9 h-9 rounded-full border border-[#FECACA] bg-white object-cover"
                    />
                    <div>
                      <p className="text-[13px] font-bold text-[#17151C]">{student.name}</p>
                      <p className="text-[11px] text-[#6B6875]">Roll: {student.rollNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-extrabold text-[#DC2626]">
                      {student.percentage}%
                    </span>
                    <p className="text-[10px] text-[#DC2626] font-semibold">Critical</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lecture History Table */}
        <div className="md:col-span-12 bg-[#FFFFFF] border border-[#E8E4EE] rounded-2xl overflow-hidden shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="p-5 sm:p-6 border-b border-[#E8E4EE] bg-[#FFFFFF] flex justify-between items-center">
            <div>
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">Recent Lecture History</h3>
              <p className="text-[12px] text-[#6B6875]">
                Verified sessions logged across your assigned subjects
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-[13px] font-bold text-[#6D3DE8] hover:text-[#4C1D95] flex items-center gap-1 transition-colors"
            >
              Export Monthly Logs
              <span className="material-symbols-outlined text-[16px]">file_download</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E8E4EE] text-[12px] font-bold text-[#6B6875] bg-[#FDF7FF]">
                  <th className="p-4 pl-6">Date</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Present / Total</th>
                  <th className="p-4 pr-6">Attendance %</th>
                </tr>
              </thead>
              <tbody className="text-[14px] text-[#17151C] divide-y divide-[#E8E4EE]">
                {safeLectureHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FDF7FF] transition-colors"
                  >
                    <td className="p-4 pl-6 font-medium text-[#6B6875]">{item.date}</td>
                    <td className="p-4 font-bold text-[#17151C]">{item.subject}</td>
                    <td className="p-4 text-[#6B6875]">{item.class}</td>
                    <td className="p-4 text-[#6B6875] font-medium">
                      {item.presentCount} / {item.totalCount}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[#6D3DE8] font-bold text-[13px]">{item.attendancePercent}%</span>
                        <div className="w-24 bg-[#E8E4EE] rounded-full h-1.5 hidden sm:block">
                          <div
                            className="bg-[#6D3DE8] h-1.5 rounded-full"
                            style={{ width: `${item.attendancePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Take Attendance Modal */}
      <TakeAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        students={safeRoster}
        onSubmit={handleAttendanceSubmit}
        subject={currentLecture.subject}
        className={currentLecture.className || 'TE CSD-A'}
        room={currentLecture.room || 'Room B-204'}
        time={`${currentLecture.time} – ${currentLecture.endTime || '11:00 AM'}`}
      />
    </div>
  );
};
