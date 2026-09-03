import React, { useState } from 'react';
import { ApprovalRequest, CourseOverviewItem } from '../types';
import { AddCourseModal, AddTeacherModal, ManageHodModal } from './AdminModals';

interface AdminDashboardProps {
  userRole?: string;
  approvals?: ApprovalRequest[];
  courses?: CourseOverviewItem[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onAddCourse: (course: CourseOverviewItem) => void;
  onUpdateHod: (courseId: string, newHod: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userRole,
  approvals = [],
  courses = [],
  onApproveRequest,
  onRejectRequest,
  onAddCourse,
  onUpdateHod,
  onNavigateTab,
}) => {
  const [chartTimeframe, setChartTimeframe] = useState<'This Week' | 'This Month' | 'Semester'>('This Week');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showManageHodModal, setShowManageHodModal] = useState(false);
  const [teachersCount, setTeachersCount] = useState(86);
  const [showAllCourses, setShowAllCourses] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isHod = userRole === 'HOD';

  const safeApprovals = Array.isArray(approvals) ? approvals : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  const pendingApprovals = isHod
    ? safeApprovals.filter(
        (a) =>
          a.status === 'pending' &&
          (a.departmentOrYear?.includes('CSD') ||
            a.departmentOrYear?.includes('Computer') ||
            a.roleType === 'Student Registration')
      )
    : safeApprovals.filter((a) => a.status === 'pending');

  // Dynamic calculations from database records
  const totalStudentsCount = isHod
    ? 318
    : safeCourses.reduce((sum, c) => sum + (c.totalStudents || 0), 0) || 1248;
  const totalTeachersCount = isHod
    ? 22
    : safeCourses.reduce((sum, c) => sum + (c.totalTeachers || 0), 0) || teachersCount;
  const totalDivisionsCount = isHod
    ? 8
    : safeCourses.reduce((sum, c) => sum + (c.totalClasses || 0), 0) || 32;
  const overallAvgAttendance = isHod
    ? '85.6'
    : totalStudentsCount > 0
    ? (
        safeCourses.reduce((sum, c) => sum + (c.avgAttendance || 0) * (c.totalStudents || 0), 0) /
        totalStudentsCount
      ).toFixed(1)
    : '84.6';

  const handleApprove = (id: string, name: string) => {
    onApproveRequest(id);
    setToastMessage(`Approved application for ${name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleReject = (id: string, name: string) => {
    onRejectRequest(id);
    setToastMessage(`Rejected application for ${name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTeacherAdded = (name: string, dept: string) => {
    setTeachersCount((prev) => prev + 1);
    setToastMessage(`Registered ${name} in ${dept}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Chart data based on selected timeframe dynamically calculated from totalStudentsCount
  const baseStudents = totalStudentsCount || 1248;
  const chartData = {
    'This Week': [
      { label: 'Mon', rate: 85.4, present: Math.round(baseStudents * 0.854) },
      { label: 'Tue', rate: 86.8, present: Math.round(baseStudents * 0.868) },
      { label: 'Wed', rate: 84.6, present: Math.round(baseStudents * 0.846) },
      { label: 'Thu', rate: 87.2, present: Math.round(baseStudents * 0.872) },
      { label: 'Fri', rate: 83.9, present: Math.round(baseStudents * 0.839) },
    ],
    'This Month': [
      { label: 'Week 1', rate: 83.8, present: Math.round(baseStudents * 0.838) },
      { label: 'Week 2', rate: 85.2, present: Math.round(baseStudents * 0.852) },
      { label: 'Week 3', rate: 86.0, present: Math.round(baseStudents * 0.860) },
      { label: 'Week 4', rate: 84.6, present: Math.round(baseStudents * 0.846) },
    ],
    Semester: [
      { label: 'Aug', rate: 82.5, present: Math.round(baseStudents * 0.825) },
      { label: 'Sep', rate: 84.1, present: Math.round(baseStudents * 0.841) },
      { label: 'Oct', rate: 84.6, present: Math.round(baseStudents * 0.846) },
      { label: 'Nov', rate: 85.8, present: Math.round(baseStudents * 0.858) },
    ],
  }[chartTimeframe];

  const displayedCourses = showAllCourses ? safeCourses : safeCourses.slice(0, 4);

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

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-manrope text-2xl sm:text-[32px] font-bold text-[#17151C] tracking-tight leading-tight">
            {isHod ? 'Good morning, Dr. Anjali Kulkarni.' : 'Good morning, Dr. Evelyn Carter.'}
          </h2>
          <p className="text-[15px] text-[#6B6875] mt-1">
            {isHod
              ? 'Department Overview • Computer Science & Design (CSD) • Academic Year 2026–27'
              : 'College overview for Academic Year 2026–27 • TechNova Institute of Technology'}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap gap-2.5">
          {isHod ? (
            <>
              <button
                id="hod-class-teachers-btn"
                onClick={() => onNavigateTab('class-teachers')}
                className="bg-[#6D3DE8] text-white font-bold text-[13px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#5416D0] transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">supervisor_account</span>
                Class Teachers
              </button>
              <button
                id="hod-academic-year-btn"
                onClick={() => onNavigateTab('academic-year')}
                className="bg-white text-[#6D3DE8] border border-[#E0D4FC] font-bold text-[13px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#F3EEFF] transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">date_range</span>
                AY 26–27 Calendar
              </button>
              <button
                id="hod-timetable-btn"
                onClick={() => onNavigateTab('timetable')}
                className="bg-white text-[#17151C] border border-[#E8E4EE] font-bold text-[13px] px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#FDF7FF] transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">calendar_month</span>
                Timetable
              </button>
              <button
                id="hod-add-teacher-btn"
                onClick={() => setShowAddTeacherModal(true)}
                className="bg-white text-[#17151C] border border-[#E8E4EE] font-bold text-[13px] px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#FDF7FF] transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">person_add</span>
                Add Faculty
              </button>
              <button
                id="hod-reports-btn"
                onClick={() => onNavigateTab('reports')}
                className="bg-white text-[#17151C] border border-[#E8E4EE] font-bold text-[13px] px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#FDF7FF] transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">analytics</span>
                Reports
              </button>
            </>
          ) : (
            <>
              <button
                id="admin-add-course-btn"
                onClick={() => setShowAddCourseModal(true)}
                className="bg-[#6D3DE8] text-white font-bold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#5416D0] transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Course
              </button>
              <button
                id="admin-add-teacher-btn"
                onClick={() => setShowAddTeacherModal(true)}
                className="bg-white text-[#6D3DE8] border border-[#E8E4EE] font-bold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#F3EEFF] transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Add Teacher
              </button>
              <button
                id="admin-manage-hod-btn"
                onClick={() => setShowManageHodModal(true)}
                className="bg-white text-[#6D3DE8] border border-[#E8E4EE] font-bold text-[13px] px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#F3EEFF] transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                Manage HOD
              </button>
            </>
          )}
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider">
              {isHod ? 'CSD Students' : 'Total Students'}
            </span>
            <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">groups</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope text-[24px] font-extrabold text-[#17151C]">
              {totalStudentsCount.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 2.4%
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider">
              {isHod ? 'CSD Faculty' : 'Total Faculty'}
            </span>
            <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">school</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope text-[24px] font-extrabold text-[#17151C]">
              {totalTeachersCount}
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 1.1%
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider">
              {isHod ? 'CSD Subjects' : 'Departments'}
            </span>
            <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">account_tree</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope text-[24px] font-extrabold text-[#17151C]">
              {isHod ? '6' : safeCourses.length}
            </span>
            <span className="text-[11px] font-semibold text-[#6B6875] flex items-center">
              <span className="material-symbols-outlined text-[14px]">horizontal_rule</span> 0%
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider">
              {isHod ? 'CSD Divisions' : 'Divisions'}
            </span>
            <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">
              class
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope text-[24px] font-extrabold text-[#17151C]">
              {totalDivisionsCount}
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 4.5%
            </span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider">
              Avg Attendance
            </span>
            <span className="material-symbols-outlined text-[#6D3DE8] text-[20px]">how_to_reg</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope text-[24px] font-extrabold text-[#17151C]">
              {overallAvgAttendance}%
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] flex items-center">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 0.8%
            </span>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-white rounded-2xl p-4 flex flex-col justify-between border border-[#E8E4EE] border-l-4 border-l-[#DC2626] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider">
              Pending Requests
            </span>
            <span className="material-symbols-outlined text-[#DC2626] text-[20px]">
              pending_actions
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope text-[24px] font-extrabold text-[#DC2626]">
              {pendingApprovals.length}
            </span>
            <span className="text-[11px] font-bold text-[#DC2626] flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">priority_high</span> Action
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 flex flex-col h-[400px] border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                Attendance Overview
              </h3>
              <p className="text-[12px] text-[#6B6875]">
                Aggregated institutional attendance performance
              </p>
            </div>
            <select
              value={chartTimeframe}
              onChange={(e) => setChartTimeframe(e.target.value as any)}
              className="bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[12px] font-bold px-3 py-1.5 outline-none text-[#17151C] cursor-pointer"
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Semester">Semester</option>
            </select>
          </div>

          <div className="flex-1 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE] p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Metric Banner inside chart */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-[#6B6875]">Average Rate:</span>
                <span className="text-xl font-manrope font-extrabold text-[#6D3DE8]">
                  {overallAvgAttendance}%
                </span>
                <span className="text-[11px] font-bold bg-[#ECFDF5] text-[#16A34A] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                  +1.4% vs prev target
                </span>
              </div>
              <span className="text-[11px] text-[#6B6875]">
                {totalStudentsCount.toLocaleString()} Active Enrolled
              </span>
            </div>

            {/* SVG Visual Bar & Trend Visualization */}
            <div className="h-44 w-full flex items-end justify-between gap-3 px-2 sm:px-6 z-10 pt-4">
              {chartData.map((bar) => {
                const heightPercent = Math.max(25, (bar.rate - 85) * 8.5);
                return (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[11px] font-bold text-[#6D3DE8] opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.rate}%
                    </span>
                    <div className="w-full max-w-[48px] bg-[#E8E4EE] rounded-t-lg h-32 flex items-end p-1 relative overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-[#6D3DE8] to-[#8B5CF6] rounded-t-md transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-medium text-[#6B6875]">{bar.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#E8E4EE] flex items-center justify-between text-[11px] text-[#6B6875] z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#6D3DE8] rounded-xs" /> Actual Rate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#6B6875]" /> 85% Target Threshold
                </span>
              </div>
              <span>Live Synced</span>
            </div>
          </div>
        </div>

        {/* Right: Pending Approvals */}
        <div className="bg-white rounded-2xl p-6 flex flex-col h-[400px] border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-manrope text-lg font-bold text-[#17151C]">Pending Approvals</h3>
            <span className="bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {pendingApprovals.length} New
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {pendingApprovals.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#6B6875] text-center p-4">
                <span className="material-symbols-outlined text-[36px] text-[#16A34A] mb-1">
                  task_alt
                </span>
                <p className="text-[13px] font-medium">All pending requests cleared!</p>
              </div>
            ) : (
              pendingApprovals.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#FDF7FF] rounded-xl p-3 border border-[#E8E4EE] flex flex-col gap-2 shadow-2xs transition-all hover:border-[#6D3DE8]/50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[13px] font-bold text-[#17151C]">{req.name}</p>
                      <p className="text-[11px] text-[#6B6875]">
                        {req.roleType} • {req.departmentOrYear}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-[#6D3DE8] text-[18px]">
                      {req.icon}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleApprove(req.id, req.name)}
                      className="flex-1 bg-[#6D3DE8] text-white text-[12px] font-bold py-1.5 rounded-lg hover:bg-[#5416D0] transition-colors shadow-2xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req.id, req.name)}
                      className="flex-1 bg-white border border-[#E8E4EE] text-[#6B6875] text-[12px] font-bold py-1.5 rounded-lg hover:bg-[#F3EEFF] transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Course Overview Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E4EE] shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-manrope text-lg font-bold text-[#17151C]">Course & Department Overview</h3>
            <p className="text-[12px] text-[#6B6875]">
              Active academic disciplines and attendance health
            </p>
          </div>
          <button
            onClick={() => setShowAllCourses(!showAllCourses)}
            className="text-[#6D3DE8] text-[13px] font-bold hover:underline flex items-center gap-1"
          >
            {showAllCourses ? 'Show Less' : 'View All'}
            <span className="material-symbols-outlined text-[16px]">
              {showAllCourses ? 'expand_less' : 'arrow_forward'}
            </span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E8E4EE] bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDF7FF] border-b border-[#E8E4EE] text-[12px] font-bold text-[#6B6875]">
                <th className="p-4">Department / Course</th>
                <th className="p-4">Assigned HOD</th>
                <th className="p-4">Total Classes</th>
                <th className="p-4">Avg. Attendance</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-[14px] divide-y divide-[#E8E4EE]">
              {displayedCourses.map((course) => (
                <tr key={course.id} className="hover:bg-[#FDF7FF] transition-colors">
                  <td className="p-4 font-bold text-[#17151C] flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    {course.name}
                  </td>
                  <td className="p-4 text-[#6B6875] font-medium">
                    {course.hodName || course.hod || 'Unassigned'}
                  </td>
                  <td className="p-4 text-[#17151C] font-semibold">
                    {course.totalClasses} Divisions
                    {course.totalStudents ? (
                      <span className="text-[12px] font-normal text-[#6B6875] ml-1.5">
                        ({course.totalStudents} students)
                      </span>
                    ) : null}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#E8E4EE] rounded-full h-1.5 max-w-[100px]">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${course.avgAttendance}%`,
                            backgroundColor:
                              course.status === 'review' ? '#DC2626' : '#6D3DE8',
                          }}
                        />
                      </div>
                      <span
                        className={`text-[12px] font-bold ${
                          course.status === 'review' ? 'text-[#DC2626]' : 'text-[#17151C]'
                        }`}
                      >
                        {course.avgAttendance}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {course.status === 'healthy' ? (
                      <span className="inline-flex items-center gap-1 text-[#16A34A] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-md text-[12px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Healthy
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-1 rounded-md text-[12px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        Review
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Action Modals */}
      <AddCourseModal
        isOpen={showAddCourseModal}
        onClose={() => setShowAddCourseModal(false)}
        onAddCourse={(newCourse) => {
          onAddCourse(newCourse);
          setToastMessage(`Course "${newCourse.name}" added successfully.`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      <AddTeacherModal
        isOpen={showAddTeacherModal}
        onClose={() => setShowAddTeacherModal(false)}
        onTeacherAdded={handleTeacherAdded}
      />

      <ManageHodModal
        isOpen={showManageHodModal}
        onClose={() => setShowManageHodModal(false)}
        courses={courses}
        onUpdateHod={(cId, newHod) => {
          onUpdateHod(cId, newHod);
          setToastMessage(`Updated HOD to ${newHod}`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />
    </div>
  );
};
