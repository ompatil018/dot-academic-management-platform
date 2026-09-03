import React, { useState, useEffect } from 'react';
import { academicStore } from '../data/academicStore';
import { StudentAttendanceEntry, TimetableLecture } from '../types';
import { TakeAttendanceModal } from './TakeAttendanceModal';

interface MyClassDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

interface StudentDetail {
  id: string;
  rollNo: string;
  name: string;
  avatar: string;
  email: string;
  mobile: string;
  percentage: number;
  status: 'present' | 'absent' | 'late';
  isCR?: boolean;
  proctorStatus?: 'Pending' | 'Notice Sent' | 'Parent Meeting' | 'Medical Verified';
  parentName?: string;
  parentPhone?: string;
  subjectAttendance?: Record<string, { attended: number; total: number; percent: number }>;
}

export const MyClassDashboard: React.FC<MyClassDashboardProps> = ({ onNavigateTab }) => {
  const [storeState, setStoreState] = useState(academicStore.getState());
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'subjects' | 'timetable' | 'defaulters' | 'notices'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'defaulters' | 'borderline' | 'regular'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [isTakeAttendanceOpen, setIsTakeAttendanceOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Broadcast form state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeTarget, setNoticeTarget] = useState<'all' | 'students' | 'defaulters'>('all');

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

  // Pull class students from store
  const rawRoster = storeState.studentsRoster || [];
  const allStudentsData = storeState.students || [];

  // Combine student information
  const studentsList: StudentDetail[] = rawRoster.map((item, idx) => {
    const match = allStudentsData.find((s) => s.id === item.id || s.rollNo === item.rollNo);
    const isCR = item.rollNo === 'CSD201' || item.rollNo === 'CSD226'; // Aarav Joshi & Rhea Sen
    
    // Proctor statuses for demo
    let proctorStatus: StudentDetail['proctorStatus'] = 'Pending';
    if (item.rollNo === 'CSD210') proctorStatus = 'Notice Sent'; // Farhan Ali
    if (item.rollNo === 'CSD214') proctorStatus = 'Parent Meeting'; // Jatin Singhal
    if (item.rollNo === 'CSD229') proctorStatus = 'Medical Verified'; // Sameer Siddiqui
    if (item.rollNo === 'CSD219') proctorStatus = 'Notice Sent'; // Naveen Reddy
    if (item.rollNo === 'CSD205') proctorStatus = 'Pending'; // Yash Kulkarni

    return {
      id: item.id,
      rollNo: item.rollNo,
      name: item.name,
      avatar: item.avatar,
      email: match?.email || `${item.name.toLowerCase().replace(/\s+/g, '.')}@technova.edu.in`,
      mobile: match?.mobile || `+91 98${(20000000 + idx * 137).toString().slice(0, 8)}`,
      percentage: item.percentage || 85,
      status: item.status,
      isCR,
      proctorStatus,
      parentName: `Mr. ${item.name.split(' ').pop()} (Guardian)`,
      parentPhone: `+91 97${(30000000 + idx * 241).toString().slice(0, 8)}`,
      subjectAttendance: match?.subjectAttendance,
    };
  });

  // Calculate statistics
  const totalStudents = studentsList.length;
  const defaultersList = studentsList.filter((s) => s.percentage < 75);
  const borderlineList = studentsList.filter((s) => s.percentage >= 75 && s.percentage < 80);
  const regularList = studentsList.filter((s) => s.percentage >= 80);

  const totalPercentageSum = studentsList.reduce((acc, s) => acc + s.percentage, 0);
  const classAvgAttendance = totalStudents > 0 ? (totalPercentageSum / totalStudents).toFixed(1) : '86.2';

  // Filtered students
  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'defaulters') return s.percentage < 75;
    if (statusFilter === 'borderline') return s.percentage >= 75 && s.percentage < 80;
    if (statusFilter === 'regular') return s.percentage >= 80;
    return true;
  });

  // Subjects in TE CSD - AI curriculum
  const teSubjects = [
    {
      code: 'CSD-601',
      name: 'Data Structures & Algorithms',
      teacher: 'Prof. Anjali Sharma',
      cabin: 'Room B-302',
      credits: 4,
      type: 'Theory & Lab',
      classesConducted: 40,
      avgAttendance: 92,
      syllabus: 'Unit 5: Graph Algorithms & Dynamic Programming (85% Covered)',
    },
    {
      code: 'CSD-602',
      name: 'Database Management Systems',
      teacher: 'Prof. Rajesh Verma',
      cabin: 'Room B-305',
      credits: 4,
      type: 'Theory & Lab',
      classesConducted: 38,
      avgAttendance: 86,
      syllabus: 'Unit 4: Transaction & Concurrency Control (75% Covered)',
    },
    {
      code: 'CSD-603',
      name: 'Operating Systems',
      teacher: 'Dr. Vikramaditya Rao',
      cabin: 'Room B-310',
      credits: 3,
      type: 'Theory',
      classesConducted: 36,
      avgAttendance: 78,
      syllabus: 'Unit 4: Memory Management & Paging (70% Covered)',
    },
    {
      code: 'CSD-604',
      name: 'Computer Networks',
      teacher: 'Prof. Sunita Rao',
      cabin: 'Room B-308',
      credits: 4,
      type: 'Theory & Lab',
      classesConducted: 36,
      avgAttendance: 94,
      syllabus: 'Unit 5: Transport Layer & TCP Congestion (80% Covered)',
    },
    {
      code: 'CSD-605',
      name: 'Software Engineering',
      teacher: 'Prof. Priya Mehta',
      cabin: 'Room B-304',
      credits: 3,
      type: 'Theory',
      classesConducted: 32,
      avgAttendance: 88,
      syllabus: 'Unit 4: Agile Scrum & Quality Assurance (75% Covered)',
    },
    {
      code: 'CSD-606',
      name: 'Web Technology',
      teacher: 'Prof. Rohit Nair',
      cabin: 'Room B-307',
      credits: 3,
      type: 'Theory & Lab',
      classesConducted: 30,
      avgAttendance: 91,
      syllabus: 'Unit 4: REST APIs & React Component State (70% Covered)',
    },
    {
      code: 'CSD-607',
      name: 'Artificial Intelligence',
      teacher: 'Dr. Sunita Deshmukh',
      cabin: 'Room B-312',
      credits: 4,
      type: 'Theory & Practical',
      classesConducted: 30,
      avgAttendance: 83,
      syllabus: 'Unit 4: Neural Networks & Heuristic Search (65% Covered)',
    },
    {
      code: 'CSD-608',
      name: 'Computer Graphics & UI Design',
      teacher: 'Prof. Anjali Sharma',
      cabin: 'Room B-302',
      credits: 3,
      type: 'Practical & Design',
      classesConducted: 28,
      avgAttendance: 89,
      syllabus: 'Unit 4: 3D Transformations & Shader Rendering (70% Covered)',
    },
  ];

  // Today's schedule for TE CSD - AI
  const todaysSchedule = [
    {
      time: '09:00 – 10:00 AM',
      subject: 'Data Structures & Algorithms',
      teacher: 'Prof. Anjali Sharma',
      room: 'Room B-204',
      type: 'Theory Lecture',
      status: 'completed',
    },
    {
      time: '10:00 – 11:00 AM',
      subject: 'Computer Networks',
      teacher: 'Prof. Sunita Rao',
      room: 'Room B-204',
      type: 'Theory Lecture',
      status: 'active',
    },
    {
      time: '11:15 – 01:15 PM',
      subject: 'Artificial Intelligence & Vision Lab',
      teacher: 'Dr. Sunita Deshmukh',
      room: 'AI Lab L-102',
      type: 'Practical Lab (Batch A1 & A2)',
      status: 'upcoming',
    },
    {
      time: '02:00 – 03:00 PM',
      subject: 'Database Management Systems',
      teacher: 'Prof. Rajesh Verma',
      room: 'Room B-204',
      type: 'Theory Lecture',
      status: 'upcoming',
    },
    {
      time: '03:00 – 04:00 PM',
      subject: 'Web Technology',
      teacher: 'Prof. Rohit Nair',
      room: 'Room B-204',
      type: 'Theory Lecture',
      status: 'upcoming',
    },
  ];

  // Class Announcements
  const classAnnouncements = [
    {
      id: 'ann-1',
      title: 'AI Lab Assignment 4 Submission Deadline',
      date: 'Today, 09:30 AM',
      author: 'Prof. Anjali Sharma (Class Teacher)',
      content:
        'All students must upload their Jupyter notebook and verification reports for Assignment 4 (Heuristic Search & A* Algorithm) before Friday 5:00 PM.',
      tag: 'Academic',
    },
    {
      id: 'ann-2',
      title: 'Shortfall Attendance Warnings Dispatched',
      date: 'Yesterday, 04:15 PM',
      author: 'Prof. Anjali Sharma (Class Teacher)',
      content:
        'Official warning notices have been dispatched to parents of 5 students falling below the mandatory 75% university attendance threshold.',
      tag: 'Attendance Alert',
    },
    {
      id: 'ann-3',
      title: 'Industrial Visit: TechNova AI Research Park',
      date: 'Aug 28, 2026',
      author: 'Dr. Anjali Kulkarni (HOD CSD)',
      content:
        'Scheduled for next Tuesday. Bus boarding from Campus Gate 2 at 8:30 AM sharp. Formal dress code and college ID card mandatory.',
      tag: 'Event',
    },
  ];

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    academicStore.addNotification({
      type: 'info',
      title: `Notice to TE CSD - AI: ${noticeTitle}`,
      message: `${noticeContent} (Target: ${noticeTarget === 'all' ? 'All Students & Parents' : noticeTarget === 'defaulters' ? 'Defaulter Students (<75%)' : 'Students Roster'})`,
      timeAgo: 'Just now',
      unread: true,
    });

    showToast(`Notice "${noticeTitle}" broadcasted to TE CSD - AI successfully!`);
    setNoticeTitle('');
    setNoticeContent('');
    setIsBroadcastModalOpen(false);
  };

  const handleSendDefaulterAlerts = () => {
    defaultersList.forEach((st) => {
      academicStore.addNotification({
        type: 'alert',
        title: `Attendance Defaulter Warning: ${st.name} (${st.rollNo})`,
        message: `Current attendance is ${st.percentage}%. Minimum 75% required to be eligible for Semester VI end-term examinations.`,
        timeAgo: 'Just now',
        unread: true,
      });
    });

    showToast(`Emergency attendance notices sent to parents & portals of all ${defaultersList.length} defaulters.`);
  };

  const handleExportDefaulterPDF = () => {
    const csvContent =
      'Roll No,Student Name,Attendance Percentage,Contact,Parent Contact,Status\n' +
      defaultersList
        .map(
          (s) =>
            `${s.rollNo},"${s.name}",${s.percentage}%,${s.mobile},"${s.parentName} (${s.parentPhone})",Critical Defaulter`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TE_CSD_AI_Defaulters_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Downloaded TE CSD - AI Official Defaulters Summary (CSV/Excel).');
  };

  const handleExportFullRoster = () => {
    const csvContent =
      'Roll No,Student Name,Email,Mobile,Overall Attendance %,Status\n' +
      studentsList
        .map(
          (s) =>
            `${s.rollNo},"${s.name}",${s.email},${s.mobile},${s.percentage}%,${
              s.percentage >= 75 ? 'Eligible' : 'Defaulter'
            }`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TE_CSD_AI_Full_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported complete 30-student class roster.');
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

      {/* Class Teacher Class Banner */}
      <div className="bg-gradient-to-r from-[#F9F5FF] via-white to-[#F3EEFF] border border-[#E0D4FC] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(109,61,232,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#6D3DE8]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#6D3DE8] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">school</span>
                Class Teacher Dashboard
              </span>
              <span className="px-2.5 py-0.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] text-[12px] font-bold rounded-full">
                Division A
              </span>
              <span className="px-2.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A34A] text-[12px] font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                Semester VI (2026–27)
              </span>
            </div>

            <h1 className="font-manrope text-2xl sm:text-3xl font-extrabold text-[#17151C] tracking-tight">
              My Class: TE CSD - AI
            </h1>
            <p className="text-[14px] text-[#6B6875] mt-1 max-w-2xl">
              Third Year B.Tech • Computer Science & Design (Artificial Intelligence Specialization)
            </p>

            {/* Quick Context Chips */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-[13px] text-[#17151C]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">person</span>
                <span className="text-[#6B6875]">Class Teacher:</span>
                <strong>Prof. Anjali Sharma</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">meeting_room</span>
                <span className="text-[#6B6875]">Room:</span>
                <strong>Room B-204 (Smart Class)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">stars</span>
                <span className="text-[#6B6875]">CRs:</span>
                <strong>Aarav Joshi & Rhea Sen</strong>
              </span>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsTakeAttendanceOpen(true)}
              className="px-4 py-2.5 bg-[#6D3DE8] hover:bg-[#5416D0] text-white text-[13px] font-bold rounded-xl shadow-[0_4px_12px_rgba(109,61,232,0.25)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              Take Attendance
            </button>
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-3.5 py-2.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] hover:bg-[#F3EEFF] text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              Post Notice
            </button>
            <button
              onClick={handleExportFullRoster}
              className="px-3.5 py-2.5 bg-white border border-[#E8E4EE] text-[#17151C] hover:bg-[#FDF7FF] text-[13px] font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Download Excel / CSV Roster"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Roster
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Strength */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col justify-between hover:border-[#6D3DE8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Class Strength</span>
            <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] text-[#6D3DE8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-[#17151C]">{totalStudents}</span>
              <span className="text-[12px] text-[#16A34A] font-bold">100% Active</span>
            </div>
            <p className="text-[12px] text-[#6B6875] mt-1">18 Boys • 12 Girls enrolled</p>
          </div>
        </div>

        {/* Card 2: Average Attendance */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col justify-between hover:border-[#6D3DE8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Class Average</span>
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#16A34A] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-[#16A34A]">{classAvgAttendance}%</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]">
                Compliant
              </span>
            </div>
            <p className="text-[12px] text-[#6B6875] mt-1">University threshold: 75.0%</p>
          </div>
        </div>

        {/* Card 3: Defaulters */}
        <div className="bg-white border border-[#FECACA] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(220,38,38,0.04)] flex flex-col justify-between hover:border-[#DC2626] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#DC2626] uppercase tracking-wider">Defaulters (&lt;75%)</span>
            <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-[#DC2626]">{defaultersList.length}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                Requires Action
              </span>
            </div>
            <p className="text-[12px] text-[#DC2626] font-medium mt-1">Parents notified & scheduled</p>
          </div>
        </div>

        {/* Card 4: Sessions Logged */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col justify-between hover:border-[#6D3DE8]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Sessions Conducted</span>
            <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] text-[#6D3DE8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-[#17151C]">270</span>
              <span className="text-[12px] text-[#6D3DE8] font-bold">8 Subjects</span>
            </div>
            <p className="text-[12px] text-[#6B6875] mt-1">Theory, Lab & Tutorials synced</p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-[#E8E4EE] gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'roster'
              ? 'bg-[#6D3DE8] text-white shadow-xs'
              : 'text-[#6B6875] hover:text-[#17151C] hover:bg-[#F3EEFF]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">group</span>
          Students Roster ({totalStudents})
        </button>

        <button
          onClick={() => setActiveSubTab('subjects')}
          className={`px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'subjects'
              ? 'bg-[#6D3DE8] text-white shadow-xs'
              : 'text-[#6B6875] hover:text-[#17151C] hover:bg-[#F3EEFF]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          Curriculum & Faculty ({teSubjects.length})
        </button>

        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'timetable'
              ? 'bg-[#6D3DE8] text-white shadow-xs'
              : 'text-[#6B6875] hover:text-[#17151C] hover:bg-[#F3EEFF]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          Today's Class Schedule
        </button>

        <button
          onClick={() => setActiveSubTab('defaulters')}
          className={`px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'defaulters'
              ? 'bg-[#DC2626] text-white shadow-xs'
              : 'text-[#DC2626] hover:bg-[#FEF2F2]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">warning</span>
          Defaulters Monitoring ({defaultersList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('notices')}
          className={`px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'notices'
              ? 'bg-[#6D3DE8] text-white shadow-xs'
              : 'text-[#6B6875] hover:text-[#17151C] hover:bg-[#F3EEFF]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">campaign</span>
          Class Notices
        </button>
      </div>

      {/* TAB 1: STUDENTS ROSTER */}
      {activeSubTab === 'roster' && (
        <div className="bg-white border border-[#E8E4EE] rounded-2xl shadow-[0px_2px_8px_rgba(23,21,28,0.03)] overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E8E4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-[#17151C] text-white'
                    : 'bg-[#FDF7FF] text-[#6B6875] hover:text-[#17151C] border border-[#E8E4EE]'
                }`}
              >
                All ({totalStudents})
              </button>
              <button
                onClick={() => setStatusFilter('defaulters')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 ${
                  statusFilter === 'defaulters'
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Defaulters &lt;75% ({defaultersList.length})
              </button>
              <button
                onClick={() => setStatusFilter('borderline')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 ${
                  statusFilter === 'borderline'
                    ? 'bg-[#D97706] text-white'
                    : 'bg-amber-50 text-[#D97706] border border-amber-200'
                }`}
              >
                Borderline 75–79% ({borderlineList.length})
              </button>
              <button
                onClick={() => setStatusFilter('regular')}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1 ${
                  statusFilter === 'regular'
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]'
                }`}
              >
                Regular ≥80% ({regularList.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6875] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or roll no..."
                className="w-full pl-9 pr-3.5 py-1.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#17151C] outline-none focus:border-[#6D3DE8] focus:bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E8E4EE] text-[11px] font-bold text-[#6B6875] uppercase tracking-wider bg-[#FDF7FF]">
                  <th className="p-4 pl-6">Roll No</th>
                  <th className="p-4">Student Details</th>
                  <th className="p-4">Cumulative Attendance</th>
                  <th className="p-4">Proctoring / Compliance</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4EE] text-[13px]">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#6B6875]">
                      No students found matching current filter or search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => {
                    const isDefaulter = st.percentage < 75;
                    const isBorderline = st.percentage >= 75 && st.percentage < 80;

                    return (
                      <tr key={st.id} className="hover:bg-[#FDF7FF]/60 transition-colors">
                        <td className="p-4 pl-6 font-mono font-bold text-[#17151C]">
                          {st.rollNo}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.avatar}
                              alt={st.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#E8E4EE]"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#17151C]">{st.name}</span>
                                {st.isCR && (
                                  <span className="px-1.5 py-0.2 bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC] text-[10px] font-extrabold rounded">
                                    CR
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#6B6875]">{st.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-[#E8E4EE] rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  isDefaulter
                                    ? 'bg-[#DC2626]'
                                    : isBorderline
                                    ? 'bg-[#D97706]'
                                    : 'bg-[#16A34A]'
                                }`}
                                style={{ width: `${st.percentage}%` }}
                              />
                            </div>
                            <span
                              className={`font-mono font-bold text-[13px] ${
                                isDefaulter
                                  ? 'text-[#DC2626]'
                                  : isBorderline
                                  ? 'text-[#D97706]'
                                  : 'text-[#16A34A]'
                              }`}
                            >
                              {st.percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {isDefaulter ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                              <span className="material-symbols-outlined text-[13px]">error</span>
                              {st.proctorStatus}
                            </span>
                          ) : isBorderline ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-[#D97706] border border-amber-200">
                              <span className="material-symbols-outlined text-[13px]">warning</span>
                              Watchlist
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              Good Standing
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedStudent(st)}
                              className="px-2.5 py-1 text-[#6D3DE8] hover:bg-[#F3EEFF] rounded-lg text-[12px] font-bold border border-[#E0D4FC] transition-colors"
                            >
                              Subject Breakdown
                            </button>
                            <button
                              onClick={() =>
                                showToast(`Alert SMS & Email dispatched to ${st.name} & ${st.parentName}`)
                              }
                              className="p-1.5 text-[#6B6875] hover:text-[#17151C] hover:bg-[#F3EEFF] rounded-lg transition-colors"
                              title="Notify Parent"
                            >
                              <span className="material-symbols-outlined text-[16px]">sms</span>
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
      )}

      {/* TAB 2: SUBJECTS & CURRICULUM */}
      {activeSubTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teSubjects.map((sub, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] hover:border-[#6D3DE8]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#6D3DE8] bg-[#F3EEFF] border border-[#E0D4FC] px-2 py-0.5 rounded">
                      {sub.code} • {sub.credits} Credits
                    </span>
                    <h3 className="font-manrope text-base font-bold text-[#17151C] mt-2">
                      {sub.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[16px] font-extrabold text-[#16A34A] block">
                      {sub.avgAttendance}%
                    </span>
                    <span className="text-[10px] text-[#6B6875] font-semibold">Avg Attendance</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[13px] text-[#6B6875] mt-3 py-2 border-y border-[#E8E4EE]/60">
                  <span className="flex items-center gap-1 font-medium text-[#17151C]">
                    <span className="material-symbols-outlined text-[16px] text-[#6D3DE8]">person</span>
                    {sub.teacher}
                  </span>
                  <span>•</span>
                  <span>{sub.cabin}</span>
                  <span>•</span>
                  <span className="font-bold text-[#6D3DE8]">{sub.classesConducted} Classes</span>
                </div>

                <p className="text-[12px] text-[#6B6875] mt-2.5 flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#16A34A] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{sub.syllabus}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E4EE] flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#6B6875]">{sub.type}</span>
                <button
                  onClick={() =>
                    showToast(`Contacting ${sub.teacher} (${sub.cabin}) for subject attendance verification.`)
                  }
                  className="text-[12px] font-bold text-[#6D3DE8] hover:text-[#5416D0] flex items-center gap-1"
                >
                  Contact Faculty
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TIMETABLE FOR TE CSD - AI */}
      {activeSubTab === 'timetable' && (
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-6 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E4EE] pb-4">
            <div>
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                Today's Daily Lecture Schedule (TE CSD - AI)
              </h3>
              <p className="text-[13px] text-[#6B6875]">
                Room B-204 • Real-time timetable status with automated period tracking
              </p>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('timetable')}
                className="px-3.5 py-1.5 bg-[#F3EEFF] text-[#6D3DE8] text-[12px] font-bold rounded-xl border border-[#E0D4FC] hover:bg-[#E0D4FC] transition-colors flex items-center gap-1 w-max"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                Manage Full Timetable
              </button>
            )}
          </div>

          <div className="space-y-3">
            {todaysSchedule.map((slot, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  slot.status === 'active'
                    ? 'bg-[#F3EEFF]/80 border-[#6D3DE8] shadow-xs'
                    : 'bg-[#FDF7FF]/50 border-[#E8E4EE]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E4EE] flex items-center justify-center font-mono text-[12px] font-bold text-[#6D3DE8] shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-manrope text-base font-bold text-[#17151C]">
                        {slot.subject}
                      </h4>
                      {slot.status === 'active' && (
                        <span className="px-2 py-0.5 bg-[#6D3DE8] text-white text-[10px] font-extrabold uppercase rounded-full animate-pulse">
                          NOW
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#6B6875] mt-1">
                      <span className="font-medium text-[#17151C]">{slot.teacher}</span>
                      <span>•</span>
                      <span>{slot.room}</span>
                      <span>•</span>
                      <span className="text-[#6D3DE8] font-bold">{slot.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center self-end">
                  <span className="text-[13px] font-mono font-bold text-[#17151C] bg-white px-3 py-1 rounded-lg border border-[#E8E4EE]">
                    {slot.time}
                  </span>
                  {slot.status === 'active' && (
                    <button
                      onClick={() => setIsTakeAttendanceOpen(true)}
                      className="px-3 py-1 bg-[#6D3DE8] text-white text-[12px] font-bold rounded-lg hover:bg-[#5416D0] transition-colors"
                    >
                      Take Attendance
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DEFAULTERS MONITORING */}
      {activeSubTab === 'defaulters' && (
        <div className="space-y-4">
          <div className="bg-[#FEF2F2]/60 border border-[#FECACA] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626] shrink-0">
                <span className="material-symbols-outlined text-[28px]">warning</span>
              </div>
              <div>
                <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                  Semester VI Defaulter Intervention Panel
                </h3>
                <p className="text-[13px] text-[#6B6875]">
                  5 students are currently beneath 75% attendance. Strict university detention guidelines apply.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSendDefaulterAlerts}
                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                Notify All Defaulters & Parents
              </button>
              <button
                onClick={handleExportDefaulterPDF}
                className="px-3.5 py-2 bg-white border border-[#FECACA] text-[#DC2626] hover:bg-[#FEF2F2] text-[12px] font-bold rounded-xl transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                Export Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultersList.map((st) => (
              <div
                key={st.id}
                className="bg-white border border-[#FECACA] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(220,38,38,0.03)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#FECACA]"
                      />
                      <div>
                        <h4 className="font-manrope text-base font-bold text-[#17151C]">{st.name}</h4>
                        <p className="text-[12px] text-[#6B6875]">Roll No: {st.rollNo} • TE CSD - AI</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-[#DC2626]">{st.percentage}%</span>
                      <span className="text-[10px] font-bold text-[#DC2626] block">SHORTFALL</span>
                    </div>
                  </div>

                  <div className="bg-[#FEF2F2]/40 rounded-xl p-3 border border-[#FECACA]/60 space-y-1.5 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-[#6B6875]">Guardian:</span>
                      <strong className="text-[#17151C]">{st.parentName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6875]">Parent Phone:</span>
                      <strong className="text-[#17151C] font-mono">{st.parentPhone}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B6875]">Current Action:</span>
                      <span className="font-bold text-[#DC2626]">{st.proctorStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E4EE] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedStudent(st)}
                    className="text-[12px] font-bold text-[#6D3DE8] hover:text-[#5416D0]"
                  >
                    View All Subject Deficits
                  </button>
                  <button
                    onClick={() =>
                      showToast(`Parent meeting alert message dispatched for ${st.name}.`)
                    }
                    className="px-3 py-1.5 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg text-[11px] font-bold transition-colors"
                  >
                    Send Warning Letter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CLASS ANNOUNCEMENTS */}
      {activeSubTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white border border-[#E8E4EE] rounded-2xl p-4">
            <div>
              <h3 className="font-manrope text-base font-bold text-[#17151C]">
                Class Announcements Board
              </h3>
              <p className="text-[12px] text-[#6B6875]">
                Direct notices published to TE CSD - AI students and registered parents
              </p>
            </div>
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-4 py-2 bg-[#6D3DE8] text-white text-[12px] font-bold rounded-xl shadow-xs hover:bg-[#5416D0] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Publish Notice
            </button>
          </div>

          <div className="space-y-3">
            {classAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC] text-[11px] font-bold rounded-full">
                      {ann.tag}
                    </span>
                    <h4 className="font-manrope text-base font-bold text-[#17151C]">{ann.title}</h4>
                  </div>
                  <span className="text-[12px] text-[#6B6875]">{ann.date}</span>
                </div>
                <p className="text-[13px] text-[#6B6875] leading-relaxed">{ann.content}</p>
                <div className="mt-3 pt-3 border-t border-[#E8E4EE] flex items-center justify-between text-[12px] text-[#6B6875]">
                  <span>Issued by: <strong>{ann.author}</strong></span>
                  <span className="text-[#16A34A] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    Delivered to 30 Students
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENT DETAIL & SUBJECT BREAKDOWN MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#E8E4EE] pb-4 mb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#E8E4EE]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-manrope text-xl font-bold text-[#17151C]">
                      {selectedStudent.name}
                    </h3>
                    {selectedStudent.isCR && (
                      <span className="px-2 py-0.5 bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC] text-[10px] font-bold rounded">
                        Class Representative
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#6B6875]">
                    Roll No: {selectedStudent.rollNo} • TE CSD - AI • {selectedStudent.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Overall Attendance Summary */}
            <div className="bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl p-4 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider block">
                  Cumulative Attendance
                </span>
                <span
                  className={`text-2xl font-manrope font-extrabold ${
                    selectedStudent.percentage >= 75 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                  }`}
                >
                  {selectedStudent.percentage}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-[#6B6875] block">Parent / Guardian</span>
                <span className="text-[13px] font-bold text-[#17151C]">
                  {selectedStudent.parentName}
                </span>
                <span className="text-[12px] text-[#6B6875] block font-mono">
                  {selectedStudent.parentPhone}
                </span>
              </div>
            </div>

            {/* Subject Breakdown List */}
            <h4 className="font-manrope text-sm font-bold text-[#17151C] mb-3">
              Semester VI: 8-Subject Attendance Performance
            </h4>

            <div className="space-y-2.5">
              {teSubjects.map((sub, i) => {
                const subData = selectedStudent.subjectAttendance
                  ? selectedStudent.subjectAttendance[sub.name]
                  : null;

                const attended = subData ? subData.attended : Math.round((sub.classesConducted * selectedStudent.percentage) / 100);
                const total = subData ? subData.total : sub.classesConducted;
                const percent = subData ? subData.percent : Math.round((attended / total) * 100);
                const isShortfall = percent < 75;

                return (
                  <div
                    key={i}
                    className="p-3 bg-white border border-[#E8E4EE] rounded-xl flex items-center justify-between gap-3 hover:bg-[#FDF7FF] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[13px] text-[#17151C] truncate">
                          {sub.name}
                        </span>
                        <span
                          className={`font-mono text-[12px] font-bold ${
                            isShortfall ? 'text-[#DC2626]' : 'text-[#16A34A]'
                          }`}
                        >
                          {percent}% ({attended}/{total} Sessions)
                        </span>
                      </div>
                      <div className="w-full bg-[#E8E4EE] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            isShortfall ? 'bg-[#DC2626]' : 'bg-[#16A34A]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E4EE] flex justify-end gap-2">
              <button
                onClick={() => {
                  showToast(`Notice letter dispatched to guardian of ${selectedStudent.name}.`);
                  setSelectedStudent(null);
                }}
                className="px-4 py-2 border border-[#E0D4FC] text-[#6D3DE8] hover:bg-[#F3EEFF] rounded-xl text-[13px] font-bold transition-colors"
              >
                Send Parent SMS Notice
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 bg-[#17151C] text-white rounded-xl text-[13px] font-bold hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST NOTICE MODAL */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#E8E4EE] pb-3 mb-4">
              <div>
                <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                  Broadcast Notice to TE CSD - AI
                </h3>
                <p className="text-[12px] text-[#6B6875]">Published from Class Teacher Desk</p>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Notice Headline / Subject
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Journal Verification Schedule"
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Recipient Group
                </label>
                <select
                  value={noticeTarget}
                  onChange={(e) => setNoticeTarget(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none focus:border-[#6D3DE8]"
                >
                  <option value="all">All 30 Students & Parents (Broadcast)</option>
                  <option value="defaulters">Defaulters Only (&lt;75% Attendance)</option>
                  <option value="students">Students Portal Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Detailed Notice Text
                </label>
                <textarea
                  required
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Enter the official notice instructions..."
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4EE]">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] rounded-xl text-[13px] font-semibold hover:bg-[#F3EEFF]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAKE ATTENDANCE MODAL */}
      <TakeAttendanceModal
        isOpen={isTakeAttendanceOpen}
        onClose={() => setIsTakeAttendanceOpen(false)}
        students={rawRoster}
        subject="Data Structures & Algorithms"
        className="TE CSD - AI"
        room="Room B-204"
        time="10:00 – 11:00 AM"
        onSubmit={(updated) => {
          academicStore.recordAttendance({
            subject: 'Data Structures & Algorithms',
            classId: 'class-csd-te-a',
            className: 'TE CSD - AI',
            room: 'Room B-204',
            time: '10:00 AM',
            teacherName: 'Prof. Anjali Sharma',
            updatedRoster: updated,
          });
          setIsTakeAttendanceOpen(false);
          showToast('Attendance recorded and updated for TE CSD - AI.');
        }}
      />
    </div>
  );
};
