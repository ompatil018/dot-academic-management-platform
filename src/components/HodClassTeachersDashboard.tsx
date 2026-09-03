import React, { useState, useEffect, useMemo } from 'react';
import { academicStore } from '../data/academicStore';
import { CollegeClass, TeacherProfile, StudentAttendanceEntry } from '../types';

interface HodClassTeachersDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

interface ClassTeacherDetail {
  classId: string;
  className: string;
  year: 'FE' | 'SE' | 'TE' | 'BE';
  division: string;
  room: string;
  totalStudents: number;
  attendanceRate: number;
  defaultersCount: number; // < 75%
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  teacherMobile: string;
  teacherDesignation: string;
  avatar: string;
  crName: string;
  lrName: string;
  mentorLogsStatus: 'Completed' | 'Pending 2 Reviews' | 'On Track';
  lastPtmDate: string;
  syllabusProgress: number; // percentage
}

export const HodClassTeachersDashboard: React.FC<HodClassTeachersDashboardProps> = ({
  onNavigateTab,
}) => {
  const [storeState, setStoreState] = useState(academicStore.getState());
  const [selectedYear, setSelectedYear] = useState<'ALL' | 'FE' | 'SE' | 'TE' | 'BE'>('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'HEALTHY' | 'DEFICIT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [selectedClassForDossier, setSelectedClassForDossier] = useState<ClassTeacherDetail | null>(null);
  const [reassignClass, setReassignClass] = useState<ClassTeacherDetail | null>(null);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

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

  // Pre-configured rich class teacher dataset mapped to CSD classes
  const classTeachersData: ClassTeacherDetail[] = useMemo(() => {
    const csdClasses = storeState.classes.filter((c) => c.courseId === 'course-csd');

    const metaMap: Record<string, Partial<ClassTeacherDetail>> = {
      'class-csd-fe-a': {
        year: 'FE',
        division: 'A',
        room: 'Room B-201',
        totalStudents: 39,
        attendanceRate: 88.4,
        defaultersCount: 2,
        teacherDesignation: 'Assistant Professor',
        teacherEmail: 'vikram.mehta@technova.edu',
        teacherMobile: '+91 98111 22334',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        crName: 'Aditya Deshpande',
        lrName: 'Tanvi Joshi',
        mentorLogsStatus: 'Completed',
        lastPtmDate: 'Feb 14, 2027',
        syllabusProgress: 82,
      },
      'class-csd-fe-b': {
        year: 'FE',
        division: 'B',
        room: 'Room B-202',
        totalStudents: 40,
        attendanceRate: 84.5,
        defaultersCount: 4,
        teacherDesignation: 'Assistant Professor',
        teacherEmail: 'sunita.rao@technova.edu',
        teacherMobile: '+91 98222 33445',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        crName: 'Sahil Kulkarni',
        lrName: 'Shreya Patil',
        mentorLogsStatus: 'On Track',
        lastPtmDate: 'Feb 16, 2027',
        syllabusProgress: 79,
      },
      'class-csd-se-a': {
        year: 'SE',
        division: 'A',
        room: 'Room B-203',
        totalStudents: 40,
        attendanceRate: 87.1,
        defaultersCount: 3,
        teacherDesignation: 'Associate Professor',
        teacherEmail: 'priya.nair@technova.edu',
        teacherMobile: '+91 98333 44556',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        crName: 'Varun Sharma',
        lrName: 'Ananya Iyer',
        mentorLogsStatus: 'Completed',
        lastPtmDate: 'Feb 20, 2027',
        syllabusProgress: 80,
      },
      'class-csd-se-b': {
        year: 'SE',
        division: 'B',
        room: 'Room B-205',
        totalStudents: 39,
        attendanceRate: 82.8,
        defaultersCount: 5,
        teacherDesignation: 'Assistant Professor',
        teacherEmail: 'rohan.kadam@technova.edu',
        teacherMobile: '+91 98444 55667',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        crName: 'Devendra Shinde',
        lrName: 'Riya Gaikwad',
        mentorLogsStatus: 'Pending 2 Reviews',
        lastPtmDate: 'Feb 18, 2027',
        syllabusProgress: 74,
      },
      'class-csd-te-a': {
        year: 'TE',
        division: 'A',
        room: 'Room B-204',
        totalStudents: 40,
        attendanceRate: 88.2,
        defaultersCount: 2,
        teacherDesignation: 'Associate Professor & Class Teacher',
        teacherEmail: 'anjali.sharma@technova.edu',
        teacherMobile: '+91 98003 33444',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        crName: 'Aarav Joshi',
        lrName: 'Meera Patel',
        mentorLogsStatus: 'Completed',
        lastPtmDate: 'Feb 22, 2027',
        syllabusProgress: 84,
      },
      'class-csd-te-b': {
        year: 'TE',
        division: 'B',
        room: 'Room B-206',
        totalStudents: 40,
        attendanceRate: 85.0,
        defaultersCount: 3,
        teacherDesignation: 'Assistant Professor',
        teacherEmail: 'rajesh.verma@technova.edu',
        teacherMobile: '+91 98004 44555',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        crName: 'Pranav Mahajan',
        lrName: 'Kavita Naik',
        mentorLogsStatus: 'On Track',
        lastPtmDate: 'Feb 21, 2027',
        syllabusProgress: 81,
      },
      'class-csd-be-a': {
        year: 'BE',
        division: 'A',
        room: 'Room C-301',
        totalStudents: 40,
        attendanceRate: 89.6,
        defaultersCount: 1,
        teacherDesignation: 'Head of Department & Professor',
        teacherEmail: 'anjali.kulkarni@technova.edu',
        teacherMobile: '+91 98002 22333',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        crName: 'Siddharth Roy',
        lrName: 'Sneha Bhosale',
        mentorLogsStatus: 'Completed',
        lastPtmDate: 'Feb 25, 2027',
        syllabusProgress: 88,
      },
      'class-csd-be-b': {
        year: 'BE',
        division: 'B',
        room: 'Room C-302',
        totalStudents: 40,
        attendanceRate: 83.9,
        defaultersCount: 4,
        teacherDesignation: 'Assistant Professor',
        teacherEmail: 'manoj.shinde@technova.edu',
        teacherMobile: '+91 98666 77889',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        crName: 'Gaurav Kute',
        lrName: 'Pooja Jadhav',
        mentorLogsStatus: 'On Track',
        lastPtmDate: 'Feb 24, 2027',
        syllabusProgress: 76,
      },
    };

    return csdClasses.map((cls) => {
      const meta = metaMap[cls.id] || {};
      return {
        classId: cls.id,
        className: cls.name,
        year: meta.year || (cls.name.includes('FE') ? 'FE' : cls.name.includes('SE') ? 'SE' : cls.name.includes('TE') ? 'TE' : 'BE'),
        division: meta.division || cls.division || 'A',
        room: meta.room || cls.roomDefault || 'Room B-204',
        totalStudents: cls.totalStudents || meta.totalStudents || 40,
        attendanceRate: meta.attendanceRate || 85.5,
        defaultersCount: meta.defaultersCount || 2,
        teacherId: cls.classTeacherId || 'teacher-csd-5',
        teacherName: cls.classTeacherName || 'Faculty Member',
        teacherEmail: meta.teacherEmail || 'faculty@technova.edu',
        teacherMobile: meta.teacherMobile || '+91 98000 00000',
        teacherDesignation: meta.teacherDesignation || 'Assistant Professor',
        avatar: meta.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        crName: meta.crName || 'Class Representative',
        lrName: meta.lrName || 'Ladies Representative',
        mentorLogsStatus: meta.mentorLogsStatus || 'Completed',
        lastPtmDate: meta.lastPtmDate || 'Feb 20, 2027',
        syllabusProgress: meta.syllabusProgress || 80,
      };
    });
  }, [storeState.classes]);

  // Filtered List
  const filteredTeachers = useMemo(() => {
    return classTeachersData.filter((item) => {
      // Year filter
      if (selectedYear !== 'ALL' && item.year !== selectedYear) return false;

      // Attendance filter
      if (attendanceFilter === 'HEALTHY' && item.attendanceRate < 85) return false;
      if (attendanceFilter === 'DEFICIT' && item.attendanceRate >= 85) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.className.toLowerCase().includes(q) ||
          item.teacherName.toLowerCase().includes(q) ||
          item.room.toLowerCase().includes(q) ||
          item.crName.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [classTeachersData, selectedYear, attendanceFilter, searchQuery]);

  // Aggregate Stats
  const totalClassesCount = classTeachersData.length;
  const totalStudentsSupervised = classTeachersData.reduce((acc, c) => acc + c.totalStudents, 0);
  const avgDeptAttendance = (
    classTeachersData.reduce((acc, c) => acc + c.attendanceRate, 0) / (totalClassesCount || 1)
  ).toFixed(1);
  const totalDefaultersCount = classTeachersData.reduce((acc, c) => acc + c.defaultersCount, 0);

  // Available Faculty for Reassignment
  const availableFaculty = [
    { name: 'Prof. Anjali Sharma', designation: 'Associate Professor', currentClass: 'TE CSD-A' },
    { name: 'Prof. Rajesh Verma', designation: 'Assistant Professor', currentClass: 'TE CSD-B' },
    { name: 'Prof. Vikram Mehta', designation: 'Assistant Professor', currentClass: 'FE CSD-A' },
    { name: 'Prof. Sunita Rao', designation: 'Assistant Professor', currentClass: 'FE CSD-B' },
    { name: 'Prof. Priya Nair', designation: 'Associate Professor', currentClass: 'SE CSD-A' },
    { name: 'Prof. Rohan Kadam', designation: 'Assistant Professor', currentClass: 'SE CSD-B' },
    { name: 'Prof. Manoj Shinde', designation: 'Assistant Professor', currentClass: 'BE CSD-B' },
    { name: 'Dr. Anjali Kulkarni', designation: 'Professor & HOD', currentClass: 'BE CSD-A' },
    { name: 'Prof. Sandeep Patil', designation: 'Assistant Professor', currentClass: 'None (Unassigned)' },
    { name: 'Dr. Swati Deshpande', designation: 'Associate Professor', currentClass: 'None (Unassigned)' },
  ];

  const handleConfirmReassignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignClass || !newTeacherName) return;

    academicStore.updateClassTeacher(reassignClass.classId, newTeacherName);
    showToast(`Successfully appointed ${newTeacherName} as Class Teacher for ${reassignClass.className}.`);
    setReassignClass(null);
    setNewTeacherName('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastBody.trim()) return;

    academicStore.addNotification({
      type: 'alert',
      title: `HOD Directive: ${broadcastSubject}`,
      message: `From Dr. Anjali Kulkarni (HOD) to all 8 CSD Class Teachers: "${broadcastBody}"`,
      timeAgo: 'Just now',
      unread: true,
    });

    showToast('Official HOD Advisory transmitted to all 8 Class Coordinators.');
    setIsBroadcastModalOpen(false);
    setBroadcastSubject('');
    setBroadcastBody('');
  };

  const handleExportCsv = () => {
    const headers = [
      'Class Name',
      'Year',
      'Division',
      'Classroom',
      'Class Teacher',
      'Designation',
      'Email',
      'Mobile',
      'Enrolled Students',
      'Attendance %',
      'Defaulters (<75%)',
      'CR Name',
      'LR Name',
      'Syllabus %',
      'Last PTM',
    ];

    const rows = filteredTeachers.map((t) => [
      t.className,
      t.year,
      t.division,
      t.room,
      t.teacherName,
      t.teacherDesignation,
      t.teacherEmail,
      t.teacherMobile,
      t.totalStudents,
      `${t.attendanceRate}%`,
      t.defaultersCount,
      t.crName,
      t.lrName,
      `${t.syllabusProgress}%`,
      t.lastPtmDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HOD_Class_Teachers_Report_CSD_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Class Coordinator audit dossier exported to CSV.');
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

      {/* HEADER SECTION: HOD CLASS TEACHER GOVERNANCE */}
      <div className="bg-gradient-to-r from-[#F9F5FF] via-white to-[#F3EEFF] border border-[#E0D4FC] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(109,61,232,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#6D3DE8]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#6D3DE8] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">supervisor_account</span>
                HOD Academic Governance
              </span>
              <span className="px-2.5 py-0.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] text-[12px] font-bold rounded-full">
                Dept of Computer Science &amp; Design
              </span>
              <span className="px-2.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A34A] text-[12px] font-bold rounded-full">
                AY 2026–2027 • Term-II
              </span>
            </div>

            <h1 className="font-manrope text-2xl sm:text-3xl font-extrabold text-[#17151C] tracking-tight">
              Class Teachers Management &amp; Division Mentorship
            </h1>
            <p className="text-[14px] text-[#6B6875] mt-1 max-w-2xl">
              Central supervisory console for class coordinators, division attendance health, student mentorship compliance, and parent communication audits.
            </p>

            {/* Quick Context Summary */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[13px]">
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">school</span>
                <span className="text-[#6B6875]">Assigned Coordinators:</span>
                <strong>{totalClassesCount} of {totalClassesCount} Divisions</strong>
              </span>
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#16A34A]">group</span>
                <span className="text-[#6B6875]">Total Supervised:</span>
                <strong>{totalStudentsSupervised} Students</strong>
              </span>
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">trending_up</span>
                <span className="text-[#6B6875]">CSD Dept Attendance:</span>
                <strong className="text-[#16A34A]">{avgDeptAttendance}%</strong>
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-4 py-2.5 bg-[#6D3DE8] hover:bg-[#5416D0] text-white text-[13px] font-bold rounded-xl shadow-[0_4px_12px_rgba(109,61,232,0.25)] flex items-center gap-1.5 transition-all cursor-pointer font-manrope"
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              Broadcast Advisory
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] hover:bg-[#F3EEFF] text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Register
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('academic-year')}
              className="px-3.5 py-2.5 bg-[#FDF7FF] border border-[#E8E4EE] text-[#17151C] hover:bg-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">date_range</span>
              AY 26–27 Calendar
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F3EEFF] border border-[#E0D4FC] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#6D3DE8] text-[26px]">manage_accounts</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6875] block">
              Class Teachers Appointed
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#17151C]">{totalClassesCount} / {totalClassesCount}</span>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                100% Filled
              </span>
            </div>
            <span className="text-[12px] text-[#6B6875] mt-0.5 block">All 8 divisions supervised</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#16A34A] text-[26px]">verified</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6875] block">
              Average Attendance
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#16A34A]">{avgDeptAttendance}%</span>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                +1.8% vs Term-I
              </span>
            </div>
            <span className="text-[12px] text-[#6B6875] mt-0.5 block">Threshold: 75% statutory</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#DC2626] text-[26px]">warning</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6875] block">
              Defaulter Students (&lt;75%)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#DC2626]">{totalDefaultersCount}</span>
              <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] px-1.5 py-0.5 rounded">
                Across 8 Classes
              </span>
            </div>
            <span className="text-[12px] text-[#6B6875] mt-0.5 block">Parent SMS notices active</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FDF7FF] border border-[#E8E4EE] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#6D3DE8] text-[26px]">assignment_turned_in</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6875] block">
              Mentorship Compliance
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#17151C]">96.8%</span>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                NBA Audit Ready
              </span>
            </div>
            <span className="text-[12px] text-[#6B6875] mt-0.5 block">Fortnightly log completion</span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS & SEARCH BAR */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl p-4 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Year Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] font-bold text-[#6B6875] mr-2">Filter Year:</span>
          {(['ALL', 'FE', 'SE', 'TE', 'BE'] as const).map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                selectedYear === yr
                  ? 'bg-[#6D3DE8] text-white shadow-xs'
                  : 'bg-[#FDF7FF] text-[#6B6875] hover:bg-[#F3EEFF] hover:text-[#6D3DE8]'
              }`}
            >
              {yr === 'ALL' ? 'All Classes (8)' : `${yr} Year`}
            </button>
          ))}
        </div>

        {/* Attendance & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value as any)}
            className="px-3 py-1.5 text-[12px] font-bold bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#17151C] outline-none focus:border-[#6D3DE8]"
          >
            <option value="ALL">All Attendance Status</option>
            <option value="HEALTHY">Compliant (≥85%)</option>
            <option value="DEFICIT">Needs Attention (&lt;85%)</option>
          </select>

          <div className="relative min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-2 text-[#6B6875] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teacher, class, room..."
              className="w-full pl-9 pr-3 py-1.5 text-[12px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
            />
          </div>
        </div>
      </div>

      {/* CLASS TEACHERS DIRECTORY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredTeachers.map((item) => {
          const isDeficit = item.attendanceRate < 85;

          return (
            <div
              key={item.classId}
              className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Header: Class Badge & Year */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC] text-[12px] font-extrabold rounded-lg">
                    {item.className}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#6B6875] bg-[#FDF7FF] px-2 py-0.5 rounded border border-[#E8E4EE]">
                    {item.room}
                  </span>
                </div>

                {/* Teacher Profile Card */}
                <div className="flex items-center gap-3 p-3 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE] mb-4">
                  <img
                    src={item.avatar}
                    alt={item.teacherName}
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-white shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[14px] text-[#17151C] truncate" title={item.teacherName}>
                      {item.teacherName}
                    </h4>
                    <p className="text-[11px] text-[#6B6875] truncate">
                      {item.teacherDesignation}
                    </p>
                    <span className="text-[10px] font-mono text-[#6D3DE8] block truncate">
                      {item.teacherEmail}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="space-y-2.5 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6875]">Class Strength:</span>
                    <strong className="text-[#17151C]">{item.totalStudents} Enrolled</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6875]">Avg Attendance:</span>
                    <span
                      className={`font-extrabold ${
                        isDeficit ? 'text-[#DC2626]' : 'text-[#16A34A]'
                      }`}
                    >
                      {item.attendanceRate}%
                    </span>
                  </div>

                  {/* Attendance Progress bar */}
                  <div className="w-full bg-[#E8E4EE] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        isDeficit ? 'bg-[#DC2626]' : 'bg-[#16A34A]'
                      }`}
                      style={{ width: `${item.attendanceRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#6B6875]">Defaulters (&lt;75%):</span>
                    <span className="font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                      {item.defaultersCount} Students
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6875]">Syllabus Covered:</span>
                    <strong className="text-[#17151C]">{item.syllabusProgress}%</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6875]">Class CR:</span>
                    <span className="font-medium text-[#17151C] truncate max-w-[110px]">{item.crName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6B6875]">Mentorship Log:</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        item.mentorLogsStatus === 'Completed'
                          ? 'bg-[#ECFDF5] text-[#16A34A]'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.mentorLogsStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#E8E4EE] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedClassForDossier(item)}
                  className="flex-1 py-1.5 px-2 bg-[#F3EEFF] hover:bg-[#E0D4FC] text-[#6D3DE8] font-bold text-[11px] rounded-lg border border-[#E0D4FC] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                  Dossier
                </button>

                <button
                  onClick={() => {
                    setReassignClass(item);
                    setNewTeacherName(item.teacherName);
                  }}
                  className="py-1.5 px-2 bg-white hover:bg-[#FDF7FF] text-[#17151C] border border-[#E8E4EE] font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Reassign Class Teacher"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#6D3DE8]">swap_horiz</span>
                  Reassign
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: VIEW DIVISION DOSSIER MODAL */}
      {selectedClassForDossier && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E8E4EE] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#6D3DE8] text-white text-[11px] font-extrabold uppercase rounded-full">
                    {selectedClassForDossier.className} Division Dossier
                  </span>
                  <span className="text-[12px] font-mono text-[#6B6875]">
                    {selectedClassForDossier.room}
                  </span>
                </div>
                <h3 className="font-manrope text-2xl font-bold text-[#17151C] mt-1">
                  Class Coordinator: {selectedClassForDossier.teacherName}
                </h3>
                <p className="text-[13px] text-[#6B6875]">
                  {selectedClassForDossier.teacherDesignation} • {selectedClassForDossier.teacherEmail}
                </p>
              </div>

              <button
                onClick={() => setSelectedClassForDossier(null)}
                className="p-1.5 text-[#6B6875] hover:text-[#17151C] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 my-5">
              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-center">
                  <span className="text-[10px] font-extrabold text-[#16A34A] uppercase block">
                    Division Attendance
                  </span>
                  <span className="text-2xl font-extrabold text-[#16A34A]">
                    {selectedClassForDossier.attendanceRate}%
                  </span>
                  <span className="text-[11px] text-[#16A34A] block">Statutory Compliant</span>
                </div>

                <div className="p-3 bg-white border border-[#E8E4EE] rounded-xl text-center shadow-2xs">
                  <span className="text-[10px] font-extrabold text-[#6B6875] uppercase block">
                    Enrolled Strength
                  </span>
                  <span className="text-2xl font-extrabold text-[#17151C]">
                    {selectedClassForDossier.totalStudents}
                  </span>
                  <span className="text-[11px] text-[#6B6875] block">Regular B.Tech</span>
                </div>

                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-center">
                  <span className="text-[10px] font-extrabold text-[#DC2626] uppercase block">
                    Defaulters List
                  </span>
                  <span className="text-2xl font-extrabold text-[#DC2626]">
                    {selectedClassForDossier.defaultersCount}
                  </span>
                  <span className="text-[11px] text-[#DC2626] block">Need Counseling</span>
                </div>
              </div>

              {/* Student Representatives & Mentorship */}
              <div className="p-4 bg-[#FDF7FF] rounded-2xl border border-[#E8E4EE] space-y-3">
                <h4 className="text-[12px] font-extrabold text-[#17151C] uppercase tracking-wider">
                  Division Representatives &amp; Contact Matrix
                </h4>
                <div className="grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <span className="text-[#6B6875] block text-[11px]">Class Representative (CR):</span>
                    <strong className="text-[#17151C]">{selectedClassForDossier.crName}</strong>
                    <span className="text-[11px] text-[#6D3DE8] block">+91 98005 55666</span>
                  </div>
                  <div>
                    <span className="text-[#6B6875] block text-[11px]">Ladies Representative (LR):</span>
                    <strong className="text-[#17151C]">{selectedClassForDossier.lrName}</strong>
                    <span className="text-[11px] text-[#6D3DE8] block">+91 98007 77888</span>
                  </div>
                  <div>
                    <span className="text-[#6B6875] block text-[11px]">Last Parent-Teacher Meeting:</span>
                    <strong className="text-[#17151C]">{selectedClassForDossier.lastPtmDate}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B6875] block text-[11px]">Mentor-Mentee Log Audit:</span>
                    <strong className="text-[#16A34A]">{selectedClassForDossier.mentorLogsStatus}</strong>
                  </div>
                </div>
              </div>

              {/* HOD Recommendations / Action Notes */}
              <div className="p-4 bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] text-[12px] text-[#16A34A] flex items-start gap-3">
                <span className="material-symbols-outlined text-[22px] shrink-0">verified</span>
                <div>
                  <strong>HOD Department Endorsement:</strong> Class records verified for Mid-Term Academic Review. Next fortnightly defaulter list dispatch scheduled for April 05, 2027.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4EE]">
              <button
                onClick={() => setSelectedClassForDossier(null)}
                className="px-4 py-2 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[12px] font-bold text-[#17151C]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedClassForDossier(null);
                  onNavigateTab && onNavigateTab('lecture-history');
                }}
                className="px-4 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">history_edu</span>
                View Daily Lecture Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REASSIGN CLASS TEACHER MODAL */}
      {reassignClass && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#E8E4EE] pb-3">
              <div>
                <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                  Reassign Class Teacher
                </h3>
                <p className="text-[12px] text-[#6B6875]">
                  Select new coordinator for <strong>{reassignClass.className}</strong>
                </p>
              </div>
              <button
                onClick={() => setReassignClass(null)}
                className="p-1.5 text-[#6B6875] hover:text-[#17151C] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmReassignment} className="space-y-4 mt-4">
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Target Class &amp; Division
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${reassignClass.className} (${reassignClass.room})`}
                  className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#6B6875]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Current Appointed Teacher
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${reassignClass.teacherName} (${reassignClass.teacherDesignation})`}
                  className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#6B6875]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Select New Class Coordinator *
                </label>
                <select
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  required
                  className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#17151C] outline-none focus:border-[#6D3DE8]"
                >
                  <option value="">-- Choose Faculty Member --</option>
                  {availableFaculty.map((f, i) => (
                    <option key={i} value={f.name}>
                      {f.name} — {f.designation} ({f.currentClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-[12px] text-[#16A34A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Updates university master timetable and notifies student division.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignClass(null)}
                  className="px-4 py-2 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[12px] font-bold text-[#17151C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BROADCAST ADVISORY TO CLASS TEACHERS */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#E8E4EE] pb-3">
              <div>
                <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                  Transmit HOD Advisory to Class Teachers
                </h3>
                <p className="text-[12px] text-[#6B6875]">
                  Official department circular delivered to all 8 CSD division coordinators
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
                  Circular Subject *
                </label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. Mandatory Submission of Mid-Term Defaulter Lists by Friday"
                  required
                  className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Directive Instructions / Details *
                </label>
                <textarea
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  rows={4}
                  placeholder="Please review all students below 75% attendance and schedule parent phone calls before March 15..."
                  required
                  className="w-full p-3 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                />
              </div>

              <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-[12px] text-[#16A34A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Logged in departmental notice register with timestamp and read receipts.
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
                  Send Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
