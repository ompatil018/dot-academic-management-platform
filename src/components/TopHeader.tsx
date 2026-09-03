import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserRole } from '../types';

interface TopHeaderProps {
  user: UserProfile;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
  onOpenRoleSwitcher: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount: number;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  onManualSync?: () => void;
  lastSyncedAt?: string;
}

interface RoleConfig {
  role: UserRole;
  label: string;
  shortLabel: string;
  subtitle: string;
  icon: string;
}

const ROLES_LIST: RoleConfig[] = [
  {
    role: 'COLLEGE_ADMIN',
    label: 'College Admin',
    shortLabel: 'Admin',
    subtitle: 'Dr. Evelyn Carter',
    icon: 'domain',
  },
  {
    role: 'HOD',
    label: 'Head of Dept (HOD)',
    shortLabel: 'HOD',
    subtitle: 'Dr. Anjali Kulkarni',
    icon: 'manage_accounts',
  },
  {
    role: 'CLASS_TEACHER',
    label: 'Class Teacher',
    shortLabel: 'Class Teacher',
    subtitle: 'TE CSD-A',
    icon: 'school',
  },
  {
    role: 'SUBJECT_TEACHER',
    label: 'Subject Teacher',
    shortLabel: 'Subject',
    subtitle: 'Prof. Rajesh Verma',
    icon: 'fact_check',
  },
  {
    role: 'STUDENT',
    label: 'Student Portal',
    shortLabel: 'Student',
    subtitle: 'Aarav Joshi (CSD201)',
    icon: 'person',
  },
];

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  currentRole,
  onSelectRole,
  onOpenMobileMenu,
  onOpenNotifications,
  onOpenRoleSwitcher,
  onLogout,
  searchQuery,
  onSearchChange,
  unreadCount,
  isOffline = false,
  onToggleOffline,
  onManualSync,
  lastSyncedAt = 'Just now',
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSyncClick = () => {
    if (isOffline) {
      if (onToggleOffline) onToggleOffline();
      return;
    }
    setIsSyncing(true);
    if (onManualSync) {
      onManualSync();
    }
    setTimeout(() => {
      setIsSyncing(false);
    }, 800);
  };

  const isRoleActive = (r: UserRole, current: UserRole) => {
    if (r === current) return true;
    if (r === 'COLLEGE_ADMIN' && current === 'admin') return true;
    if (r === 'SUBJECT_TEACHER' && current === 'teacher') return true;
    if (r === 'CLASS_TEACHER' && current === 'teacher') return false;
    if (r === 'STUDENT' && current === 'student') return true;
    return false;
  };

  const getRoleDisplayName = (r: UserRole): string => {
    switch (r) {
      case 'COLLEGE_ADMIN':
      case 'admin':
        return 'College Admin';
      case 'HOD':
        return 'Head of Dept (HOD)';
      case 'CLASS_TEACHER':
        return 'Class Teacher (TE CSD-A)';
      case 'SUBJECT_TEACHER':
      case 'teacher':
        return 'Subject Teacher';
      case 'STUDENT':
      case 'student':
        return 'Student Portal';
      default:
        return 'DOT Portal';
    }
  };

  const activeRoleConfig =
    ROLES_LIST.find((r) => isRoleActive(r.role, currentRole)) || ROLES_LIST[2];

  return (
    <header
      id="top-header"
      className="fixed top-0 left-0 right-0 md:left-[260px] h-[72px] border-b border-[#E8E4EE] bg-[#FFFFFF] flex justify-between items-center px-3.5 sm:px-5 lg:px-7 z-40 shadow-[0px_1px_3px_rgba(0,0,0,0.03)]"
    >
      {/* ==================================================
          LEFT: Mobile Menu Toggle, Brand Logo, & Search Bar
         ================================================== */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobileMenu}
          className="md:hidden h-9 w-9 rounded-xl border border-[#E8E4EE] text-[#6B6875] hover:bg-[#F3EEFF] hover:text-[#6D3DE8] flex items-center justify-center transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* DOT branding on mobile */}
        <div className="md:hidden flex items-center gap-1.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6D3DE8] to-[#4C1D95] text-white flex items-center justify-center font-bold text-sm shadow-[0_2px_8px_rgba(109,61,232,0.25)]">
            <span className="material-symbols-outlined text-[18px]">school</span>
          </div>
          <span className="font-extrabold text-lg text-[#17151C] font-manrope tracking-tight">
            DOT
          </span>
        </div>

        {/* Search Input (Hidden on mobile < 640px, responsive width on desktop) */}
        <div className="relative hidden sm:block w-40 md:w-52 lg:w-64 xl:w-72 shrink-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6875] text-[18px] pointer-events-none">
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              currentRole === 'COLLEGE_ADMIN' || currentRole === 'admin'
                ? 'Search courses, faculty...'
                : currentRole === 'HOD'
                ? 'Search classes, faculty...'
                : currentRole === 'CLASS_TEACHER'
                ? 'Search students, roster...'
                : currentRole === 'STUDENT' || currentRole === 'student'
                ? 'Search subjects, schedule...'
                : 'Search DOT system...'
            }
            className="w-full h-9 pl-9 pr-7 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[12.5px] text-[#17151C] placeholder-[#8C8896] focus:outline-none focus:ring-2 focus:ring-[#6D3DE8]/20 focus:border-[#6D3DE8] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B6875] hover:text-[#17151C] p-0.5"
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* ==================================================
          RIGHT: Sync, Notifications, Role Selector, Profile, Sign Out
         ================================================== */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 shrink-0">
        {/* 1. Sync / Offline Status */}
        <button
          id="header-sync-btn"
          onClick={handleSyncClick}
          title={isOffline ? 'Offline Mode Active - Click to reconnect' : `Cloud Synced: ${lastSyncedAt}`}
          className={`h-9 rounded-xl transition-all border flex items-center shrink-0 ${
            isOffline
              ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] animate-pulse px-2.5 sm:px-3 gap-1.5 text-[12px] font-semibold'
              : 'bg-[#F3EEFF] text-[#6D3DE8] hover:bg-[#E0D4FC]/70 border-[#E8E4EE] px-2 sm:px-3 gap-1.5 text-[12px] font-semibold'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[18px] ${
              isSyncing ? 'animate-spin' : isOffline ? 'text-[#B45309]' : 'text-[#6D3DE8]'
            }`}
          >
            {isOffline ? 'cloud_off' : 'sync'}
          </span>
          <span className="hidden sm:inline whitespace-nowrap">
            {isOffline ? 'Offline' : isSyncing ? 'Syncing...' : `Synced: ${lastSyncedAt}`}
          </span>
        </button>

        {/* 2. Notification Bell */}
        <button
          id="header-notifications-btn"
          onClick={onOpenNotifications}
          className="h-9 w-9 rounded-xl border border-[#E8E4EE] bg-white text-[#6B6875] hover:bg-[#F3EEFF] hover:text-[#6D3DE8] hover:border-[#E0D4FC] flex items-center justify-center transition-colors relative shrink-0"
          aria-label="View notifications"
        >
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#DC2626] rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* 3. Role Selector / Role Buttons */}
        {/* Desktop Role Buttons Group (Visible on screens >= 1360px where width is generous) */}
        <div className="hidden min-[1360px]:flex items-center bg-[#F8F6FC] p-0.5 rounded-xl border border-[#E8E4EE] h-9 shrink-0">
          {ROLES_LIST.map((r) => {
            const active = isRoleActive(r.role, currentRole);
            return (
              <button
                key={r.role}
                id={`header-role-btn-${r.role.toLowerCase()}`}
                onClick={() => onSelectRole(r.role)}
                className={`h-[30px] px-2.5 rounded-lg text-[11.5px] font-bold transition-all flex items-center gap-1 ${
                  active
                    ? 'bg-[#6D3DE8] text-white shadow-xs'
                    : 'text-[#6B6875] hover:text-[#17151C] hover:bg-white'
                }`}
              >
                <span>{r.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Tablet & Mobile Role Dropdown Selector (Visible on screens < 1360px) */}
        <div ref={roleMenuRef} className="relative shrink-0 min-[1360px]:hidden">
          <button
            id="header-role-dropdown-btn"
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setProfileMenuOpen(false);
            }}
            className="h-9 px-2 sm:px-3 rounded-xl bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC] hover:bg-[#E0D4FC]/60 transition-colors flex items-center gap-1 sm:gap-1.5 font-bold text-[12px] shadow-xs shrink-0"
            aria-label="Select active role"
          >
            <span className="material-symbols-outlined text-[16px] text-[#6D3DE8] shrink-0">
              {activeRoleConfig.icon}
            </span>
            <span className="truncate max-w-[70px] xs:max-w-[85px] sm:max-w-[120px] whitespace-nowrap">
              {activeRoleConfig.shortLabel}
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#6D3DE8] shrink-0">
              {roleDropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {roleDropdownOpen && (
            <div
              id="header-role-dropdown-menu"
              className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-[0px_10px_30px_rgba(23,21,28,0.12)] border border-[#E8E4EE] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-2 border-b border-[#E8E4EE] flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#6B6875] uppercase tracking-wider">
                  Switch Active Portal
                </p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#F3EEFF] text-[#6D3DE8] rounded">
                  DOT v2.4
                </span>
              </div>
              <div className="py-1">
                {ROLES_LIST.map((r) => {
                  const active = isRoleActive(r.role, currentRole);
                  return (
                    <button
                      key={r.role}
                      id={`dropdown-select-${r.role.toLowerCase()}-btn`}
                      onClick={() => {
                        onSelectRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                        active
                          ? 'bg-[#F3EEFF] text-[#6D3DE8]'
                          : 'text-[#17151C] hover:bg-[#FDF7FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`material-symbols-outlined text-[18px] shrink-0 ${
                            active ? 'text-[#6D3DE8]' : 'text-[#6B6875]'
                          }`}
                        >
                          {r.icon}
                        </span>
                        <div className="truncate">
                          <p
                            className={`text-[13px] font-bold truncate leading-tight ${
                              active ? 'text-[#6D3DE8]' : 'text-[#17151C]'
                            }`}
                          >
                            {r.label}
                          </p>
                          <p className="text-[11px] text-[#6B6875] truncate mt-0.5">{r.subtitle}</p>
                        </div>
                      </div>
                      {active && (
                        <span className="material-symbols-outlined text-[18px] text-[#6D3DE8] shrink-0 ml-1.5">
                          check
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-[#E8E4EE] pt-1 px-1">
                <button
                  id="dropdown-open-full-role-modal-btn"
                  onClick={() => {
                    setRoleDropdownOpen(false);
                    onOpenRoleSwitcher();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-[12px] font-semibold text-[#6D3DE8] hover:bg-[#F3EEFF] flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  Role Overview & Details...
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. User Profile Avatar & Dropdown */}
        <div ref={profileMenuRef} className="relative shrink-0">
          <button
            id="user-profile-menu-btn"
            onClick={() => {
              setProfileMenuOpen(!profileMenuOpen);
              setRoleDropdownOpen(false);
            }}
            className="h-9 px-1 sm:px-2 rounded-xl border border-[#E8E4EE] bg-white hover:bg-[#F3EEFF] hover:border-[#E0D4FC] flex items-center gap-1.5 sm:gap-2 transition-colors shrink-0"
            aria-label="User profile and settings menu"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  user.name
                )}`;
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-[#E8E4EE] shrink-0"
            />
            <span className="hidden xl:block text-[12px] font-bold text-[#17151C] truncate max-w-[85px]">
              {user.name.split(' ')[0]}
            </span>
            <span className="material-symbols-outlined text-[#6B6875] text-[16px] shrink-0">
              {profileMenuOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {profileMenuOpen && (
            <div
              id="profile-dropdown-menu"
              className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-[0px_10px_30px_rgba(23,21,28,0.12)] border border-[#E8E4EE] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-4 py-3 border-b border-[#E8E4EE]">
                <p className="text-[13.5px] font-bold text-[#17151C] truncate font-manrope">
                  {user.name}
                </p>
                <p className="text-[11px] text-[#6B6875] truncate mt-0.5">{user.email}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F3EEFF] text-[#6D3DE8] border border-[#E0D4FC]">
                    {getRoleDisplayName(currentRole)}
                  </span>
                  <span className="text-[10px] text-[#6B6875] font-medium">TechNova</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  id="dropdown-switch-role-btn"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenRoleSwitcher();
                  }}
                  className="w-full px-4 py-2.5 text-left text-[12.5px] text-[#17151C] hover:bg-[#F3EEFF] hover:text-[#6D3DE8] flex items-center gap-2.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#6D3DE8] shrink-0">
                    swap_horiz
                  </span>
                  <div>
                    <p className="font-semibold text-[12.5px]">Switch Role / Portal</p>
                    <p className="text-[10.5px] text-[#6B6875]">Admin, HOD, Teacher, Student</p>
                  </div>
                </button>
              </div>

              <div className="border-t border-[#E8E4EE] pt-1">
                <button
                  id="dropdown-logout-btn"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-2.5 text-left text-[12.5px] text-[#DC2626] hover:bg-[#FEE2E2]/60 flex items-center gap-2 font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] shrink-0">logout</span>
                  Sign Out of DOT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Dedicated Desktop Sign Out Button (Visible on wide screens) */}
        <button
          id="header-signout-btn"
          onClick={onLogout}
          title="Sign Out of DOT"
          className="hidden xl:flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[#FECACA] bg-white hover:bg-[#FEF2F2] text-[#DC2626] text-[12px] font-bold shrink-0 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};


