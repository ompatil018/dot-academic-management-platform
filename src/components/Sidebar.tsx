import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenRoleSwitcher: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unreadNotificationsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  onOpenRoleSwitcher,
  isOpenMobile,
  onCloseMobile,
  unreadNotificationsCount,
}) => {
  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'COLLEGE_ADMIN':
      case 'admin':
        return {
          displayName: 'College Admin',
          subtitle: 'TechNova Central Office',
          navItems: [
            { id: 'dashboard', label: 'College Overview', icon: 'dashboard' },
            { id: 'courses', label: 'Courses & Depts', icon: 'account_tree' },
            { id: 'classes', label: 'Classes & Divisions', icon: 'class' },
            { id: 'teachers', label: 'Faculty Directory', icon: 'groups' },
            { id: 'hods', label: 'HOD Management', icon: 'manage_accounts' },
            { id: 'approvals', label: 'Requests & Approvals', icon: 'verified_user' },
            { id: 'timetable', label: 'Master Timetable', icon: 'calendar_today' },
            { id: 'reports', label: 'Institutional Reports', icon: 'analytics' },
            { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: unreadNotificationsCount },
            { id: 'settings', label: 'Settings & Security', icon: 'settings', dividerBefore: true },
          ],
        };
      case 'HOD':
        return {
          displayName: 'Head of Dept (HOD)',
          subtitle: 'Computer Science & Design',
          navItems: [
            { id: 'dashboard', label: 'HOD Dashboard', icon: 'dashboard' },
            { id: 'classes', label: 'Department Classes', icon: 'class' },
            { id: 'teachers', label: 'Faculty & Allocation', icon: 'groups' },
            { id: 'subjects', label: 'Curriculum & Subjects', icon: 'menu_book' },
            { id: 'class-teachers', label: 'Class Teachers', icon: 'supervisor_account' },
            { id: 'timetable', label: 'CSD Timetable', icon: 'calendar_today' },
            { id: 'reports', label: 'Department Reports', icon: 'analytics' },
            { id: 'academic-year', label: 'Academic Year 26–27', icon: 'date_range' },
            { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: unreadNotificationsCount },
            { id: 'profile', label: 'My Profile', icon: 'person', dividerBefore: true },
          ],
        };
      case 'CLASS_TEACHER':
        return {
          displayName: 'Class Teacher',
          subtitle: 'TE CSD - AI (Division A)',
          navItems: [
            { id: 'dashboard', label: 'Class Dashboard', icon: 'dashboard' },
            { id: 'my-class', label: 'My Class (TE CSD - AI)', icon: 'school' },
            { id: 'timetable', label: 'Manage Timetable', icon: 'edit_calendar' },
            { id: 'students', label: 'Students Roster', icon: 'group' },
            { id: 'attendance', label: 'Class Attendance', icon: 'fact_check' },
            { id: 'lecture-history', label: 'Daily Lecture Logs', icon: 'history_edu' },
            { id: 'reports', label: 'Monthly Records', icon: 'analytics' },
            { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: unreadNotificationsCount },
            { id: 'profile', label: 'Faculty Profile', icon: 'person', dividerBefore: true },
          ],
        };
      case 'SUBJECT_TEACHER':
      case 'teacher':
        return {
          displayName: 'Subject Teacher',
          subtitle: 'Prof. Anjali Sharma',
          navItems: [
            { id: 'dashboard', label: 'Teacher Dashboard', icon: 'dashboard' },
            { id: 'timetable', label: 'My Weekly Schedule', icon: 'calendar_today' },
            { id: 'current-next', label: 'NOW / NEXT Lecture', icon: 'timelapse' },
            { id: 'attendance', label: 'Take Attendance', icon: 'fact_check' },
            { id: 'lecture-history', label: 'Lecture History', icon: 'history' },
            { id: 'reports', label: 'Subject Performance', icon: 'insights' },
            { id: 'notifications', label: 'Notifications', icon: 'notifications', badge: unreadNotificationsCount },
            { id: 'profile', label: 'Faculty Profile', icon: 'person', dividerBefore: true },
          ],
        };
      case 'STUDENT':
      case 'student':
      default:
        return {
          displayName: 'Student Portal',
          subtitle: 'Aryan Sharma (TE CSD-A)',
          navItems: [
            { id: 'dashboard', label: 'Student Dashboard', icon: 'dashboard' },
            { id: 'timetable', label: 'My Timetable', icon: 'calendar_today' },
            { id: 'current-next', label: 'Current / Next Lecture', icon: 'timelapse' },
            { id: 'attendance', label: 'Subject Attendance', icon: 'fact_check' },
            { id: 'notifications', label: 'Announcements', icon: 'notifications', badge: unreadNotificationsCount },
            { id: 'profile', label: 'My Profile & Year', icon: 'person', dividerBefore: true },
          ],
        };
    }
  };

  const { displayName, subtitle, navItems } = getRoleInfo(currentRole);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#17151C]/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 h-full w-[260px] border-r border-[#E8E4EE] bg-[#FFFFFF] text-[#17151C] flex flex-col py-5 z-50 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shadow-[2px_0_12px_rgba(23,21,28,0.03)]`}
      >
        {/* Brand Header */}
        <div className="px-5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D3DE8] to-[#4C1D95] text-white flex items-center justify-center font-bold text-xl shadow-[0_4px_12px_rgba(109,61,232,0.25)]">
              <span className="material-symbols-outlined text-[22px]">school</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-manrope text-[20px] font-extrabold tracking-tight text-[#17151C] leading-none">
                  DOT
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#F3EEFF] text-[#6D3DE8] rounded border border-[#E0D4FC]">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#6B6875] mt-1">Decision of Teacher</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            id="close-mobile-sidebar-btn"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-[#6B6875] hover:bg-[#F3EEFF] hover:text-[#17151C] transition-colors"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Role Quick Selector Badge */}
        <div className="px-3.5 mb-3">
          <button
            id="sidebar-role-dropdown-btn"
            onClick={onOpenRoleSwitcher}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl hover:border-[#6D3DE8]/40 hover:bg-[#F3EEFF]/50 transition-all text-left group"
          >
            <div className="min-w-0 flex-1 mr-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6D3DE8]" />
                <span className="block text-[10px] font-bold tracking-wider text-[#6D3DE8] uppercase">
                  Active Portal
                </span>
              </div>
              <span className="block text-[13px] text-[#17151C] font-bold mt-0.5 truncate font-manrope">
                {displayName}
              </span>
              <span className="block text-[11px] text-[#6B6875] truncate">
                {subtitle}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#6B6875] group-hover:text-[#6D3DE8] text-[20px] shrink-0 transition-colors">
              swap_horiz
            </span>
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto font-medium text-[13px] px-3 space-y-0.5">
          <ul className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <React.Fragment key={item.id}>
                  {item.dividerBefore && <li className="my-2 border-t border-[#E8E4EE] mx-2" />}
                  <li>
                    <button
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left text-[13px] ${
                        isActive
                          ? 'bg-[#F3EEFF] text-[#6D3DE8] font-bold shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C] hover:bg-[#FDF7FF]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] transition-colors ${
                          isActive ? 'text-[#6D3DE8]' : 'text-[#6B6875]'
                        }`}
                        style={{
                          fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className="bg-[#6D3DE8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Role Switcher Button */}
        <div className="px-3.5 mt-auto pt-3 border-t border-[#E8E4EE] flex flex-col gap-2">
          <button
            id="sidebar-role-switcher-cta"
            onClick={onOpenRoleSwitcher}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC] rounded-xl text-[12px] font-bold border border-[#E0D4FC] transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            Switch Active Role
          </button>
          <p className="text-[10px] text-[#6B6875] text-center font-medium">
            TechNova Institute • DOT System
          </p>
        </div>
      </aside>
    </>
  );
};
