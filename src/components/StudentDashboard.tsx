import React, { useState, useEffect } from 'react';
import { NotificationItem, ScheduleEvent } from '../types';
import { SyllabusModal, FacultyContactModal } from './StudentModals';
import { academicStore } from '../data/academicStore';
import { getDynamicLectureStatus } from '../utils/lectureSchedule';

interface StudentDashboardProps {
  schedule?: ScheduleEvent[];
  notifications?: NotificationItem[];
  onMarkAllNotificationsRead: () => void;
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  schedule = [],
  notifications = [],
  onMarkAllNotificationsRead,
  onNavigateTab,
}) => {
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [facultyModalOpen, setFacultyModalOpen] = useState(false);
  const [selectedSubjectForSyllabus, setSelectedSubjectForSyllabus] = useState('Data Structures & Algorithms');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [storeState, setStoreState] = useState(academicStore.getState());

  useEffect(() => {
    const unsub = academicStore.subscribe(() => {
      setStoreState({ ...academicStore.getState() });
    });
    return unsub;
  }, []);

  const safeTimetable = storeState.timetable || [];
  const safeSchedule = Array.isArray(schedule) && schedule.length > 0
    ? schedule
    : safeTimetable.slice(0, 5).map((t) => ({
        id: t.id,
        time: t.time,
        subject: t.subject,
        instructor: t.teacher,
        room: t.room,
        type: t.type === 'Lab' ? 'Lab Session' : 'Theory Lecture',
        active: t.active,
      }));

  const safeNotifications = Array.isArray(notifications) && notifications.length > 0
    ? notifications
    : storeState.notifications || [];

  // Compute live dynamic lecture status based on schedule
  const lectureStatus = getDynamicLectureStatus(safeTimetable);
  const currentLecture = lectureStatus.currentLecture || {
    id: 'lec-default-now',
    subject: 'Data Structures & Algorithms',
    className: 'TE CSD-A',
    classId: 'class-csd-a',
    room: 'Room B-204',
    time: '10:00 AM',
    endTime: '11:00 AM',
    teacher: 'Prof. Anjali Sharma (Class Teacher)',
    day: 'Monday',
    type: 'Theory',
    active: true,
  };

  const nextLecture = lectureStatus.nextLecture || {
    id: 'lec-default-next',
    subject: 'Database Systems Lab',
    className: 'TE CSD-A',
    classId: 'class-csd-a',
    room: 'Lab 3',
    time: '11:30 AM',
    endTime: '01:30 PM',
    teacher: 'Prof. Rajesh Verma',
    day: 'Monday',
    type: 'Lab',
  };

  // Pull dynamic student profile and calculate attendance across all subjects
  const student = storeState.students.find((s) => s.rollNo === 'CSD201') || {
    id: 'stud-te-csd-1',
    name: 'Aarav Joshi',
    rollNo: 'CSD201',
    className: 'TE CSD-A',
    subjectAttendance: {},
  };

  const studentSubjects = student.subjectAttendance || {};
  const subjectKeys = Object.keys(studentSubjects);

  let totalAttendedCount = 0;
  let totalConductedCount = 0;

  const displaySubjects = subjectKeys.length > 0
    ? subjectKeys.map((subName, i) => {
        const data = (studentSubjects as any)[subName];
        totalAttendedCount += data.attended || 0;
        totalConductedCount += data.total || 0;
        return {
          id: `sub-csd-${i + 1}`,
          name: subName,
          attended: data.attended,
          total: data.total,
          attendancePercentage: data.percent,
        };
      })
    : [
        { id: 'sub-csd-101', name: 'Data Structures & Algorithms', attended: 37, total: 40, attendancePercentage: 92 },
        { id: 'sub-csd-102', name: 'Database Management Systems', attended: 33, total: 38, attendancePercentage: 86 },
        { id: 'sub-csd-103', name: 'Operating Systems', attended: 28, total: 36, attendancePercentage: 78 },
        { id: 'sub-csd-104', name: 'Computer Networks', attended: 34, total: 36, attendancePercentage: 94 },
        { id: 'sub-csd-105', name: 'Software Engineering', attended: 28, total: 32, attendancePercentage: 88 },
        { id: 'sub-csd-106', name: 'Web Technology', attended: 27, total: 30, attendancePercentage: 91 },
        { id: 'sub-csd-107', name: 'Artificial Intelligence', attended: 25, total: 30, attendancePercentage: 83 },
        { id: 'sub-csd-108', name: 'Computer Graphics', attended: 25, total: 28, attendancePercentage: 89 },
      ];

  if (subjectKeys.length === 0) {
    totalAttendedCount = displaySubjects.reduce((acc, s) => acc + s.attended, 0);
    totalConductedCount = displaySubjects.reduce((acc, s) => acc + s.total, 0);
  }

  // Strictly calculate overall attendance percentage from record totals
  const calculatedOverall = totalConductedCount > 0
    ? Math.round((totalAttendedCount / totalConductedCount) * 100)
    : 88;

  const handleDownloadSyllabus = () => {
    setToastMessage('Downloading complete semester syllabus package (PDF)...');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17151C] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#6D3DE8] text-sm animate-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#6B6875] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h2 className="font-manrope text-2xl sm:text-[32px] font-bold text-[#17151C] tracking-tight">
          Good morning, {student.name}.
        </h2>
        <p className="text-[15px] text-[#6B6875] mt-1">
          Today is {lectureStatus.currentDay} • B.Tech Computer Science & Design (TE CSD-A, Roll: {student.rollNo})
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols on large screens) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          {/* Hero Section: Happening Now */}
          <section className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-[0px_2px_8px_rgba(23,21,28,0.03)] border border-[#E8E4EE] border-l-4 border-l-[#6D3DE8] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6D3DE8] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6D3DE8] bg-[#F3EEFF] p-1.5 rounded-full text-[20px]">
                  schedule
                </span>
                <span className="text-[12px] font-bold text-[#6D3DE8] uppercase tracking-wider">
                  Happening Now (NOW)
                </span>
              </div>
              <span className="text-[12px] font-semibold text-[#6B6875] bg-[#FDF7FF] px-3 py-1 rounded-full border border-[#E8E4EE]">
                {currentLecture.time} – {currentLecture.endTime || '11:00 AM'}
              </span>
            </div>

            <div className="mb-6 relative z-10">
              <h3 className="font-manrope text-2xl sm:text-3xl font-bold text-[#17151C] mb-2 leading-tight">
                {currentLecture.subject}
              </h3>
              <div className="flex flex-wrap gap-4 text-[14px] text-[#6B6875]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#6D3DE8] text-[18px]">
                    meeting_room
                  </span>
                  {currentLecture.room || 'Room B-204'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#6D3DE8] text-[18px]">
                    person
                  </span>
                  {currentLecture.teacher || 'Prof. Anjali Sharma'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E4EE] relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider block">
                  UP NEXT
                </span>
                <span className="text-[14px] font-bold text-[#17151C]">
                  {nextLecture.subject}
                  <span className="font-normal text-[#6B6875] ml-2">
                    {nextLecture.time} • {nextLecture.room}
                  </span>
                </span>
              </div>
              <button
                id="view-syllabus-btn"
                onClick={() => {
                  setSelectedSubjectForSyllabus(currentLecture.subject);
                  setSyllabusModalOpen(true);
                }}
                className="bg-[#F3EEFF] border border-[#E0D4FC] text-[#6D3DE8] font-bold text-[13px] px-3.5 py-1.5 rounded-xl hover:bg-[#E0D4FC] transition-colors flex items-center gap-1 shadow-2xs"
              >
                View Syllabus
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Attendance Overview Section with Circular Progress Rings */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                Subject-wise Attendance Overview
              </h3>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-[13px] font-bold text-[#6D3DE8] hover:underline"
              >
                Detailed Subject Report
              </button>
            </div>

            {/* Calculated Overall Attendance Metric Banner */}
            <div className="bg-white border border-[#E8E4EE] rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#F3EEFF] border border-[#E0D4FC] flex items-center justify-center text-[#6D3DE8] shrink-0">
                  <span className="material-symbols-outlined text-[26px]">how_to_reg</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider block">Overall Cumulative Attendance</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-manrope text-2xl font-extrabold text-[#17151C]">{calculatedOverall}%</span>
                    <span className="text-[12px] text-[#16A34A] font-bold">
                      {totalAttendedCount} of {totalConductedCount} Total Sessions Attended
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[12px] font-bold px-3 py-1 rounded-full border ${calculatedOverall >= 75 ? 'bg-[#ECFDF5] text-[#16A34A] border-[#A7F3D0]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'}`}>
                  {calculatedOverall >= 75 ? 'Regulatory Compliance Passed (≥75%)' : 'Detention Threshold Warning (<75%)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {displaySubjects.map((sub) => {
                const pct = sub.attendancePercentage || 85;
                const circumference = 251.2;
                const offset = circumference * (1 - pct / 100);
                const isBelow = pct < 75;
                const strokeColor = isBelow ? '#D97706' : '#16A34A';

                return (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl p-4 border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)] hover:border-[#6D3DE8]/50 transition-all relative overflow-hidden group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <h4 className="text-[13px] text-[#17151C] font-bold mb-3 h-9 flex items-center justify-center font-manrope text-center px-1 leading-tight">
                        {sub.name}
                      </h4>
                      {/* Circular SVG Gauge */}
                      <div className="relative w-22 h-22 mb-3">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            className="text-[#E8E4EE]"
                            cx="50"
                            cy="50"
                            fill="transparent"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            fill="transparent"
                            r="40"
                            stroke={strokeColor}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="font-manrope text-xl font-extrabold text-[#17151C] leading-none">
                            {pct}%
                          </span>
                        </div>
                      </div>
                      {isBelow ? (
                        <span className="text-[11px] font-bold text-[#D97706] bg-amber-50 px-2.5 py-0.5 rounded-full w-max mx-auto flex items-center gap-1 border border-amber-200">
                          <span className="material-symbols-outlined text-[13px]">warning</span>
                          Below 75%
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full w-max mx-auto flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">check_circle</span>
                          Good ({sub.attended || Math.round((pct * 36) / 100)}/{sub.total || 36})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Today's Schedule Timeline Section */}
          <section className="bg-white rounded-2xl border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">Today's Academic Schedule</h3>
              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-[12px] font-bold text-[#6D3DE8] hover:underline"
              >
                View Full Week
              </button>
            </div>

            <div className="relative">
              {/* Vertical line connecting events */}
              <div className="absolute left-[39px] top-4 bottom-4 w-px bg-[#E8E4EE] z-0" />

              <div className="space-y-4 relative z-10">
                {safeSchedule.map((evt, idx) => {
                  const isActive = evt.active;
                  return (
                    <div key={evt.id || idx} className="flex gap-4 group">
                      <div className="w-20 text-right pt-1 shrink-0">
                        <span className={`text-[12px] font-bold block leading-tight ${isActive ? 'text-[#6D3DE8]' : 'text-[#6B6875]'}`}>
                          {evt.time}
                        </span>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 shrink-0 border-2 border-white relative z-10 ring-4 ${
                          isActive
                            ? 'bg-[#6D3DE8] ring-[#E0D4FC]'
                            : 'bg-[#6B6875] ring-[#E8E4EE]'
                        }`}
                      />
                      <div
                        className={`flex-1 p-4 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-[#6D3DE8] text-white border-[#5416D0] shadow-xs'
                            : 'bg-[#FDF7FF] text-[#17151C] border-[#E8E4EE]'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-[14px] font-bold font-manrope">{evt.subject}</h4>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                              isActive ? 'bg-white/20 text-white' : 'bg-[#E8E4EE] text-[#6B6875]'
                            }`}
                          >
                            {evt.type}
                          </span>
                        </div>
                        <p className={`text-[13px] ${isActive ? 'text-[#E0D4FC]' : 'text-[#6B6875]'}`}>
                          {evt.room} • {evt.instructor}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Announcements / Notifications Widget */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6D3DE8] text-[22px]">notifications</span>
                <h3 className="font-manrope text-base font-bold text-[#17151C]">Announcements</h3>
              </div>
              <button
                onClick={onMarkAllNotificationsRead}
                className="text-[11px] font-bold text-[#6D3DE8] hover:underline"
              >
                Mark Read
              </button>
            </div>

            <div className="space-y-3">
              {safeNotifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border text-[13px] transition-all ${
                    notif.unread
                      ? 'bg-[#F3EEFF] border-[#E0D4FC] text-[#17151C]'
                      : 'bg-[#FDF7FF] border-[#E8E4EE] text-[#6B6875]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[13px] text-[#17151C]">{notif.title}</span>
                    <span className="text-[11px] text-[#6B6875]">{notif.timeAgo}</span>
                  </div>
                  <p className="text-[12px] leading-snug">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)] space-y-3">
            <h3 className="font-manrope text-base font-bold text-[#17151C]">Student Resources</h3>
            <button
              onClick={() => {
                setSelectedSubjectForSyllabus('Data Structures & Algorithms');
                setSyllabusModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E8E4EE] hover:bg-[#FDF7FF] text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">menu_book</span>
                <div>
                  <p className="font-bold text-[13px] text-[#17151C]">Course Syllabus</p>
                  <p className="text-[11px] text-[#6B6875]">Units, textbooks, exam scheme</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#6B6875] text-[18px]">chevron_right</span>
            </button>

            <button
              onClick={() => setFacultyModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E8E4EE] hover:bg-[#FDF7FF] text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">contact_phone</span>
                <div>
                  <p className="font-bold text-[13px] text-[#17151C]">Faculty Contact</p>
                  <p className="text-[11px] text-[#6B6875]">Proctor, Class Teacher, HOD</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#6B6875] text-[18px]">chevron_right</span>
            </button>

            <button
              onClick={handleDownloadSyllabus}
              className="w-full py-2.5 bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC] rounded-xl text-[13px] font-bold border border-[#E0D4FC] transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download Full Academic Pack
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SyllabusModal
        isOpen={syllabusModalOpen}
        onClose={() => setSyllabusModalOpen(false)}
        subjectName={selectedSubjectForSyllabus}
      />

      <FacultyContactModal
        isOpen={facultyModalOpen}
        onClose={() => setFacultyModalOpen(false)}
      />
    </div>
  );
};
