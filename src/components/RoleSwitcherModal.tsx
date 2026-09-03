import React from 'react';
import { UserRole } from '../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onLogout,
}) => {
  if (!isOpen) return null;

  const roles: {
    role: UserRole;
    title: string;
    person: string;
    desc: string;
    icon: string;
    badge: string;
    avatar: string;
  }[] = [
    {
      role: 'COLLEGE_ADMIN',
      title: 'College Admin Portal',
      person: 'Dr. Evelyn Carter (Dean)',
      desc: 'Institutional KPIs, Courses, Classes, Faculty directory, approving registrations & assigning HODs.',
      icon: 'domain',
      badge: 'Role 1',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      role: 'HOD',
      title: 'Head of Department (HOD)',
      person: 'Prof. Rahul Deshmukh',
      desc: 'Department classes, faculty allocation, curriculum, assigning Class Teachers & academic year review.',
      icon: 'manage_accounts',
      badge: 'Role 2',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      role: 'CLASS_TEACHER',
      title: 'Class Teacher Portal',
      person: 'Prof. Anjali Sharma (TE CSD-A)',
      desc: 'Master timetable editing, student approvals, class attendance analytics, daily & monthly reports.',
      icon: 'school',
      badge: 'Role 3',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      role: 'SUBJECT_TEACHER',
      title: 'Subject Teacher Portal',
      person: 'Prof. Rajesh Verma / Anjali',
      desc: 'Active lecture management, rapid attendance taking, conflict detection, lecture history & grading.',
      icon: 'fact_check',
      badge: 'Role 4',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      role: 'STUDENT',
      title: 'Student Portal',
      person: 'Aryan Sharma (CS23-003)',
      desc: 'Live NOW/NEXT lecture tracker, independent subject-wise attendance (92%, 84%, 76%, 95%) & schedule.',
      icon: 'person',
      badge: 'Role 5',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const isRoleMatching = (itemRole: UserRole, current: UserRole) => {
    if (itemRole === current) return true;
    if (itemRole === 'COLLEGE_ADMIN' && current === 'admin') return true;
    if (itemRole === 'SUBJECT_TEACHER' && current === 'teacher') return true;
    if (itemRole === 'CLASS_TEACHER' && current === 'teacher') return false;
    if (itemRole === 'STUDENT' && current === 'student') return true;
    return false;
  };

  return (
    <div
      id="role-switcher-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#17151C]/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
    >
      <div
        id="role-switcher-modal-card"
        className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#E8E4EE] shadow-[0_20px_50px_rgba(23,21,28,0.15)] overflow-hidden"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6D3DE8] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </div>
            <div>
              <h3 className="font-manrope text-xl font-bold text-[#17151C]">Switch DOT Portal</h3>
              <p className="text-[12px] text-[#6B6875]">
                Switch between institutional roles with dedicated permissions and views
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B6875] hover:text-[#17151C] p-1.5 rounded-lg hover:bg-[#F3EEFF] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-2.5 my-4 max-h-[62vh] overflow-y-auto pr-1">
          {roles.map((item) => {
            const isSelected = isRoleMatching(item.role, currentRole);
            return (
              <button
                key={item.role}
                id={`switch-to-${item.role.toLowerCase()}-btn`}
                onClick={() => {
                  onSelectRole(item.role);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-[#6D3DE8] bg-[#F3EEFF] ring-2 ring-[#6D3DE8]/20 shadow-xs'
                    : 'border-[#E8E4EE] bg-white hover:bg-[#FDF7FF] hover:border-[#6D3DE8]/50'
                }`}
              >
                <img
                  src={item.avatar}
                  alt={item.person}
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.person)}`;
                  }}
                  className="w-10 h-10 rounded-full object-cover border border-[#E8E4EE] mt-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-[14px] font-bold text-[#17151C] leading-tight font-manrope truncate">
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-[#6D3DE8] text-white'
                          : 'bg-[#FDF7FF] text-[#6B6875] border border-[#E8E4EE]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-[#6D3DE8] mt-0.5 truncate">{item.person}</p>
                  <p className="text-[12px] text-[#6B6875] mt-1 leading-snug line-clamp-2">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#E8E4EE] flex items-center justify-between text-[12px]">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="text-[#DC2626] hover:underline font-semibold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out to Login Screen
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] hover:bg-[#F3EEFF] hover:text-[#17151C] rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
