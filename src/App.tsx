import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, StudentAttendanceEntry, CourseOverviewItem } from './types';
import { initialMockData } from './data/mockData';
import { PRESET_USERS, academicStore } from './data/academicStore';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LoginScreen } from './components/LoginScreen';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { TimetableView } from './components/TimetableView';
import { AttendanceView } from './components/AttendanceView';
import { ReportsView } from './components/ReportsView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { MyClassDashboard } from './components/MyClassDashboard';
import { DailyLectureLogsDashboard } from './components/DailyLectureLogsDashboard';
import { NowNextLectureDashboard } from './components/NowNextLectureDashboard';
import { HodClassTeachersDashboard } from './components/HodClassTeachersDashboard';
import { HodAcademicYearDashboard } from './components/HodAcademicYearDashboard';

export default function App() {
  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('CLASS_TEACHER');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Navigation & Modals
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Store Sync
  const [storeState, setStoreState] = useState(academicStore.getState());

  useEffect(() => {
    const unsubscribe = academicStore.subscribe(() => {
      setStoreState({ ...academicStore.getState() });
    });
    return unsubscribe;
  }, []);

  // Map user profile based on current role
  const getUserForRole = (role: UserRole): UserProfile => {
    switch (role) {
      case 'COLLEGE_ADMIN':
      case 'admin':
        return PRESET_USERS.admin;
      case 'HOD':
        return PRESET_USERS.hod;
      case 'CLASS_TEACHER':
        return PRESET_USERS.classTeacher;
      case 'SUBJECT_TEACHER':
      case 'teacher':
        return PRESET_USERS.subjectTeacher;
      case 'STUDENT':
      case 'student':
        return PRESET_USERS.student;
      default:
        return PRESET_USERS.classTeacher;
    }
  };

  const currentUser = getUserForRole(currentRole);
  const notifications = Array.isArray(storeState?.notifications) ? storeState.notifications : [];
  const unreadNotificationsCount = notifications.filter((n) => n?.unread).length;

  // Handlers
  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    setActiveTab('dashboard');
  };

  const handleAttendanceSubmitted = (
    updatedRoster: StudentAttendanceEntry[],
    sessionDetails?: { subject: string; className: string; room: string; time: string }
  ) => {
    academicStore.recordAttendance({
      subject: sessionDetails?.subject || (currentRole === 'SUBJECT_TEACHER' ? 'Database Management Systems' : 'Data Structures & Algorithms'),
      classId: 'class-csd-a',
      className: sessionDetails?.className || 'TE CSD-A',
      room: sessionDetails?.room || 'Room B-204',
      time: sessionDetails?.time || '10:00 AM',
      teacherName: currentUser.name,
      updatedRoster,
    });
  };

  const handleApproveRequest = (id: string) => {
    academicStore.approveRequest(id);
  };

  const handleRejectRequest = (id: string) => {
    academicStore.rejectRequest(id);
  };

  const handleAddCourse = (newCourse: CourseOverviewItem) => {
    academicStore.addCourse(newCourse);
  };

  const handleUpdateHod = (courseId: string, newHod: string) => {
    academicStore.updateCourseHod(courseId, newHod);
  };

  const handleMarkAllNotificationsRead = () => {
    academicStore.markAllNotificationsRead();
  };

  const handleClearAllNotifications = () => {
    academicStore.clearAllNotifications();
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    // Local profile feedback
    academicStore.addNotification({
      type: 'info',
      title: 'Profile Updated',
      message: `Your profile details were updated.`,
      timeAgo: 'Just now',
      unread: false,
    });
  };

  // If user is logged out, render Screen 1 (Login Screen)
  if (!isAuthenticated) {
    return (
      <div className="font-sans antialiased text-[#17151C] min-h-screen bg-[#FFFFFF]">
        {/* Quick Screen Preview Bar */}
        <div className="bg-[#17151C] text-white text-[12px] py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 z-50 border-b border-[#2E1065]">
          <span className="font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6D3DE8] animate-pulse" />
            <strong className="text-white font-manrope">DOT Preview Mode:</strong> Screen 1 (Sign-In & Role Selection)
          </span>
          <div className="flex gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => handleLogin('CLASS_TEACHER')}
              className="px-2.5 py-1 bg-[#6D3DE8] hover:bg-[#5416D0] rounded-lg text-[11px] font-bold transition-colors text-white"
            >
              Class Teacher
            </button>
            <button
              onClick={() => handleLogin('COLLEGE_ADMIN')}
              className="px-2.5 py-1 bg-[#6D3DE8] hover:bg-[#5416D0] rounded-lg text-[11px] font-bold transition-colors text-white"
            >
              College Admin
            </button>
            <button
              onClick={() => handleLogin('HOD')}
              className="px-2.5 py-1 bg-[#6D3DE8] hover:bg-[#5416D0] rounded-lg text-[11px] font-bold transition-colors text-white"
            >
              HOD
            </button>
            <button
              onClick={() => handleLogin('STUDENT')}
              className="px-2.5 py-1 bg-[#6D3DE8] hover:bg-[#5416D0] rounded-lg text-[11px] font-bold transition-colors text-white"
            >
              Student
            </button>
          </div>
        </div>
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  // Determine which dashboard to show
  const isTeacherView = currentRole === 'CLASS_TEACHER' || currentRole === 'SUBJECT_TEACHER' || currentRole === 'teacher';
  const isAdminOrHodView = currentRole === 'COLLEGE_ADMIN' || currentRole === 'HOD' || currentRole === 'admin';
  const isStudentView = currentRole === 'STUDENT' || currentRole === 'student';

  // Render Main Authenticated Application with Shell
  return (
    <div className="font-sans antialiased text-[#17151C] min-h-screen bg-[#FFFFFF] flex flex-col">
      {/* Fixed Top Header */}
      <TopHeader
        user={currentUser}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        onOpenNotifications={() => setActiveTab('notifications')}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadCount={unreadNotificationsCount}
      />

      {/* Sidebar */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Content Area */}
      <main
        id="main-content-scroll"
        className="flex-1 md:ml-[260px] p-4 sm:p-6 lg:p-8 pt-[88px] sm:pt-[92px] max-w-7xl w-full"
      >
          {/* View Routing */}
          {activeTab === 'dashboard' && (
            <>
              {isTeacherView && (
                <TeacherDashboard
                  userRole={currentRole}
                  isClassTeacher={currentRole === 'CLASS_TEACHER'}
                  teacherName={currentUser.name}
                  studentsRoster={storeState?.studentsRoster || []}
                  lectureHistory={storeState?.lectureHistory || []}
                  timetable={storeState?.timetable || []}
                  onAttendanceSubmitted={handleAttendanceSubmitted}
                  onNavigateTab={setActiveTab}
                />
              )}
              {isAdminOrHodView && (
                <AdminDashboard
                  userRole={currentRole}
                  approvals={storeState?.approvals || []}
                  courses={storeState?.courses || []}
                  onApproveRequest={handleApproveRequest}
                  onRejectRequest={handleRejectRequest}
                  onAddCourse={handleAddCourse}
                  onUpdateHod={handleUpdateHod}
                  onNavigateTab={setActiveTab}
                />
              )}
              {isStudentView && (
                <StudentDashboard
                  schedule={Array.isArray(storeState?.timetable) ? storeState.timetable.slice(0, 5) : []}
                  notifications={storeState?.notifications || []}
                  onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
                  onNavigateTab={setActiveTab}
                />
              )}
            </>
          )}

          {activeTab === 'timetable' && (
            <TimetableView role={currentRole} userRole={currentRole} />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              role={currentRole}
              onOpenTakeAttendance={() => {
                setActiveTab('dashboard');
              }}
            />
          )}

          {(activeTab === 'my-class' || (currentRole === 'CLASS_TEACHER' && activeTab === 'students')) && (
            <MyClassDashboard onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'lecture-history' && (
            <DailyLectureLogsDashboard onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'current-next' && (
            <NowNextLectureDashboard role={currentRole} onNavigateTab={setActiveTab} />
          )}

          {(activeTab === 'class-teachers' || (currentRole === 'HOD' && activeTab === 'classes')) && (
            <HodClassTeachersDashboard onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'academic-year' && (
            <HodAcademicYearDashboard onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'reports' && <ReportsView role={currentRole} />}

          {activeTab === 'notifications' && (
            <NotificationsView
              notifications={storeState?.notifications || []}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onClearAll={handleClearAllNotifications}
            />
          )}

          {(activeTab === 'profile' || activeTab === 'settings') && (
            <ProfileView user={currentUser} onUpdateProfile={handleUpdateProfile} />
          )}
        </main>

      {/* Global Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        onLogout={handleLogout}
      />
    </div>
  );
}
