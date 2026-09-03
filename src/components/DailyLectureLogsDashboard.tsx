import React, { useState, useEffect, useMemo } from 'react';
import { academicStore } from '../data/academicStore';
import { LectureHistoryItem, StudentAttendanceEntry } from '../types';
import { TakeAttendanceModal } from './TakeAttendanceModal';

interface DailyLectureLogsDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export const DailyLectureLogsDashboard: React.FC<DailyLectureLogsDashboardProps> = ({
  onNavigateTab,
}) => {
  const [storeState, setStoreState] = useState(academicStore.getState());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'substitute' | 'cancelled' | 'low'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Modals state
  const [isTakeAttendanceOpen, setIsTakeAttendanceOpen] = useState(false);
  const [isLogLectureModalOpen, setIsLogLectureModalOpen] = useState(false);
  const [selectedLogForSlip, setSelectedLogForSlip] = useState<LectureHistoryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Lecture Form State
  const [newSubject, setNewSubject] = useState('Data Structures & Algorithms');
  const [newDate, setNewDate] = useState('Oct 29, 2026');
  const [newTime, setNewTime] = useState('02:00–03:00 PM');
  const [newRoom, setNewRoom] = useState('Room B-204');
  const [newTeacher, setNewTeacher] = useState('Prof. Anjali Sharma');
  const [newType, setNewType] = useState<'completed' | 'substitute' | 'cancelled'>('completed');
  const [newSubstituteNote, setNewSubstituteNote] = useState('');
  const [newPresentCount, setNewPresentCount] = useState(36);
  const [newTotalCount, setNewTotalCount] = useState(40);
  const [newTopic, setNewTopic] = useState('');

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

  const logs: LectureHistoryItem[] = storeState.lectureHistory || [];
  const studentsRoster: StudentAttendanceEntry[] = storeState.studentsRoster || [];

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Subject filter
      if (selectedSubject !== 'all' && !log.subject.toLowerCase().includes(selectedSubject.toLowerCase())) {
        return false;
      }

      // Status filter
      if (statusFilter === 'completed' && log.status !== 'completed') return false;
      if (statusFilter === 'substitute' && log.status !== 'substitute') return false;
      if (statusFilter === 'cancelled' && log.status !== 'cancelled') return false;
      if (statusFilter === 'low' && log.attendancePercent >= 75) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          log.subject.toLowerCase().includes(q) ||
          (log.teacherName && log.teacherName.toLowerCase().includes(q)) ||
          (log.room && log.room.toLowerCase().includes(q)) ||
          (log.notes && log.notes.toLowerCase().includes(q)) ||
          log.date.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [logs, selectedSubject, statusFilter, searchQuery]);

  // Summary Metrics
  const totalLogs = logs.length;
  const completedLogs = logs.filter((l) => l.status === 'completed');
  const substituteLogs = logs.filter((l) => l.status === 'substitute');
  const cancelledLogs = logs.filter((l) => l.status === 'cancelled');

  const totalAttended = completedLogs.reduce((acc, l) => acc + l.presentCount, 0);
  const totalPossible = completedLogs.reduce((acc, l) => acc + l.totalCount, 0);
  const avgAttendancePercent = totalPossible > 0 ? ((totalAttended / totalPossible) * 100).toFixed(1) : '88.4';

  const lowAttendanceLogs = logs.filter((l) => l.status === 'completed' && l.attendancePercent < 75);

  // Today's Live Lecture Schedule
  const todayLectures = [
    {
      id: 'live-1',
      time: '09:00 – 10:00 AM',
      subject: 'Data Structures & Algorithms',
      code: 'CSD-601',
      teacher: 'Prof. Anjali Sharma',
      room: 'Room B-204',
      type: 'Theory Lecture',
      status: 'completed',
      attendancePercent: 93.3,
      present: 28,
      total: 30,
      topic: 'AVL Tree Double Rotations (LR/RL) & Balance Factors',
    },
    {
      id: 'live-2',
      time: '10:00 – 11:00 AM',
      subject: 'Computer Networks',
      code: 'CSD-604',
      teacher: 'Prof. Sunita Rao',
      room: 'Room B-204',
      type: 'Theory Lecture',
      status: 'active',
      attendancePercent: 96.6,
      present: 29,
      total: 30,
      topic: 'TCP Sliding Window Protocols & Congestion Window (AIMD)',
    },
    {
      id: 'live-3',
      time: '11:15 – 01:15 PM',
      subject: 'Artificial Intelligence & Vision Lab',
      code: 'CSD-607',
      teacher: 'Dr. Sunita Deshmukh',
      room: 'AI Lab L-102',
      type: 'Practical Lab (Batch A1 & A2)',
      status: 'upcoming',
      attendancePercent: 0,
      present: 0,
      total: 30,
      topic: 'Experiment 5: Heuristic A* Graph Search implementation with NumPy',
    },
    {
      id: 'live-4',
      time: '02:00 – 03:00 PM',
      subject: 'Database Management Systems',
      code: 'CSD-602',
      teacher: 'Prof. Rajesh Verma',
      room: 'Room B-204',
      type: 'Theory Lecture',
      status: 'upcoming',
      attendancePercent: 0,
      present: 0,
      total: 30,
      topic: 'ACID Properties & Two-Phase Locking (2PL) Concurrency Protocol',
    },
    {
      id: 'live-5',
      time: '03:00 – 04:00 PM',
      subject: 'Web Technology',
      code: 'CSD-606',
      teacher: 'Prof. Rohit Nair',
      room: 'Room B-204',
      type: 'Theory Lecture',
      status: 'upcoming',
      attendancePercent: 0,
      present: 0,
      total: 30,
      topic: 'React Custom Hooks, Context State & REST API Integration',
    },
  ];

  // Subject options
  const subjectsList = [
    { code: 'CSD-601', name: 'Data Structures' },
    { code: 'CSD-602', name: 'Database Management Systems' },
    { code: 'CSD-603', name: 'Operating Systems' },
    { code: 'CSD-604', name: 'Computer Networks' },
    { code: 'CSD-605', name: 'Software Engineering' },
    { code: 'CSD-606', name: 'Web Technology' },
    { code: 'CSD-607', name: 'Artificial Intelligence' },
    { code: 'CSD-608', name: 'Computer Graphics' },
  ];

  const handleCreateNewLecture = (e: React.FormEvent) => {
    e.preventDefault();
    const pct = newTotalCount > 0 ? Math.round((newPresentCount / newTotalCount) * 100 * 10) / 10 : 0;

    const newLogItem: LectureHistoryItem = {
      id: `lh-${Date.now()}`,
      date: newDate,
      time: newTime,
      subject: newSubject,
      class: 'TE CSD-A',
      classId: 'class-csd-te-a',
      teacherName: newTeacher,
      room: newRoom,
      attendancePercent: newType === 'cancelled' ? 0 : pct,
      presentCount: newType === 'cancelled' ? 0 : newPresentCount,
      totalCount: newTotalCount,
      status: newType,
      substituteTeacher: newType === 'substitute' ? newSubstituteNote || 'Substituted Lecture' : undefined,
      notes: newTopic ? `Topic: ${newTopic}` : undefined,
      syncedOffline: false,
    };

    academicStore.addLectureLog(newLogItem);
    showToast(`Successfully recorded lecture log for ${newSubject}!`);
    setIsLogLectureModalOpen(false);

    // Reset form
    setNewTopic('');
    setNewSubstituteNote('');
  };

  const handleTakeAttendanceSubmit = (updatedRoster: StudentAttendanceEntry[]) => {
    academicStore.recordAttendance({
      subject: 'Computer Networks',
      classId: 'class-csd-te-a',
      className: 'TE CSD-A',
      room: 'Room B-204',
      time: '10:00–11:00 AM',
      teacherName: 'Prof. Sunita Rao',
      updatedRoster,
    });
    setIsTakeAttendanceOpen(false);
    showToast('Attendance recorded and synced to Daily Lecture Logs & Class Roster.');
  };

  const handleExportLogsCSV = () => {
    const csvRows = [
      ['Session ID', 'Date', 'Time', 'Subject', 'Class', 'Faculty', 'Room', 'Status', 'Present', 'Total', 'Attendance %', 'Notes'].join(','),
      ...filteredLogs.map((l) =>
        [
          l.id,
          `"${l.date}"`,
          `"${l.time || '10:00 AM'}"`,
          `"${l.subject}"`,
          `"${l.class}"`,
          `"${l.teacherName || 'Faculty'}"`,
          `"${l.room || 'Room B-204'}"`,
          `"${l.status || 'completed'}"`,
          l.presentCount,
          l.totalCount,
          `${l.attendancePercent}%`,
          `"${(l.notes || l.substituteTeacher || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TE_CSD_Daily_Lecture_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Daily Lecture Logs exported to CSV successfully.');
  };

  const handleDeleteLog = (id: string, subject: string) => {
    if (confirm(`Are you sure you want to remove the lecture record for "${subject}"?`)) {
      academicStore.deleteLectureLog(id);
      showToast(`Lecture log for ${subject} deleted.`);
    }
  };

  // Derive simulated present and absent students for roll slip
  const getSlipStudents = (log: LectureHistoryItem) => {
    const total = studentsRoster.length || 30;
    const presentCount = Math.min(total, Math.max(1, Math.round((total * log.attendancePercent) / 100)));
    return studentsRoster.map((st, index) => ({
      ...st,
      sessionStatus: index < presentCount ? 'present' : 'absent',
    }));
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

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#F9F5FF] via-white to-[#F3EEFF] border border-[#E0D4FC] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(109,61,232,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#6D3DE8]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#6D3DE8] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">history_edu</span>
                Academic Lecture Register
              </span>
              <span className="px-2.5 py-0.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] text-[12px] font-bold rounded-full">
                Class: TE CSD - AI (Div A)
              </span>
              <span className="px-2.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A34A] text-[12px] font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                Live Attendance &amp; Log Sync Active
              </span>
            </div>

            <h1 className="font-manrope text-2xl sm:text-3xl font-extrabold text-[#17151C] tracking-tight">
              Daily Lecture Logs &amp; Session History
            </h1>
            <p className="text-[14px] text-[#6B6875] mt-1 max-w-2xl">
              Complete chronological audit of all conducted theory lectures, practical labs, and faculty substitutions for TE CSD - AI.
            </p>

            {/* Quick Context Meta */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-[13px] text-[#17151C]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">supervisor_account</span>
                <span className="text-[#6B6875]">Class Teacher:</span>
                <strong>Prof. Anjali Sharma</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">meeting_room</span>
                <span className="text-[#6B6875]">Assigned Room:</span>
                <strong>Room B-204 (Smart Display)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#16A34A]">verified</span>
                <span className="text-[#6B6875]">Register Status:</span>
                <strong className="text-[#16A34A]">Verified by HOD</strong>
              </span>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsTakeAttendanceOpen(true)}
              className="px-4 py-2.5 bg-[#6D3DE8] hover:bg-[#5416D0] text-white text-[13px] font-bold rounded-xl shadow-[0_4px_12px_rgba(109,61,232,0.25)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              Take Live Attendance
            </button>
            <button
              onClick={() => setIsLogLectureModalOpen(true)}
              className="px-3.5 py-2.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] hover:bg-[#F3EEFF] text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">post_add</span>
              Log Extra Lecture
            </button>
            <button
              onClick={handleExportLogsCSV}
              className="px-3.5 py-2.5 bg-white border border-[#E8E4EE] text-[#17151C] hover:bg-[#FDF7FF] text-[13px] font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Download Complete Lecture Register in CSV"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              Export Register
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Conducted */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col justify-between hover:border-[#6D3DE8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Total Sessions Logged</span>
            <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] text-[#6D3DE8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-[#17151C]">{totalLogs}</span>
              <span className="text-[12px] text-[#16A34A] font-bold">
                {completedLogs.length} Conducted
              </span>
            </div>
            <p className="text-[12px] text-[#6B6875] mt-1">Across 8 Semester VI subjects</p>
          </div>
        </div>

        {/* Card 2: Cumulative Attendance */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col justify-between hover:border-[#6D3DE8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Cumulative Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">done_all</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-[#16A34A]">{avgAttendancePercent}%</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]">
                +13.4% Above 75%
              </span>
            </div>
            <p className="text-[12px] text-[#6B6875] mt-1">
              {totalAttended} attended out of {totalPossible} headcount
            </p>
          </div>
        </div>

        {/* Card 3: Substitutions / Adjustments */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col justify-between hover:border-[#6D3DE8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Substitutions &amp; Makeup</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-[#D97706]">{substituteLogs.length}</span>
              <span className="text-[12px] text-[#6B6875]">Sessions</span>
            </div>
            <p className="text-[12px] text-[#6B6875] mt-1">
              {cancelledLogs.length} cancelled due to events / holidays
            </p>
          </div>
        </div>

        {/* Card 4: Low Attendance Flag */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col justify-between hover:border-[#6D3DE8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#DC2626] uppercase tracking-wider">Low Attendance Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-[#DC2626]">{lowAttendanceLogs.length}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                &lt;75% Threshold
              </span>
            </div>
            <p className="text-[12px] text-[#6B6875] mt-1">Automated parent SMS dispatched</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: TODAY'S LIVE LECTURE PROGRESS */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl p-6 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E4EE] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                Today's Daily Lecture Tracking (TE CSD - AI)
              </h3>
            </div>
            <p className="text-[13px] text-[#6B6875]">
              Real-time schedule for Room B-204 &amp; AI Lab • 5 Periods scheduled today
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab && onNavigateTab('timetable')}
              className="text-[12px] font-bold text-[#6D3DE8] hover:text-[#5416D0] flex items-center gap-1"
            >
              <span>View Weekly Timetable</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {todayLectures.map((lec) => (
            <div
              key={lec.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                lec.status === 'active'
                  ? 'border-[#6D3DE8] bg-[#F3EEFF]/60 shadow-xs ring-1 ring-[#6D3DE8]/30'
                  : lec.status === 'completed'
                  ? 'border-[#A7F3D0] bg-[#ECFDF5]/30'
                  : 'border-[#E8E4EE] bg-[#FDF7FF]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#6D3DE8] bg-white px-2 py-0.5 rounded border border-[#E0D4FC]">
                    {lec.time}
                  </span>
                  {lec.status === 'completed' && (
                    <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] text-[10px] font-extrabold uppercase rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      Conducted ({lec.attendancePercent}%)
                    </span>
                  )}
                  {lec.status === 'active' && (
                    <span className="px-2 py-0.5 bg-[#6D3DE8] text-white text-[10px] font-extrabold uppercase rounded-full flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE NOW
                    </span>
                  )}
                  {lec.status === 'upcoming' && (
                    <span className="px-2 py-0.5 bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE] text-[10px] font-semibold rounded-full">
                      Upcoming
                    </span>
                  )}
                </div>

                <h4 className="font-manrope text-base font-bold text-[#17151C] mt-1">
                  {lec.subject}
                </h4>
                <div className="flex items-center gap-2 text-[12px] text-[#6B6875] mt-1">
                  <span>{lec.teacher}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#17151C]">{lec.room}</span>
                </div>

                <div className="mt-3 p-2.5 bg-white rounded-lg border border-[#E8E4EE]/70 text-[12px] text-[#17151C]">
                  <span className="text-[10px] font-bold text-[#6B6875] uppercase block">Topic Covered / Syllabus</span>
                  <p className="mt-0.5 text-[#17151C] font-medium leading-snug line-clamp-2">
                    {lec.topic}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E8E4EE] flex items-center justify-between">
                {lec.status === 'completed' && (
                  <button
                    onClick={() => {
                      setSelectedLogForSlip({
                        id: lec.id,
                        date: 'Today, Oct 29',
                        time: lec.time,
                        subject: lec.subject,
                        class: 'TE CSD-A',
                        teacherName: lec.teacher,
                        room: lec.room,
                        attendancePercent: lec.attendancePercent,
                        presentCount: lec.present,
                        totalCount: lec.total,
                        status: 'completed',
                        notes: lec.topic,
                      });
                    }}
                    className="text-[12px] font-bold text-[#16A34A] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                    View Roll Slip ({lec.present}/{lec.total})
                  </button>
                )}

                {lec.status === 'active' && (
                  <button
                    onClick={() => setIsTakeAttendanceOpen(true)}
                    className="w-full py-1.5 bg-[#6D3DE8] hover:bg-[#5416D0] text-white text-[12px] font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">fact_check</span>
                    Mark Attendance Now
                  </button>
                )}

                {lec.status === 'upcoming' && (
                  <span className="text-[11px] text-[#6B6875] italic">
                    Scheduled • Notification sent to faculty
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: COMPLETE HISTORICAL LECTURE LOG BOOK */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl shadow-[0px_2px_8px_rgba(23,21,28,0.03)] overflow-hidden">
        {/* Title & Filter Bar */}
        <div className="p-5 border-b border-[#E8E4EE] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                Chronological Lecture Register &amp; Daily Log Book
              </h3>
              <p className="text-[13px] text-[#6B6875]">
                {filteredLogs.length} verified sessions displayed • Filter by subject, date, or substitution type
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportLogsCSV}
                className="px-3 py-1.5 bg-[#FDF7FF] hover:bg-[#F3EEFF] border border-[#E8E4EE] text-[#17151C] rounded-xl text-[12px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                Download CSV
              </button>
              <button
                onClick={() => setIsLogLectureModalOpen(true)}
                className="px-3 py-1.5 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[12px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Lecture
              </button>
            </div>
          </div>

          {/* Filter Controls Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-[#17151C] text-white'
                    : 'bg-[#FDF7FF] text-[#6B6875] hover:text-[#17151C] border border-[#E8E4EE]'
                }`}
              >
                All Logs ({logs.length})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 ${
                  statusFilter === 'completed'
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Completed ({completedLogs.length})
              </button>
              <button
                onClick={() => setStatusFilter('substitute')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 ${
                  statusFilter === 'substitute'
                    ? 'bg-[#D97706] text-white'
                    : 'bg-amber-50 text-[#D97706] border border-amber-200'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                Substitutions ({substituteLogs.length})
              </button>
              <button
                onClick={() => setStatusFilter('cancelled')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 ${
                  statusFilter === 'cancelled'
                    ? 'bg-[#6B6875] text-white'
                    : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE]'
                }`}
              >
                Cancelled ({cancelledLogs.length})
              </button>
              <button
                onClick={() => setStatusFilter('low')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 ${
                  statusFilter === 'low'
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">warning</span>
                Deficit &lt;75% ({lowAttendanceLogs.length})
              </button>
            </div>

            {/* Subject Select & Search Input */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-1.5 text-[12px] font-medium bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#17151C] outline-none focus:border-[#6D3DE8]"
              >
                <option value="all">All 8 Subjects</option>
                {subjectsList.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-60">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6875] text-[17px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search faculty, topic, room..."
                  className="w-full pl-9 pr-3.5 py-1.5 text-[12px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#17151C] outline-none focus:border-[#6D3DE8] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table of Daily Lecture Logs */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E8E4EE] text-[11px] font-bold text-[#6B6875] uppercase tracking-wider bg-[#FDF7FF]">
                <th className="p-4 pl-6">Date &amp; Slot</th>
                <th className="p-4">Subject &amp; Type</th>
                <th className="p-4">Faculty &amp; Venue</th>
                <th className="p-4">Topic / Syllabus Covered</th>
                <th className="p-4">Attendance Recorded</th>
                <th className="p-4">Audit Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4EE] text-[13px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#6B6875]">
                    No lecture sessions found matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isCancelled = log.status === 'cancelled';
                  const isSubstitute = log.status === 'substitute';
                  const isLow = !isCancelled && log.attendancePercent < 75;

                  return (
                    <tr key={log.id} className="hover:bg-[#FDF7FF]/70 transition-colors">
                      {/* Date & Time */}
                      <td className="p-4 pl-6 whitespace-nowrap">
                        <div className="font-bold text-[#17151C]">{log.date}</div>
                        <span className="text-[11px] font-mono text-[#6D3DE8]">{log.time || '10:00 AM'}</span>
                      </td>

                      {/* Subject */}
                      <td className="p-4">
                        <div className="font-bold text-[#17151C]">{log.subject}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-medium text-[#6B6875]">{log.class}</span>
                          {isSubstitute && (
                            <span className="px-1.5 py-0.2 bg-amber-50 text-[#D97706] border border-amber-200 text-[10px] font-extrabold rounded">
                              Substitute
                            </span>
                          )}
                          {isCancelled && (
                            <span className="px-1.5 py-0.2 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[10px] font-extrabold rounded">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Faculty & Venue */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium text-[#17151C] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#6D3DE8]">person</span>
                          <span>{log.teacherName || 'Faculty Member'}</span>
                        </div>
                        <span className="text-[11px] text-[#6B6875] flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">location_on</span>
                          {log.room || 'Room B-204'}
                        </span>
                      </td>

                      {/* Topic Covered */}
                      <td className="p-4 max-w-xs">
                        <p className="text-[12px] text-[#17151C] line-clamp-2">
                          {log.notes || log.substituteTeacher || (
                            <span className="text-[#6B6875] italic">Core syllabus unit lecture completed</span>
                          )}
                        </p>
                      </td>

                      {/* Attendance Percentage & Progress Bar */}
                      <td className="p-4 whitespace-nowrap">
                        {isCancelled ? (
                          <span className="text-[12px] text-[#6B6875] italic">— No headcount —</span>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <div className="w-16 bg-[#E8E4EE] rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  isLow ? 'bg-[#DC2626]' : 'bg-[#16A34A]'
                                }`}
                                style={{ width: `${log.attendancePercent}%` }}
                              />
                            </div>
                            <div>
                              <span
                                className={`font-mono font-bold text-[13px] ${
                                  isLow ? 'text-[#DC2626]' : 'text-[#16A34A]'
                                }`}
                              >
                                {log.attendancePercent}%
                              </span>
                              <span className="text-[10px] text-[#6B6875] block font-mono">
                                {log.presentCount}/{log.totalCount}
                              </span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Audit Status */}
                      <td className="p-4 whitespace-nowrap">
                        {isCancelled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                            Not Held
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                            <span className="material-symbols-outlined text-[13px]">warning</span>
                            Low Headcount
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            Verified
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isCancelled && (
                            <button
                              onClick={() => setSelectedLogForSlip(log)}
                              className="px-2.5 py-1 text-[#6D3DE8] hover:bg-[#F3EEFF] rounded-lg text-[12px] font-bold border border-[#E0D4FC] transition-colors"
                              title="View full roll call register for this session"
                            >
                              Roll Slip
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteLog(log.id, log.subject)}
                            className="p-1.5 text-[#6B6875] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                            title="Delete log record"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ROLL-CALL ATTENDANCE SLIP MODAL */}
      {selectedLogForSlip && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start border-b border-[#E8E4EE] pb-4 shrink-0">
              <div>
                <span className="px-2.5 py-0.5 bg-[#F3EEFF] text-[#6D3DE8] text-[11px] font-bold rounded-full">
                  Official Session Attendance Slip
                </span>
                <h3 className="font-manrope text-xl font-bold text-[#17151C] mt-1">
                  {selectedLogForSlip.subject}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#6B6875] mt-1">
                  <span>Date: <strong>{selectedLogForSlip.date}</strong></span>
                  <span>•</span>
                  <span>Time: <strong>{selectedLogForSlip.time || '10:00 AM'}</strong></span>
                  <span>•</span>
                  <span>Teacher: <strong>{selectedLogForSlip.teacherName}</strong></span>
                  <span>•</span>
                  <span>Room: <strong>{selectedLogForSlip.room}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLogForSlip(null)}
                className="p-1.5 text-[#6B6875] hover:text-[#17151C] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Slip Meta summary */}
            <div className="grid grid-cols-3 gap-3 my-4 shrink-0">
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3 text-center">
                <span className="text-[11px] font-bold text-[#16A34A] uppercase block">Attendance Rate</span>
                <span className="text-xl font-extrabold text-[#16A34A]">{selectedLogForSlip.attendancePercent}%</span>
              </div>
              <div className="bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl p-3 text-center">
                <span className="text-[11px] font-bold text-[#6B6875] uppercase block">Present Students</span>
                <span className="text-xl font-extrabold text-[#17151C]">{selectedLogForSlip.presentCount}</span>
              </div>
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3 text-center">
                <span className="text-[11px] font-bold text-[#DC2626] uppercase block">Absentees Count</span>
                <span className="text-xl font-extrabold text-[#DC2626]">
                  {Math.max(0, selectedLogForSlip.totalCount - selectedLogForSlip.presentCount)}
                </span>
              </div>
            </div>

            {/* Syllabus Topic Notes */}
            {selectedLogForSlip.notes && (
              <div className="mb-3 p-3 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE] text-[12px] shrink-0">
                <span className="font-bold text-[#6B6875] uppercase text-[10px] block">Session Topic &amp; Remarks</span>
                <p className="text-[#17151C] mt-0.5">{selectedLogForSlip.notes}</p>
              </div>
            )}

            {/* Roll Call Students List */}
            <div className="flex-1 overflow-y-auto pr-1 border border-[#E8E4EE] rounded-xl">
              <div className="p-3 bg-[#FDF7FF] border-b border-[#E8E4EE] text-[11px] font-bold text-[#6B6875] uppercase">
                Student Roster Verification ({getSlipStudents(selectedLogForSlip).length} Enrolled)
              </div>
              <div className="divide-y divide-[#E8E4EE] text-[12px]">
                {getSlipStudents(selectedLogForSlip).map((st) => (
                  <div key={st.id} className="p-2.5 flex items-center justify-between hover:bg-[#FDF7FF]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#6B6875] w-16">{st.rollNo}</span>
                      <img src={st.avatar} alt={st.name} className="w-6 h-6 rounded-full" />
                      <span className="font-semibold text-[#17151C]">{st.name}</span>
                    </div>

                    <div>
                      {st.sessionStatus === 'present' ? (
                        <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] rounded-full text-[10px] font-bold">
                          Present
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-full text-[10px] font-bold">
                          Absent (Notified)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E8E4EE] flex justify-between items-center shrink-0">
              <button
                onClick={() => {
                  showToast(`Parent SMS alert dispatched to all ${selectedLogForSlip.totalCount - selectedLogForSlip.presentCount} absentees.`);
                }}
                className="px-3 py-1.5 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-xl text-[12px] font-bold hover:bg-[#FEE2E2] flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">sms</span>
                SMS Absentees
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLogForSlip(null)}
                  className="px-4 py-2 bg-[#FDF7FF] text-[#17151C] border border-[#E8E4EE] rounded-xl text-[12px] font-bold hover:bg-[#F3EEFF]"
                >
                  Close Slip
                </button>
                <button
                  onClick={() => {
                    showToast('Official Session Attendance Slip downloaded (PDF/Print ready).');
                    setSelectedLogForSlip(null);
                  }}
                  className="px-4 py-2 bg-[#6D3DE8] text-white rounded-xl text-[12px] font-bold hover:bg-[#5416D0] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Print Register Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG NEW / EXTRA CLASS MODAL */}
      {isLogLectureModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E8E4EE] pb-4">
              <div>
                <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                  Log Academic Lecture / Extra Class
                </h3>
                <p className="text-[12px] text-[#6B6875]">
                  Record an extra lecture, compensatory session, or faculty substitute
                </p>
              </div>
              <button
                onClick={() => setIsLogLectureModalOpen(false)}
                className="p-1.5 text-[#6B6875] hover:text-[#17151C] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateNewLecture} className="space-y-4 mt-4">
              {/* Subject */}
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Subject Course
                </label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                  required
                >
                  {subjectsList.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Oct 29, 2026"
                    className="w-full px-3 py-2 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 02:00–03:00 PM"
                    className="w-full px-3 py-2 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                    required
                  />
                </div>
              </div>

              {/* Faculty & Venue */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Faculty Incharge
                  </label>
                  <input
                    type="text"
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                    placeholder="e.g. Prof. Anjali Sharma"
                    className="w-full px-3 py-2 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Classroom / Lab
                  </label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="e.g. Room B-204"
                    className="w-full px-3 py-2 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                    required
                  />
                </div>
              </div>

              {/* Status Type */}
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Session Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('completed')}
                    className={`py-2 text-[12px] font-bold rounded-xl border transition-all ${
                      newType === 'completed'
                        ? 'bg-[#16A34A] text-white border-[#16A34A]'
                        : 'bg-[#FDF7FF] text-[#6B6875] border-[#E8E4EE]'
                    }`}
                  >
                    Regular / Extra
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('substitute')}
                    className={`py-2 text-[12px] font-bold rounded-xl border transition-all ${
                      newType === 'substitute'
                        ? 'bg-[#D97706] text-white border-[#D97706]'
                        : 'bg-[#FDF7FF] text-[#6B6875] border-[#E8E4EE]'
                    }`}
                  >
                    Substitute
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('cancelled')}
                    className={`py-2 text-[12px] font-bold rounded-xl border transition-all ${
                      newType === 'cancelled'
                        ? 'bg-[#6B6875] text-white border-[#6B6875]'
                        : 'bg-[#FDF7FF] text-[#6B6875] border-[#E8E4EE]'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              {/* Substitute notes if substitute */}
              {newType === 'substitute' && (
                <div>
                  <label className="block text-[12px] font-bold text-[#D97706] mb-1">
                    Substitute Details &amp; Reason
                  </label>
                  <input
                    type="text"
                    value={newSubstituteNote}
                    onChange={(e) => setNewSubstituteNote(e.target.value)}
                    placeholder="e.g. Prof. Rohan Kadam (Substituted for Dr. Kulkarni on medical leave)"
                    className="w-full px-3 py-2 text-[13px] bg-amber-50/50 border border-amber-200 rounded-xl outline-none focus:border-[#D97706]"
                    required
                  />
                </div>
              )}

              {/* Headcount if not cancelled */}
              {newType !== 'cancelled' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                      Present Students
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={newTotalCount}
                      value={newPresentCount}
                      onChange={(e) => setNewPresentCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#6B6875] mb-1">
                      Total Strength
                    </label>
                    <input
                      type="number"
                      value={newTotalCount}
                      onChange={(e) => setNewTotalCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Topic Covered */}
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Topic / Syllabus Covered
                </label>
                <textarea
                  rows={2}
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Graph Traversal Algorithms (BFS &amp; DFS) with cycle detection proofs..."
                  className="w-full px-3 py-2 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogLectureModalOpen(false)}
                  className="px-4 py-2 bg-[#FDF7FF] text-[#17151C] border border-[#E8E4EE] rounded-xl text-[13px] font-bold hover:bg-[#F3EEFF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[13px] font-bold shadow-xs transition-colors"
                >
                  Record into Log Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TAKE ATTENDANCE MODAL */}
      <TakeAttendanceModal
        isOpen={isTakeAttendanceOpen}
        onClose={() => setIsTakeAttendanceOpen(false)}
        students={studentsRoster}
        onSubmit={handleTakeAttendanceSubmit}
        subject="Computer Networks"
        className="TE CSD-A"
        room="Room B-204"
        time="10:00 – 11:00 AM"
      />
    </div>
  );
};
