import React, { useState, useEffect, useMemo } from 'react';
import { academicStore } from '../data/academicStore';

interface HodAcademicYearDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

interface AcademicMilestone {
  id: string;
  title: string;
  category: 'Academics' | 'Exams' | 'Accreditation' | 'Events' | 'Review';
  dateRange: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  coordinator: string;
  description: string;
  completionPercent: number;
}

interface HolidayItem {
  date: string;
  day: string;
  occasion: string;
  type: 'Gazetted Holiday' | 'Term Break' | 'Exam Window';
}

export const HodAcademicYearDashboard: React.FC<HodAcademicYearDashboardProps> = ({
  onNavigateTab,
}) => {
  const [storeState, setStoreState] = useState(academicStore.getState());
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Academics' | 'Exams' | 'Accreditation' | 'Events' | 'Review'>('Academics');
  const [newDateRange, setNewDateRange] = useState('');
  const [newCoordinator, setNewCoordinator] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Sign-off modal
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [signOffDone, setSignOffDone] = useState(false);

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

  // Initial milestones for AY 2026-2027 Term-II
  const [milestones, setMilestones] = useState<AcademicMilestone[]>([
    {
      id: 'm-1',
      title: 'Term Commencement & Faculty Academic Orientation',
      category: 'Academics',
      dateRange: 'Jan 05, 2027',
      status: 'Completed',
      coordinator: 'Dr. Anjali Kulkarni (HOD)',
      description: 'Department faculty meeting, syllabus distribution, classroom and lab allocations finalized.',
      completionPercent: 100,
    },
    {
      id: 'm-2',
      title: 'Course Information Sheets (CIS) & Lesson Plan Finalization',
      category: 'Academics',
      dateRange: 'Jan 05 – Jan 12, 2027',
      status: 'Completed',
      coordinator: 'Prof. Priya Nair',
      description: 'Upload of Course Outcomes (CO) mapping, Bloom taxonomy rubrics, and reference materials.',
      completionPercent: 100,
    },
    {
      id: 'm-3',
      title: 'First Attendance Review & Defaulter Notice Generation',
      category: 'Review',
      dateRange: 'Feb 15, 2027',
      status: 'Completed',
      coordinator: 'Prof. Anjali Sharma',
      description: 'Attendance reconciliation for all 8 CSD divisions; counseling initiated for students <75%.',
      completionPercent: 100,
    },
    {
      id: 'm-4',
      title: 'In-Semester Examination 1 (ISE-1 / Unit Test 1)',
      category: 'Exams',
      dateRange: 'Mar 02 – Mar 06, 2027',
      status: 'Completed',
      coordinator: 'Prof. Rajesh Verma',
      description: 'Mid-term written assessment for 25 marks across all 32 subjects; 100% paper evaluation completed.',
      completionPercent: 100,
    },
    {
      id: 'm-5',
      title: 'Mid-Term Student Feedback & Teaching Quality Audit',
      category: 'Accreditation',
      dateRange: 'Mar 10, 2027',
      status: 'Completed',
      coordinator: 'Dr. Swati Deshpande',
      description: 'Online student feedback collected: Department aggregate score 4.4 / 5.0 (Exceeds NAAC benchmark).',
      completionPercent: 100,
    },
    {
      id: 'm-6',
      title: 'Remedial Classes & Doubt Clearing Sessions',
      category: 'Academics',
      dateRange: 'Apr 01 – Apr 05, 2027',
      status: 'In Progress',
      coordinator: 'Prof. Vikram Mehta',
      description: 'Special coaching for slow learners in Data Structures, Theory of Computation, and AI Algorithms.',
      completionPercent: 65,
    },
    {
      id: 'm-7',
      title: 'National Conference on AI & Design Trends (TechVision 2027)',
      category: 'Events',
      dateRange: 'Apr 08 – Apr 09, 2027',
      status: 'Upcoming',
      coordinator: 'Dr. Anjali Kulkarni & Prof. Rohan Kadam',
      description: 'CSD flagship event with 120 research papers, industry keynote speakers, and project showcase.',
      completionPercent: 40,
    },
    {
      id: 'm-8',
      title: 'In-Semester Examination 2 (ISE-2 / Unit Test 2)',
      category: 'Exams',
      dateRange: 'Apr 14 – Apr 18, 2027',
      status: 'Upcoming',
      coordinator: 'Prof. Manoj Shinde',
      description: 'Second internal assessment covering Units 4, 5, and 6.',
      completionPercent: 10,
    },
    {
      id: 'm-9',
      title: 'Final Term Work Submission & Mock Practical Viva',
      category: 'Exams',
      dateRange: 'Apr 20 – Apr 25, 2027',
      status: 'Upcoming',
      coordinator: 'Prof. Sunita Rao',
      description: 'Verification of continuous lab evaluation journals, project phase-II reports, and code repositories.',
      completionPercent: 0,
    },
    {
      id: 'm-10',
      title: 'Conclusion of Teaching & Term End (Last Day of Instructions)',
      category: 'Academics',
      dateRange: 'Apr 30, 2027',
      status: 'Upcoming',
      coordinator: 'Dr. Anjali Kulkarni (HOD)',
      description: 'Formal sign-off of academic attendance registers, hall ticket clearances, and detention notices.',
      completionPercent: 0,
    },
    {
      id: 'm-11',
      title: 'University End-Semester Theory Examinations (ESE)',
      category: 'Exams',
      dateRange: 'May 10 – May 28, 2027',
      status: 'Upcoming',
      coordinator: 'Central Examination Cell & University Appointees',
      description: 'State Technological University centralized final theory evaluations.',
      completionPercent: 0,
    },
  ]);

  // Gazetted Holidays for AY 2026-27 Term-II
  const holidays: HolidayItem[] = [
    { date: 'Jan 26, 2027', day: 'Tuesday', occasion: 'Republic Day', type: 'Gazetted Holiday' },
    { date: 'Feb 19, 2027', day: 'Friday', occasion: 'Chhatrapati Shivaji Maharaj Jayanti', type: 'Gazetted Holiday' },
    { date: 'Mar 08, 2027', day: 'Monday', occasion: 'Maha Shivratri', type: 'Gazetted Holiday' },
    { date: 'Mar 25, 2027', day: 'Thursday', occasion: 'Holi (Dhulivandan)', type: 'Gazetted Holiday' },
    { date: 'Apr 02, 2027', day: 'Friday', occasion: 'Good Friday', type: 'Gazetted Holiday' },
    { date: 'Apr 14, 2027', day: 'Wednesday', occasion: 'Dr. Babasaheb Ambedkar Jayanti', type: 'Gazetted Holiday' },
    { date: 'May 01, 2027', day: 'Saturday', occasion: 'Maharashtra Day / Labour Day', type: 'Gazetted Holiday' },
    { date: 'May 10 – 28, 2027', day: 'Mon – Fri', occasion: 'University ESE Exam Window', type: 'Exam Window' },
  ];

  const filteredMilestones = useMemo(() => {
    if (categoryFilter === 'ALL') return milestones;
    return milestones.filter((m) => m.category === categoryFilter);
  }, [milestones, categoryFilter]);

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDateRange.trim()) return;

    const newItem: AcademicMilestone = {
      id: `m-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      dateRange: newDateRange.trim(),
      status: 'Upcoming',
      coordinator: newCoordinator.trim() || 'Dr. Anjali Kulkarni (HOD)',
      description: newDescription.trim() || 'Department academic milestone.',
      completionPercent: 0,
    };

    setMilestones((prev) => [newItem, ...prev]);
    showToast(`Added academic milestone: "${newTitle}"`);

    academicStore.addNotification({
      type: 'info',
      title: `AY 26–27 Milestone Scheduled: ${newTitle}`,
      message: `Date: ${newDateRange} • Coordinator: ${newItem.coordinator}`,
      timeAgo: 'Just now',
      unread: true,
    });

    setIsAddMilestoneOpen(false);
    setNewTitle('');
    setNewDateRange('');
    setNewCoordinator('');
    setNewDescription('');
  };

  const handleExportPlan = () => {
    const headers = ['Milestone Title', 'Category', 'Date / Window', 'Status', 'Coordinator', 'Completion %', 'Description'];
    const rows = milestones.map((m) => [
      m.title,
      m.category,
      m.dateRange,
      m.status,
      m.coordinator,
      `${m.completionPercent}%`,
      m.description,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AY_2026_2027_Term_II_Academic_Plan_CSD_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('AY 2026–2027 Department Academic Calendar exported to CSV.');
  };

  const handleConfirmSignOff = () => {
    setSignOffDone(true);
    setIsSignOffModalOpen(false);
    showToast('HOD Academic Mid-Term Audit endorsed and forwarded to Dean of Academic Affairs.');

    academicStore.addNotification({
      type: 'info',
      title: 'HOD Academic Progress Endorsement Signed',
      message: 'Dr. Anjali Kulkarni formally certified AY 26–27 Term-II syllabus and attendance audits.',
      timeAgo: 'Just now',
      unread: true,
    });
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

      {/* HEADER SECTION: ACADEMIC YEAR 2026–2027 GOVERNANCE */}
      <div className="bg-gradient-to-r from-[#F9F5FF] via-white to-[#F3EEFF] border border-[#E0D4FC] rounded-2xl p-6 shadow-[0px_4px_16px_rgba(109,61,232,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#6D3DE8]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#6D3DE8] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">date_range</span>
                Academic Year 2026–2027
              </span>
              <span className="px-2.5 py-0.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] text-[12px] font-bold rounded-full">
                Term-II (Even Semester)
              </span>
              <span className="px-2.5 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A34A] text-[12px] font-bold rounded-full">
                Status: Active &amp; On Schedule
              </span>
            </div>

            <h1 className="font-manrope text-2xl sm:text-3xl font-extrabold text-[#17151C] tracking-tight">
              Academic Calendar &amp; Term Governance
            </h1>
            <p className="text-[14px] text-[#6B6875] mt-1 max-w-2xl">
              Department of Computer Science &amp; Design • Instructional cycle: Jan 05, 2027 – May 28, 2027 • University Affiliation: State Technological University
            </p>

            {/* Quick Context Strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[13px]">
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">timelapse</span>
                <span className="text-[#6B6875]">Term Timeline:</span>
                <strong>Week 11 of 16 (68% Complete)</strong>
              </span>
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#16A34A]">calendar_view_day</span>
                <span className="text-[#6B6875]">Instructional Days:</span>
                <strong>88 of 105 Working Days</strong>
              </span>
              <span className="flex items-center gap-1.5 text-[#17151C]">
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">menu_book</span>
                <span className="text-[#6B6875]">Curriculum Index:</span>
                <strong className="text-[#16A34A]">78.4% Covered</strong>
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddMilestoneOpen(true)}
              className="px-4 py-2.5 bg-[#6D3DE8] hover:bg-[#5416D0] text-white text-[13px] font-bold rounded-xl shadow-[0_4px_12px_rgba(109,61,232,0.25)] flex items-center gap-1.5 transition-all cursor-pointer font-manrope"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Milestone
            </button>
            <button
              onClick={handleExportPlan}
              className="px-3.5 py-2.5 bg-white border border-[#E0D4FC] text-[#6D3DE8] hover:bg-[#F3EEFF] text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              Export Term Plan
            </button>
            <button
              onClick={() => setIsSignOffModalOpen(true)}
              className={`px-3.5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                signOffDone
                  ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#16A34A]'
                  : 'bg-[#FDF7FF] border border-[#E8E4EE] text-[#17151C] hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {signOffDone ? 'verified' : 'draw'}
              </span>
              {signOffDone ? 'Audit Certified' : 'HOD Mid-Term Sign-Off'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 STRATEGIC KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F3EEFF] border border-[#E0D4FC] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#6D3DE8] text-[26px]">hourglass_top</span>
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6875] block">
              Teaching Progress
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#17151C]">88 / 105</span>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                68% Completed
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#E8E4EE] rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="h-1.5 rounded-full bg-[#6D3DE8]" style={{ width: '68%' }} />
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#16A34A] text-[26px]">fact_check</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6875] block">
              Syllabus Coverage
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#16A34A]">78.4%</span>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                +3.4% Target
              </span>
            </div>
            <span className="text-[12px] text-[#6B6875] mt-0.5 block">Target at Wk 11: 75%</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FDF7FF] border border-[#E8E4EE] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#6D3DE8] text-[26px]">assignment</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6875] block">
              Internal Exam (ISE-1)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#17151C]">100%</span>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-1.5 py-0.5 rounded">
                Evaluated
              </span>
            </div>
            <span className="text-[12px] text-[#6B6875] mt-0.5 block">ISE-2 begins April 14</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#16A34A] text-[26px]">account_balance_wallet</span>
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6B6875] block">
              Dept Lab &amp; Research Fund
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#17151C]">₹14.20L</span>
              <span className="text-[11px] font-bold text-[#6D3DE8] bg-[#F3EEFF] px-1.5 py-0.5 rounded">
                of ₹18.50L
              </span>
            </div>
            <span className="text-[12px] text-[#6B6875] mt-0.5 block">76.7% grant utilized</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SECTION: TWO COLUMNS (TIMELINE & WORKLOAD / HOLIDAYS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: ACADEMIC MILESTONES & TERM TIMELINE */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-[#E8E4EE] rounded-2xl p-4 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">timeline</span>
              <h3 className="font-manrope text-base font-bold text-[#17151C]">
                Term Milestones &amp; Academic Timeline
              </h3>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'ALL', label: 'All (11)' },
                { id: 'Academics', label: 'Teaching' },
                { id: 'Exams', label: 'Exams' },
                { id: 'Accreditation', label: 'NBA / Quality' },
                { id: 'Events', label: 'Events' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    categoryFilter === tab.id
                      ? 'bg-[#6D3DE8] text-white'
                      : 'bg-[#FDF7FF] text-[#6B6875] hover:bg-[#F3EEFF] hover:text-[#6D3DE8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Milestones Chronological Feed */}
          <div className="space-y-3">
            {filteredMilestones.map((item, index) => {
              const isDone = item.status === 'Completed';
              const isInProgress = item.status === 'In Progress';

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl p-4.5 shadow-2xs transition-all hover:shadow-xs flex items-start gap-4 ${
                    isDone
                      ? 'border-[#E8E4EE]'
                      : isInProgress
                      ? 'border-[#6D3DE8]/40 ring-1 ring-[#6D3DE8]/20 bg-[#FDF7FF]'
                      : 'border-[#E8E4EE] opacity-95'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]'
                        : isInProgress
                        ? 'bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC]'
                        : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isDone ? 'check_circle' : isInProgress ? 'progress_activity' : 'schedule'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#FDF7FF] border border-[#E8E4EE] text-[#6B6875] text-[10px] font-mono font-bold rounded">
                          {item.dateRange}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            item.category === 'Exams'
                              ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                              : item.category === 'Accreditation'
                              ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]'
                              : item.category === 'Events'
                              ? 'bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC]'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isDone
                            ? 'bg-[#ECFDF5] text-[#16A34A]'
                            : isInProgress
                            ? 'bg-[#F3EEFF] text-[#6D3DE8]'
                            : 'bg-gray-100 text-[#6B6875]'
                        }`}
                      >
                        {item.status} ({item.completionPercent}%)
                      </span>
                    </div>

                    <h4 className="font-bold text-[14px] text-[#17151C] mt-1">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-[#6B6875] mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E8E4EE]/60 text-[11px] text-[#6B6875]">
                      <span className="material-symbols-outlined text-[14px] text-[#6D3DE8]">person</span>
                      <span>Coordinator: <strong>{item.coordinator}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 1 COLUMN: CURRICULUM WORKLOAD & GAZETTED HOLIDAYS */}
        <div className="space-y-5">
          {/* Card 1: Department Workload Matrix */}
          <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">pie_chart</span>
                <h3 className="font-manrope text-base font-bold text-[#17151C]">
                  CSD Teaching Workload
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#ECFDF5] px-2 py-0.5 rounded">
                AICTE Norms Compliant
              </span>
            </div>

            <div className="space-y-3 text-[13px]">
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#6B6875]">Theory Lectures (32 Courses):</span>
                  <strong>144 hrs / week</strong>
                </div>
                <div className="w-full bg-[#E8E4EE] rounded-full h-1.5 overflow-hidden">
                  <div className="h-1.5 rounded-full bg-[#6D3DE8]" style={{ width: '53%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#6B6875]">Practical Labs (16 Batches):</span>
                  <strong>96 hrs / week</strong>
                </div>
                <div className="w-full bg-[#E8E4EE] rounded-full h-1.5 overflow-hidden">
                  <div className="h-1.5 rounded-full bg-[#10B981]" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span className="text-[#6B6875]">Project &amp; Mentorship:</span>
                  <strong>32 hrs / week</strong>
                </div>
                <div className="w-full bg-[#E8E4EE] rounded-full h-1.5 overflow-hidden">
                  <div className="h-1.5 rounded-full bg-amber-500" style={{ width: '12%' }} />
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8E4EE] flex justify-between items-center text-[12px]">
                <span className="text-[#6B6875]">Total Department Weekly Load:</span>
                <strong className="text-base text-[#6D3DE8] font-manrope">272 Hours</strong>
              </div>
            </div>

            <div className="p-3 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE] text-[11px] text-[#6B6875] space-y-1">
              <div className="flex justify-between">
                <span>Avg Asst. Prof Load:</span>
                <strong className="text-[#17151C]">16.2 hrs / wk (Norm: 16)</strong>
              </div>
              <div className="flex justify-between">
                <span>Avg Assoc. Prof Load:</span>
                <strong className="text-[#17151C]">12.4 hrs / wk (Norm: 12)</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Gazetted Holidays & Examination Windows */}
          <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">event</span>
                <h3 className="font-manrope text-base font-bold text-[#17151C]">
                  Academic Holidays &amp; Windows
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#6B6875]">Term-II</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {holidays.map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE] flex items-center justify-between gap-2 text-[12px]"
                >
                  <div>
                    <strong className="text-[#17151C] block">{h.occasion}</strong>
                    <span className="text-[11px] text-[#6B6875] font-mono">
                      {h.date} ({h.day})
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      h.type === 'Exam Window'
                        ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                        : 'bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0]'
                    }`}
                  >
                    {h.type === 'Exam Window' ? 'Exam' : 'Holiday'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Links & Navigation */}
          <div className="p-4 bg-gradient-to-br from-[#6D3DE8] to-[#5416D0] rounded-2xl text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">hub</span>
              <h4 className="font-bold text-[14px]">Inter-Department Governance</h4>
            </div>
            <p className="text-[12px] text-white/80 leading-relaxed">
              Seamlessly monitor division class coordinators, faculty teaching loads, and master room allocations.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => onNavigateTab && onNavigateTab('class-teachers')}
                className="w-full py-2 px-3 bg-white text-[#6D3DE8] hover:bg-[#F3EEFF] text-[12px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">supervisor_account</span>
                Open Class Teachers Dashboard
              </button>
              <button
                onClick={() => onNavigateTab && onNavigateTab('timetable')}
                className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                View Master Dept Timetable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD ACADEMIC MILESTONE MODAL */}
      {isAddMilestoneOpen && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#E8E4EE] pb-3">
              <div>
                <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                  Schedule Academic Milestone
                </h3>
                <p className="text-[12px] text-[#6B6875]">
                  Add event to CSD AY 2026–2027 Term-II calendar
                </p>
              </div>
              <button
                onClick={() => setIsAddMilestoneOpen(false)}
                className="p-1.5 text-[#6B6875] hover:text-[#17151C] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMilestoneSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Industry Expert Guest Lecture on Cloud Native AI"
                  required
                  className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[#17151C] outline-none focus:border-[#6D3DE8]"
                  >
                    <option value="Academics">Teaching / Academics</option>
                    <option value="Exams">Examinations</option>
                    <option value="Accreditation">NBA / Accreditation</option>
                    <option value="Events">Department Events</option>
                    <option value="Review">Academic Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                    Date / Date Window *
                  </label>
                  <input
                    type="text"
                    value={newDateRange}
                    onChange={(e) => setNewDateRange(e.target.value)}
                    placeholder="e.g. Apr 12, 2027"
                    required
                    className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Faculty Coordinator
                </label>
                <input
                  type="text"
                  value={newCoordinator}
                  onChange={(e) => setNewCoordinator(e.target.value)}
                  placeholder="e.g. Prof. Anjali Sharma"
                  className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                  Description / Deliverables
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief objectives and expected student deliverables..."
                  className="w-full p-2.5 text-[13px] bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl outline-none focus:border-[#6D3DE8]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneOpen(false)}
                  className="px-4 py-2 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[12px] font-bold text-[#17151C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Schedule Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: HOD MID-TERM AUDIT SIGN-OFF */}
      {isSignOffModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E4EE] shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#E8E4EE] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6D3DE8] text-[24px]">verified</span>
                <div>
                  <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                    HOD Mid-Term Academic Progress Endorsement
                  </h3>
                  <p className="text-[12px] text-[#6B6875]">
                    Certification for Dean of Academic Affairs (AY 2026–2027)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSignOffModalOpen(false)}
                className="p-1.5 text-[#6B6875] hover:text-[#17151C] rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 my-4 text-[13px]">
              <div className="p-4 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6B6875]">Department:</span>
                  <strong>Computer Science &amp; Design (CSD)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6875]">Head of Department:</span>
                  <strong>Dr. Anjali Kulkarni (HOD-CSD-01)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6875]">Total Working Days Audited:</span>
                  <strong className="text-[#16A34A]">88 of 105 (Week 11)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6875]">Syllabus Completion:</span>
                  <strong className="text-[#16A34A]">78.4% (Satisfactory)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6875]">Average Attendance:</span>
                  <strong className="text-[#16A34A]">85.6% (Compliant)</strong>
                </div>
              </div>

              <p className="text-[12px] text-[#6B6875] leading-relaxed">
                By clicking certify, you digitally authenticate that all course files, continuous lab assessment marks, ISE-1 papers, and attendance registers for the 8 CSD divisions have been verified under statutory University norms.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E4EE]">
              <button
                type="button"
                onClick={() => setIsSignOffModalOpen(false)}
                className="px-4 py-2 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[12px] font-bold text-[#17151C]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSignOff}
                className="px-4 py-2 bg-[#6D3DE8] hover:bg-[#5416D0] text-white rounded-xl text-[12px] font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">draw</span>
                Digitally Certify &amp; Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
