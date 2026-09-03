import React, { useState, useEffect, useMemo } from 'react';
import { academicStore } from '../data/academicStore';
import { StudentAttendanceEntry, TimetableLecture, UserRole, LectureHistoryItem } from '../types';
import { TakeAttendanceModal } from './TakeAttendanceModal';
import { getDynamicLectureStatus } from '../utils/lectureSchedule';

interface NowNextLectureDashboardProps {
  role?: UserRole;
  onNavigateTab?: (tab: string) => void;
}

export const NowNextLectureDashboard: React.FC<NowNextLectureDashboardProps> = ({
  role = 'SUBJECT_TEACHER',
  onNavigateTab,
}) => {
  const [storeState, setStoreState] = useState(academicStore.getState());
  const [activeSlotSim, setActiveSlotSim] = useState<'live' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5'>('p2'); // Default to 10:00 AM Period 2 (in progress)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sessionNotes, setSessionNotes] = useState(
    'Covered: ACID Properties in DBMS. Key focus on 2PL (Two-Phase Locking) protocol and Strict 2PL. Homework: Solve Exercise 14.2 on Deadlock Prevention.'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preparation Checklist state for Next Lecture
  const [checklist, setChecklist] = useState({
    terminalsReady: true,
    pgServerActive: true,
    assignmentUploaded: true,
    gpuQuotaVerified: true,
    rollSheetPrinted: false,
    labAssistantAlerted: true,
  });

  const isTeacher = role === 'SUBJECT_TEACHER' || role === 'CLASS_TEACHER' || role === 'teacher';

  useEffect(() => {
    const unsub = academicStore.subscribe(() => {
      setStoreState({ ...academicStore.getState() });
    });
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Schedule Simulation times (minutes from midnight)
  const simMinutes = useMemo(() => {
    switch (activeSlotSim) {
      case 'p1':
        return 9 * 60 + 25; // 09:25 AM
      case 'p2':
        return 10 * 60 + 20; // 10:20 AM
      case 'p3':
        return 11 * 60 + 45; // 11:45 AM
      case 'p4':
        return 14 * 60 + 15; // 02:15 PM
      case 'p5':
        return 15 * 60 + 10; // 03:10 PM
      case 'live':
      default:
        return undefined;
    }
  }, [activeSlotSim]);

  const rawStatus = getDynamicLectureStatus(storeState.timetable, undefined, simMinutes);

  // Subject Teacher specific lecture resolution (Prof. Rajesh Verma: DBMS, Web Tech, Labs)
  const nowLecture: TimetableLecture = rawStatus.currentLecture || {
    id: 'lec-now-dbms',
    subject: 'Database Management Systems',
    className: 'TE CSD - AI (Div A)',
    classId: 'class-csd-te-a',
    room: 'Room B-204 (Smart Classroom)',
    time: '10:00 AM',
    endTime: '11:00 AM',
    teacher: 'Prof. Rajesh Verma',
    day: 'Wednesday',
    type: 'Lecture',
    active: true,
  };

  const nextLecture: TimetableLecture = rawStatus.nextLecture || {
    id: 'lec-next-web-lab',
    subject: 'DBMS & Web Technology Lab',
    className: 'TE CSD - AI (Batch A1 & A2)',
    classId: 'class-csd-te-a',
    room: 'AI & Data Lab L-102',
    time: '11:15 AM',
    endTime: '01:15 PM',
    teacher: 'Prof. Rajesh Verma',
    day: 'Wednesday',
    type: 'Lab',
    active: false,
  };

  const studentsRoster: StudentAttendanceEntry[] = storeState.studentsRoster || [];
  const presentStudents = studentsRoster.filter((s) => s.status === 'present');
  const absentStudents = studentsRoster.filter((s) => s.status === 'absent' || s.status === 'late');
  const lowAttendanceStudents = studentsRoster.filter((s) => (s.percentage || 100) < 75);

  const presentCount = presentStudents.length;
  const totalCount = studentsRoster.length || 30;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 93;

  // Elapsed calculations
  const minutesRemaining = rawStatus.timeRemainingMinutes || 38;
  const elapsedMinutes = Math.max(0, 60 - minutesRemaining);
  const elapsedPercent = Math.min(100, Math.round((elapsedMinutes / 60) * 100));

  // Full day timeline for this faculty
  const facultyDaySchedule = [
    {
      slot: 'Period 1 (09:00 – 10:00 AM)',
      subject: 'Object Oriented Programming',
      code: 'CSD-401',
      className: 'SE CSD-B',
      room: 'Room A-105',
      type: 'Theory Lecture',
      status: 'completed',
      attendance: '96.6% (29/30)',
      highlight: false,
    },
    {
      slot: 'Period 2 (10:00 – 11:00 AM)',
      subject: nowLecture.subject,
      code: 'CSD-602',
      className: 'TE CSD - AI (Div A)',
      room: nowLecture.room,
      type: 'Theory Lecture',
      status: 'now',
      attendance: `${attendanceRate}% (${presentCount}/${totalCount})`,
      highlight: true,
    },
    {
      slot: 'Recess Break (11:00 – 11:15 AM)',
      subject: 'Short Break / Tea Recess',
      code: 'RECESS',
      className: 'All Divisions',
      room: 'Staff Common Room',
      type: 'Break',
      status: 'upcoming',
      attendance: '—',
      highlight: false,
    },
    {
      slot: 'Period 3 & 4 (11:15 – 01:15 PM)',
      subject: nextLecture.subject,
      code: 'CSD-606',
      className: 'TE CSD - AI (Batch A1 & A2)',
      room: nextLecture.room,
      type: 'Practical Lab (2 Hours)',
      status: 'next',
      attendance: 'Upcoming Session',
      highlight: true,
    },
    {
      slot: 'Lunch Break (01:15 – 02:00 PM)',
      subject: 'Faculty Lunch & Consultation',
      code: 'LUNCH',
      className: 'Faculty Cabin B-302',
      room: 'Cabin B-302',
      type: 'Break',
      status: 'upcoming',
      attendance: '—',
      highlight: false,
    },
    {
      slot: 'Period 5 (02:00 – 03:00 PM)',
      subject: 'Cloud Computing & Distributed DB',
      code: 'CSD-703',
      className: 'BE CSD (Final Year)',
      room: 'Auditorium Hall 2',
      type: 'Elective Theory',
      status: 'upcoming',
      attendance: 'Scheduled',
      highlight: false,
    },
    {
      slot: 'Office Hours (03:30 – 04:30 PM)',
      subject: 'Student Mentoring & Project Reviews',
      code: 'MENTOR',
      className: 'Final Year Project Teams',
      room: 'Project Lab L-301',
      type: 'Mentoring',
      status: 'upcoming',
      attendance: 'By Appointment',
      highlight: false,
    },
  ];

  const handleSaveSessionNotes = () => {
    // Add or update lecture history with this note
    academicStore.addNotification({
      type: 'info',
      title: `Lecture Notes Saved: ${nowLecture.subject}`,
      message: `Blackboard summary for ${nowLecture.className} recorded into Daily Lecture Register.`,
      timeAgo: 'Just now',
      unread: true,
    });
    showToast('Session summary & syllabus notes saved to Daily Lecture Register.');
  };

  const handleAttendanceSubmitted = (updatedRoster: StudentAttendanceEntry[]) => {
    academicStore.recordAttendance({
      subject: nowLecture.subject,
      classId: nowLecture.classId || 'class-csd-te-a',
      className: nowLecture.className || 'TE CSD - AI',
      room: nowLecture.room || 'Room B-204',
      time: nowLecture.time || '10:00 AM',
      teacherName: 'Prof. Rajesh Verma',
      updatedRoster,
    });
    setIsAttendanceModalOpen(false);
    showToast(`Attendance marked successfully for ${nowLecture.subject}!`);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    academicStore.addNotification({
      type: 'alert',
      title: `Class Notice: ${nowLecture.className}`,
      message: `From ${nowLecture.teacher || 'Subject Teacher'}: "${broadcastMessage}"`,
      timeAgo: 'Just now',
      unread: true,
    });

    setIsBroadcastModalOpen(false);
    setBroadcastMessage('');
    showToast(`Instant alert broadcasted to ${totalCount} enrolled students.`);
  };

  const handleQuickToggleStudent = (studentId: string) => {
    const updated = studentsRoster.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          status: s.status === 'present' ? ('absent' as const) : ('present' as const),
        };
      }
      return s;
    });
    academicStore.updateStudentsRoster(updated);
    showToast('Student attendance status toggled.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17151C] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#6D3DE8]/40 text-sm animate-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#6B6875] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* TOP HEADER: LIVE SESSION MONITOR */}
      <div className="bg-gradient-to-r from-[#F9F5FF] via-white to-[#F3EEFF] border border-[#E0D4FC] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(109,61,232,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#6D3DE8]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#6D3DE8] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Live Classroom Monitor
              </span>
              <span className="px-2.5 py-0.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] text-[12px] font-bold rounded-full">
                Faculty: Prof. Rajesh Verma
              </span>
              <span className="px-2.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A34A] text-[12px] font-bold rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">wifi</span>
                Room B-204 Beacon Connected
              </span>
            </div>

            <h1 className="font-manrope text-2xl sm:text-3xl font-extrabold text-[#17151C] tracking-tight">
              NOW &amp; NEXT Lecture Command Dashboard
            </h1>
            <p className="text-[14px] text-[#6B6875] mt-1 max-w-2xl">
              Real-time teaching session console for in-progress lecture, live attendance roll call, and upcoming lab session readiness.
            </p>

            {/* Quick Context Chips */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[13px]">
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">schedule</span>
                <span className="text-[#6B6875]">Current Time:</span>
                <strong>Wednesday, 10:22 AM</strong>
              </span>
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">school</span>
                <span className="text-[#6B6875]">Target Class:</span>
                <strong>TE CSD - AI (Div A)</strong>
              </span>
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#16A34A]">timer</span>
                <span className="text-[#6B6875]">Period 2:</span>
                <strong className="text-[#6D3DE8]">{minutesRemaining} minutes remaining</strong>
              </span>
            </div>
          </div>

          {/* Quick Actions & Slot Simulator */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            {/* Slot Simulator Selector */}
            <div className="bg-white border border-[#E0D4FC] p-1.5 rounded-xl shadow-2xs flex items-center gap-1 text-[11px] font-bold">
              <span className="text-[#6B6875] px-2 text-[10px] uppercase font-bold tracking-wider">
                Simulate Slot:
              </span>
              <button
                onClick={() => setActiveSlotSim('p1')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  activeSlotSim === 'p1' ? 'bg-[#6D3DE8] text-white' : 'text-[#6B6875] hover:bg-[#F3EEFF]'
                }`}
              >
                09:00 AM (P1)
              </button>
              <button
                onClick={() => setActiveSlotSim('p2')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  activeSlotSim === 'p2' ? 'bg-[#6D3DE8] text-white' : 'text-[#6B6875] hover:bg-[#F3EEFF]'
                }`}
              >
                10:00 AM (NOW)
              </button>
              <button
                onClick={() => setActiveSlotSim('p3')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  activeSlotSim === 'p3' ? 'bg-[#6D3DE8] text-white' : 'text-[#6B6875] hover:bg-[#F3EEFF]'
                }`}
              >
                11:15 AM (Lab)
              </button>
              <button
                onClick={() => setActiveSlotSim('p4')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  activeSlotSim === 'p4' ? 'bg-[#6D3DE8] text-white' : 'text-[#6B6875] hover:bg-[#F3EEFF]'
                }`}
              >
                02:00 PM (P5)
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="px-4 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white text-[13px] font-bold rounded-xl shadow-[0_4px_12px_rgba(109,61,232,0.25)] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                Take Live Attendance
              </button>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="px-3.5 py-2 bg-white border border-[#E0D4FC] text-[#6D3DE8] hover:bg-[#F3EEFF] text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Project Student Self-Check-in QR Code"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                Project QR Code
              </button>
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="px-3 py-2 bg-white border border-[#E8E4EE] text-[#17151C] hover:bg-[#FDF7FF] text-[13px] font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Send instant alert to this class"
              >
                <span className="material-symbols-outlined text-[18px]">campaign</span>
                Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HERO SECTION: NOW LECTURE vs NEXT LECTURE DUAL HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT 7 COLS: NOW LECTURE IN PROGRESS ================= */}
        <div className="lg:col-span-7 bg-white border-2 border-[#6D3DE8]/30 rounded-2xl p-6 shadow-[0px_4px_20px_rgba(109,61,232,0.08)] relative flex flex-col justify-between overflow-hidden">
          {/* Top Decorative Indicator */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6D3DE8] via-[#8B5CF6] to-[#10B981]" />

          <div>
            {/* Header badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[#6D3DE8] text-[12px] font-extrabold bg-[#F3EEFF] border border-[#E0D4FC] px-3.5 py-1.5 rounded-full shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6D3DE8] animate-pulse" />
                LECTURE IN PROGRESS (NOW)
              </span>

              <span className="text-[12px] font-mono font-bold text-[#6D3DE8] bg-[#FDF7FF] px-2.5 py-1 rounded-lg border border-[#E8E4EE]">
                Slot: {nowLecture.time} – {nowLecture.endTime || '11:00 AM'}
              </span>
            </div>

            {/* Subject and Class */}
            <h2 className="font-manrope text-2xl sm:text-3xl font-extrabold text-[#17151C] tracking-tight">
              {nowLecture.subject}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#6B6875] mt-1.5">
              <span className="font-semibold text-[#6D3DE8]">{nowLecture.className || 'TE CSD - AI'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#17151C] font-medium">
                <span className="material-symbols-outlined text-[17px] text-[#6D3DE8]">location_on</span>
                {nowLecture.room || 'Room B-204 (Smart Class)'}
              </span>
              <span>•</span>
              <span>Course Code: <strong>CSD-602</strong></span>
            </div>

            {/* Lecture Time Progress Bar */}
            <div className="mt-5 p-4 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE]">
              <div className="flex items-center justify-between text-[12px] font-bold text-[#17151C] mb-2">
                <span className="flex items-center gap-1 text-[#6D3DE8]">
                  <span className="material-symbols-outlined text-[16px]">timelapse</span>
                  {elapsedMinutes} mins elapsed ({elapsedPercent}%)
                </span>
                <span className="text-[#16A34A] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  {minutesRemaining} mins remaining
                </span>
              </div>
              <div className="w-full bg-[#E8E4EE] rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#6D3DE8] to-[#10B981] transition-all duration-500"
                  style={{ width: `${elapsedPercent}%` }}
                />
              </div>
            </div>

            {/* Attendance Key Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-center">
                <span className="text-[10px] font-extrabold text-[#16A34A] uppercase block">Attendance Rate</span>
                <span className="text-2xl font-extrabold text-[#16A34A]">{attendanceRate}%</span>
                <span className="text-[11px] text-[#16A34A] block font-medium">Compliant</span>
              </div>
              <div className="p-3 bg-white border border-[#E8E4EE] rounded-xl text-center shadow-2xs">
                <span className="text-[10px] font-extrabold text-[#6B6875] uppercase block">Headcount Present</span>
                <span className="text-2xl font-extrabold text-[#17151C]">
                  {presentCount} <span className="text-sm font-normal text-[#6B6875]">/ {totalCount}</span>
                </span>
                <span className="text-[11px] text-[#16A34A] block font-medium">In Classroom</span>
              </div>
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-center">
                <span className="text-[10px] font-extrabold text-[#DC2626] uppercase block">Absentees Flagged</span>
                <span className="text-2xl font-extrabold text-[#DC2626]">{absentStudents.length}</span>
                <span className="text-[11px] text-[#DC2626] block font-medium">SMS Triggered</span>
              </div>
            </div>

            {/* Syllabus Topic & Teacher Blackboard Notes */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-extrabold text-[#17151C] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#6D3DE8]">edit_note</span>
                  Blackboard Lesson Plan &amp; Learning Outcomes
                </label>
                <button
                  onClick={handleSaveSessionNotes}
                  className="text-[11px] font-bold text-[#6D3DE8] hover:text-[#5416D0] flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">save</span>
                  Save to Daily Log
                </button>
              </div>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={3}
                placeholder="Log topics covered, code examples run, student doubts, or homework assigned..."
                className="w-full p-3 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#17151C] outline-none focus:border-[#6D3DE8] focus:bg-white resize-none"
              />
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="mt-6 pt-4 border-t border-[#E8E4EE] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAttendanceModalOpen(true)}
                className="px-4 py-2 bg-[#6D3DE8] text-white text-[13px] font-bold rounded-xl hover:bg-[#5416D0] shadow-sm flex items-center gap-2 transition-all cursor-pointer font-manrope"
              >
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                Mark / Update Attendance
              </button>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="px-3 py-2 bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC] text-[13px] font-bold rounded-xl border border-[#E0D4FC] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">qr_code</span>
                Project QR
              </button>
            </div>

            <button
              onClick={() => onNavigateTab && onNavigateTab('lecture-history')}
              className="text-[12px] font-bold text-[#6D3DE8] hover:underline flex items-center gap-1"
            >
              <span>View Lecture History Register</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT 5 COLS: NEXT LECTURE READINESS ================= */}
        <div className="lg:col-span-5 bg-[#FDF7FF] border border-[#E8E4EE] rounded-2xl p-6 flex flex-col justify-between shadow-[0px_2px_8px_rgba(23,21,28,0.03)] relative">
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[#D97706] text-[11px] font-extrabold uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-[15px]">upcoming</span>
                NEXT UP (IN 45 MINS)
              </span>
              <span className="text-[12px] font-mono font-bold text-[#6B6875]">
                {nextLecture.time} – {nextLecture.endTime || '01:15 PM'}
              </span>
            </div>

            <h3 className="font-manrope text-xl sm:text-2xl font-bold text-[#17151C]">
              {nextLecture.subject}
            </h3>

            <div className="mt-2 space-y-1.5 text-[13px] text-[#6B6875]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#6D3DE8]">group</span>
                <span>Batch: <strong>{nextLecture.className || 'TE CSD - AI (Batch A1 & A2)'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#6D3DE8]">biotech</span>
                <span>Venue: <strong>{nextLecture.room || 'AI & Data Lab L-102'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#6D3DE8]">assignment</span>
                <span>Session: <strong>Practical Experiment 4 (Node.js & MongoDB REST API)</strong></span>
              </div>
            </div>

            {/* Lab / Lecture Readiness Checklist */}
            <div className="mt-5 p-4 bg-white rounded-xl border border-[#E8E4EE]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[12px] font-bold text-[#17151C] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#16A34A]">checklist</span>
                  Session Preparation Checklist
                </h4>
                <span className="text-[11px] font-bold text-[#6D3DE8]">
                  {Object.values(checklist).filter(Boolean).length} / {Object.keys(checklist).length} Ready
                </span>
              </div>

              <div className="space-y-2.5 text-[12px]">
                <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#6D3DE8] transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.terminalsReady}
                    onChange={() => toggleChecklist('terminalsReady')}
                    className="w-4 h-4 rounded text-[#6D3DE8] focus:ring-[#6D3DE8]"
                  />
                  <span className={checklist.terminalsReady ? 'text-[#17151C] line-through text-[#6B6875]' : 'text-[#17151C]'}>
                    Workstations 1–30 powered on &amp; terminal login active
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#6D3DE8] transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.pgServerActive}
                    onChange={() => toggleChecklist('pgServerActive')}
                    className="w-4 h-4 rounded text-[#6D3DE8] focus:ring-[#6D3DE8]"
                  />
                  <span className={checklist.pgServerActive ? 'text-[#17151C] line-through text-[#6B6875]' : 'text-[#17151C]'}>
                    PostgreSQL 16 &amp; Node v20 LTS verified on lab server
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#6D3DE8] transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.assignmentUploaded}
                    onChange={() => toggleChecklist('assignmentUploaded')}
                    className="w-4 h-4 rounded text-[#6D3DE8] focus:ring-[#6D3DE8]"
                  />
                  <span className={checklist.assignmentUploaded ? 'text-[#17151C] line-through text-[#6B6875]' : 'text-[#17151C]'}>
                    Experiment manual &amp; starter code posted on portal
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#6D3DE8] transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.labAssistantAlerted}
                    onChange={() => toggleChecklist('labAssistantAlerted')}
                    className="w-4 h-4 rounded text-[#6D3DE8] focus:ring-[#6D3DE8]"
                  />
                  <span className={checklist.labAssistantAlerted ? 'text-[#17151C] line-through text-[#6B6875]' : 'text-[#17151C]'}>
                    Lab Assistant (Mr. Ramesh Patil) notified
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#6D3DE8] transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.rollSheetPrinted}
                    onChange={() => toggleChecklist('rollSheetPrinted')}
                    className="w-4 h-4 rounded text-[#6D3DE8] focus:ring-[#6D3DE8]"
                  />
                  <span className={checklist.rollSheetPrinted ? 'text-[#17151C] line-through text-[#6B6875]' : 'text-[#17151C]'}>
                    Physical backup roll call sheet printed
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Pre-session Actions */}
          <div className="mt-5 pt-4 border-t border-[#E8E4EE] flex items-center justify-between gap-2">
            <button
              onClick={() => {
                showToast('Lab Room shift notification sent to Batch A1 & A2.');
              }}
              className="px-3 py-2 bg-white hover:bg-[#F3EEFF] text-[#17151C] text-[12px] font-bold rounded-xl border border-[#E8E4EE] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#6D3DE8]">notifications_active</span>
              Alert Students for Lab
            </button>

            <button
              onClick={() => {
                showToast('AI Lab L-102 door unlock beacon confirmed.');
              }}
              className="px-3 py-2 bg-[#F3EEFF] hover:bg-[#E0D4FC] text-[#6D3DE8] text-[12px] font-bold rounded-xl border border-[#E0D4FC] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              Unlock Lab L-102
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE CLASS ATTENDEES ROSTER & DEFICIENCY WATCH */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl p-6 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E4EE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                Current Classroom Roster &amp; Live Check-ins
              </h3>
              <span className="px-2 py-0.5 bg-[#F3EEFF] text-[#6D3DE8] text-[11px] font-extrabold rounded-full">
                {totalCount} Enrolled
              </span>
            </div>
            <p className="text-[13px] text-[#6B6875]">
              Quick-toggle attendance in real-time or click "Take Live Attendance" for bulk actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#6B6875]">
              <strong className="text-[#16A34A]">{presentCount} Present</strong> •{' '}
              <strong className="text-[#DC2626]">{absentStudents.length} Absent</strong>
            </span>
            <button
              onClick={() => {
                showToast('Automated SMS warning sent to parents of all absent students.');
              }}
              className="px-3 py-1.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] rounded-xl text-[12px] font-bold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">sms</span>
              SMS Absentees' Parents
            </button>
          </div>
        </div>

        {/* Quick Student Grid (Showing all 30 students with live toggles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {studentsRoster.slice(0, 15).map((st) => {
            const isPresent = st.status === 'present';
            const isDefaulter = (st.percentage || 100) < 75;

            return (
              <div
                key={st.id}
                onClick={() => handleQuickToggleStudent(st.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 select-none ${
                  isPresent
                    ? 'border-[#A7F3D0] bg-[#ECFDF5]/50 hover:bg-[#ECFDF5]'
                    : 'border-[#FECACA] bg-[#FEF2F2]/60 hover:bg-[#FEF2F2]'
                }`}
                title={`Click to mark ${isPresent ? 'Absent' : 'Present'}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[13px] text-[#17151C] truncate leading-tight">
                      {st.name}
                    </p>
                    <span className="text-[11px] font-mono text-[#6B6875] block">
                      {st.rollNo}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end">
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      isPresent ? 'bg-[#16A34A] text-white' : 'bg-[#DC2626] text-white'
                    }`}
                  >
                    {isPresent ? 'P' : 'A'}
                  </span>
                  {isDefaulter && (
                    <span className="text-[9px] font-bold text-[#DC2626] mt-0.5" title="Below 75%">
                      {st.percentage}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-[12px] text-[#6B6875]">
          <span>Showing 15 of {totalCount} students in quick grid. Open attendance modal for complete table.</span>
          <button
            onClick={() => setIsAttendanceModalOpen(true)}
            className="text-[#6D3DE8] font-bold hover:underline flex items-center gap-1"
          >
            <span>Open Complete Attendance Register</span>
            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: FULL DAY TIMELINE FOR FACULTY */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl p-6 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E4EE] pb-4">
          <div>
            <h3 className="font-manrope text-lg font-bold text-[#17151C]">
              Today's Complete Teaching Schedule (Wednesday)
            </h3>
            <p className="text-[13px] text-[#6B6875]">
              Daily academic progression across SE, TE, and BE divisions
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('timetable')}
            className="text-[12px] font-bold text-[#6D3DE8] hover:text-[#5416D0] flex items-center gap-1"
          >
            <span>Full Master Timetable</span>
            <span className="material-symbols-outlined text-[15px]">calendar_month</span>
          </button>
        </div>

        <div className="space-y-3">
          {facultyDaySchedule.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                item.status === 'now'
                  ? 'border-[#6D3DE8] bg-[#F3EEFF]/50 ring-1 ring-[#6D3DE8]/30'
                  : item.status === 'next'
                  ? 'border-amber-300 bg-amber-50/40'
                  : item.status === 'completed'
                  ? 'border-[#A7F3D0] bg-[#ECFDF5]/30 opacity-80'
                  : 'border-[#E8E4EE] bg-[#FDF7FF]/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E4EE] flex items-center justify-center shrink-0 shadow-2xs">
                  {item.status === 'now' ? (
                    <span className="material-symbols-outlined text-[#6D3DE8] text-[22px] animate-pulse">
                      play_circle
                    </span>
                  ) : item.status === 'completed' ? (
                    <span className="material-symbols-outlined text-[#16A34A] text-[20px]">
                      check_circle
                    </span>
                  ) : item.type === 'Break' ? (
                    <span className="material-symbols-outlined text-[#6B6875] text-[20px]">
                      coffee
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[#6B6875] text-[20px]">
                      schedule
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[12px] font-bold text-[#6D3DE8]">
                      {item.slot}
                    </span>
                    {item.status === 'now' && (
                      <span className="px-2 py-0.5 bg-[#6D3DE8] text-white text-[10px] font-extrabold uppercase rounded-full">
                        ACTIVE NOW
                      </span>
                    )}
                    {item.status === 'next' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-[#D97706] border border-amber-300 text-[10px] font-extrabold uppercase rounded-full">
                        NEXT
                      </span>
                    )}
                  </div>

                  <h4 className="font-manrope text-base font-bold text-[#17151C] mt-0.5">
                    {item.subject}
                  </h4>
                  <p className="text-[12px] text-[#6B6875]">
                    {item.className} • {item.room} • {item.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-[#6B6875]">
                  Status: <strong className="text-[#17151C]">{item.attendance}</strong>
                </span>

                {item.status === 'now' && (
                  <button
                    onClick={() => setIsAttendanceModalOpen(true)}
                    className="px-3 py-1.5 bg-[#6D3DE8] hover:bg-[#5416D0] text-white text-[12px] font-bold rounded-lg shadow-2xs"
                  >
                    Mark
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: TAKE ATTENDANCE MODAL */}
      {isAttendanceModalOpen && (
        <TakeAttendanceModal
          onClose={() => setIsAttendanceModalOpen(false)}
          onSubmit={handleAttendanceSubmitted}
          subject={nowLecture.subject}
          className={nowLecture.className || 'TE CSD - AI'}
          room={nowLecture.room || 'Room B-204'}
          time={nowLecture.time || '10:00 AM'}
          initialRoster={studentsRoster}
        />
      )}

      {/* MODAL 2: PROJECT STUDENT QR CODE MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in zoom-in-95 text-center">
            <div className="flex justify-between items-center pb-2">
              <span className="px-3 py-1 bg-[#F3EEFF] text-[#6D3DE8] text-[11px] font-bold rounded-full">
                Beacon Geo-Fenced Check-In
              </span>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="p-1.5 text-[#6B6875] hover:text-[#17151C] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <h3 className="font-manrope text-2xl font-extrabold text-[#17151C] mt-2">
              {nowLecture.subject}
            </h3>
            <p className="text-[13px] text-[#6B6875] mt-1">
              Project onto the classroom display in <strong>{nowLecture.room}</strong>
            </p>

            {/* Generated QR Code Graphic */}
            <div className="my-6 p-6 bg-[#FDF7FF] border-2 border-dashed border-[#6D3DE8]/40 rounded-2xl flex flex-col items-center justify-center">
              <div className="w-52 h-52 bg-white p-3 rounded-xl border border-[#E8E4EE] shadow-md flex items-center justify-center">
                {/* Simulated high-fidelity QR Code image */}
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://technova.edu/checkin/csd-602-now"
                  alt="Student Attendance QR"
                  className="w-full h-full rounded"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-[12px] font-mono font-bold text-[#6D3DE8]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                Token refreshes in 45s • Geo-fenced: Room B-204
              </div>
            </div>

            <div className="bg-[#FDF7FF] p-3 rounded-xl border border-[#E8E4EE] text-[12px] text-[#6B6875]">
              Students scan via the TechNova Mobile App while connected to campus Wi-Fi.
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="flex-1 py-2.5 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[13px] font-bold text-[#17151C] hover:bg-[#F3EEFF]"
              >
                Done
              </button>
              <button
                onClick={() => {
                  showToast('QR Code maximized to full projector display.');
                }}
                className="flex-1 py-2.5 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[13px] font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">fullscreen</span>
                Projector Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BROADCAST CLASSROOM NOTICE MODAL */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#E8E4EE] pb-3">
              <div>
                <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                  Broadcast Notice to Class
                </h3>
                <p className="text-[12px] text-[#6B6875]">
                  Instant push notification to all 30 students of {nowLecture.className}
                </p>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1.5 text-[#6B6875] hover:text-[#17151C] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 mt-4">
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Alert Message
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Please bring your laptops for the last 15 minutes of class for query benchmarking..."
                  rows={4}
                  required
                  className="w-full p-3 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                />
              </div>

              <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-[12px] text-[#16A34A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Delivers to student mobile app &amp; email notifications immediately.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[12px] font-bold text-[#17151C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Send Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
