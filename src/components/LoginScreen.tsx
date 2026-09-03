import React, { useState } from 'react';
import { UserRole } from '../types';
import { academicStore } from '../data/academicStore';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CLASS_TEACHER');
  
  // Sign In State
  const [email, setEmail] = useState('anjali.sharma@technova.edu');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Modals
  const [showTermsModal, setShowTermsModal] = useState<'terms' | 'privacy' | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Register State
  const [registerRole, setRegisterRole] = useState<'college' | 'teacher' | 'student'>('teacher');
  const [regCollegeName, setRegCollegeName] = useState('TechNova Institute of Technology');
  const [regCollegeCode, setRegCollegeCode] = useState('TECH-2026');
  const [regUniversity, setRegUniversity] = useState('State Technological University');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regEmpOrRoll, setRegEmpOrRoll] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Design');
  const [regClass, setRegClass] = useState('TE CSD-A');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    switch (role) {
      case 'COLLEGE_ADMIN':
      case 'admin':
        setEmail('evelyn.carter@technova.edu');
        break;
      case 'HOD':
        setEmail('rahul.deshmukh@technova.edu');
        break;
      case 'CLASS_TEACHER':
        setEmail('anjali.sharma@technova.edu');
        break;
      case 'SUBJECT_TEACHER':
      case 'teacher':
        setEmail('rajesh.verma@technova.edu');
        break;
      case 'STUDENT':
      case 'student':
        setEmail('aryan.cs23@technova.edu');
        break;
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (registerRole === 'college') {
      setRegSuccessMessage(`College "${regCollegeName}" successfully registered with code ${regCollegeCode}! You may now sign in as College Admin.`);
      setTimeout(() => {
        setRegSuccessMessage(null);
        setMode('signin');
        handleRoleSelect('COLLEGE_ADMIN');
      }, 2500);
      return;
    }

    if (registerRole === 'teacher') {
      academicStore.addApprovalRequest({
        name: regName || 'Dr. New Faculty',
        email: regEmail || 'faculty.new@technova.edu',
        roleType: 'Teacher Registration',
        departmentOrYear: regDept,
        icon: 'school',
        details: `Emp ID: ${regEmpOrRoll || 'FAC-999'}. Submitted for College Admin verification.`,
      });

      setRegSuccessMessage(`Registration submitted for ${regName || 'Faculty'}! Your account has been sent to College Admin for approval.`);
      setTimeout(() => {
        setRegSuccessMessage(null);
        setMode('signin');
      }, 2500);
      return;
    }

    if (registerRole === 'student') {
      academicStore.addApprovalRequest({
        name: regName || 'New Student',
        email: regEmail || 'student.new@technova.edu',
        roleType: 'Student Registration',
        departmentOrYear: regClass,
        icon: 'person',
        details: `Roll No: ${regEmpOrRoll || 'CS23-041'}, Class: ${regClass}. Submitted for Class Teacher verification.`,
      });

      setRegSuccessMessage(`Registration submitted for ${regName || 'Student'}! Your account has been sent to your Class Teacher (Prof. Anjali) for approval.`);
      setTimeout(() => {
        setRegSuccessMessage(null);
        setMode('signin');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] text-[#17151C] flex overflow-x-hidden font-sans">
      {/* Left Pane: Branding & Visuals (White + Purple) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4C1D95] via-[#3B0764] to-[#2E1065] text-white flex-col justify-between relative overflow-hidden p-8 xl:p-12">
        {/* Subtle Decorative Elements */}
        <div className="absolute inset-0 pattern-bg opacity-10" />
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-[#6D3DE8] rounded-full blur-[140px] opacity-25 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] bg-[#4C1D95] rounded-full blur-[150px] opacity-30 pointer-events-none" />

        <div className="relative z-10 pt-4 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          {/* Brand Header */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D3DE8] text-white flex items-center justify-center font-bold text-2xl shadow-[0_8px_20px_rgba(109,61,232,0.35)]">
              <span className="material-symbols-outlined text-[28px]">school</span>
            </div>
            <div>
              <h1 className="font-manrope text-[32px] font-extrabold tracking-tight text-white leading-none">
                DOT
              </h1>
              <p className="text-[12px] font-semibold text-[#E0D4FC] tracking-wide mt-1">
                Decision of Teacher
              </p>
            </div>
          </div>

          <h2 className="font-manrope text-[30px] font-extrabold text-white mb-4 leading-tight">
            Smarter Academic Operations.
            <br />
            <span className="text-[#E0D4FC]">Better Decisions.</span>
          </h2>

          <p className="text-[15px] text-[#E0D4FC]/90 leading-relaxed mb-8">
            Unified academic governance connecting College Administration, Department HODs, Class Teachers, Subject Teachers, and Students in one intelligent workflow.
          </p>

          {/* Key Value Props */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
              <span className="material-symbols-outlined text-[#E0D4FC] text-[20px] mt-0.5">
                account_tree
              </span>
              <div>
                <p className="text-[13px] font-bold text-white">Hierarchical Governance</p>
                <p className="text-[12px] text-[#E0D4FC]/80">College → Department → HOD → Class Teacher → Subject Teachers → Students</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
              <span className="material-symbols-outlined text-[#E0D4FC] text-[20px] mt-0.5">
                timelapse
              </span>
              <div>
                <p className="text-[13px] font-bold text-white">Live NOW / NEXT Intelligence</p>
                <p className="text-[12px] text-[#E0D4FC]/80">Dynamic timetable tracking, instant attendance taking, and conflict-free rescheduling</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/15">
              <span className="material-symbols-outlined text-[#E0D4FC] text-[20px] mt-0.5">
                cloud_sync
              </span>
              <div>
                <p className="text-[13px] font-bold text-white">Offline-First Attendance</p>
                <p className="text-[12px] text-[#E0D4FC]/80">Take attendance anywhere on campus; sync automatically when connectivity returns</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 flex justify-between items-center w-full max-w-lg mx-auto border-t border-white/15 text-[12px] text-[#E0D4FC]/80">
          <p>© 2026 DOT Academic Systems</p>
          <p className="font-semibold text-white">Academic Year 2026–27</p>
        </div>
      </div>

      {/* Right Pane: Sign In / Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-[#FDF7FF] z-10 overflow-y-auto">
        <div className="w-full max-w-[460px] my-auto py-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6D3DE8] text-white flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
            <div>
              <h1 className="font-manrope text-[24px] font-extrabold text-[#17151C] leading-none">DOT</h1>
              <p className="text-[11px] text-[#6B6875]">Decision of Teacher</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#FFFFFF] border border-[#E8E4EE] rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(23,21,28,0.04)] relative">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#6D3DE8] rounded-t-2xl" />

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#E8E4EE] mb-6">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 pb-3 text-[14px] font-bold transition-all border-b-2 font-manrope ${
                  mode === 'signin'
                    ? 'border-[#6D3DE8] text-[#6D3DE8]'
                    : 'border-transparent text-[#6B6875] hover:text-[#17151C]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 pb-3 text-[14px] font-bold transition-all border-b-2 font-manrope ${
                  mode === 'register'
                    ? 'border-[#6D3DE8] text-[#6D3DE8]'
                    : 'border-transparent text-[#6B6875] hover:text-[#17151C]'
                }`}
              >
                New Registration
              </button>
            </div>

            {/* Success Alert */}
            {regSuccessMessage && (
              <div className="mb-4 p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[#065F46] text-[13px] flex items-start gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] text-[#10B981] mt-0.5">check_circle</span>
                <span>{regSuccessMessage}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-bold text-[#17151C] uppercase tracking-wider">
                      Select Portal to Access
                    </label>
                    <span className="text-[11px] text-[#6D3DE8] font-semibold">1-Click Test</span>
                  </div>

                  {/* 5-Role Preset Grid */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE]">
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('COLLEGE_ADMIN')}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                        selectedRole === 'COLLEGE_ADMIN' || selectedRole === 'admin'
                          ? 'bg-[#6D3DE8] text-white shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C]'
                      }`}
                    >
                      College Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('HOD')}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                        selectedRole === 'HOD'
                          ? 'bg-[#6D3DE8] text-white shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C]'
                      }`}
                    >
                      HOD Dept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('CLASS_TEACHER')}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                        selectedRole === 'CLASS_TEACHER'
                          ? 'bg-[#6D3DE8] text-white shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C]'
                      }`}
                    >
                      Class Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('SUBJECT_TEACHER')}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all ${
                        selectedRole === 'SUBJECT_TEACHER' || selectedRole === 'teacher'
                          ? 'bg-[#6D3DE8] text-white shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C]'
                      }`}
                    >
                      Subject Teacher
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('STUDENT')}
                      className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all col-span-2 ${
                        selectedRole === 'STUDENT' || selectedRole === 'student'
                          ? 'bg-[#6D3DE8] text-white shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C]'
                      }`}
                    >
                      Student Portal (Aryan)
                    </button>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                    Institutional Email ID
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6875] text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@institution.edu"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] focus:outline-none focus:ring-2 focus:ring-[#6D3DE8]/20 focus:border-[#6D3DE8] transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[12px] font-semibold text-[#17151C]">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[12px] font-medium text-[#6D3DE8] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6875] text-[18px]">
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-[#FFFFFF] border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] focus:outline-none focus:ring-2 focus:ring-[#6D3DE8]/20 focus:border-[#6D3DE8] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6875] hover:text-[#17151C]"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    id="remember-me-checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#6D3DE8] focus:ring-[#6D3DE8] border-[#E8E4EE]"
                  />
                  <label htmlFor="remember-me-checkbox" className="ml-2 text-[13px] text-[#6B6875]">
                    Keep me signed in on this workstation
                  </label>
                </div>

                {/* Sign In CTA */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#6D3DE8] hover:bg-[#5416D0] text-white font-bold rounded-xl text-[14px] shadow-[0_4px_14px_rgba(109,61,232,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer font-manrope"
                >
                  <span>Sign In to Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {/* Demo Quick Notice */}
                <div className="p-3 bg-[#F3EEFF] border border-[#E0D4FC] rounded-xl text-[12px] text-[#4C1D95]">
                  <p className="font-bold flex items-center gap-1.5 mb-0.5">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    Instant Academic Access
                  </p>
                  <p className="text-[11px] text-[#6B6875]">
                    Pre-seeded with real college hierarchy data. Click any role button above to enter immediately.
                  </p>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] uppercase tracking-wider mb-2">
                    I am registering as:
                  </label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE]">
                    <button
                      type="button"
                      onClick={() => setRegisterRole('teacher')}
                      className={`py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                        registerRole === 'teacher'
                          ? 'bg-[#6D3DE8] text-white shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C]'
                      }`}
                    >
                      Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('student')}
                      className={`py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                        registerRole === 'student'
                          ? 'bg-[#6D3DE8] text-white shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C]'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('college')}
                      className={`py-1.5 text-[12px] font-bold rounded-lg transition-all ${
                        registerRole === 'college'
                          ? 'bg-[#6D3DE8] text-white shadow-xs'
                          : 'text-[#6B6875] hover:text-[#17151C]'
                      }`}
                    >
                      College
                    </button>
                  </div>
                </div>

                {registerRole === 'college' ? (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                        College / Institution Name
                      </label>
                      <input
                        type="text"
                        required
                        value={regCollegeName}
                        onChange={(e) => setRegCollegeName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                          College Code
                        </label>
                        <input
                          type="text"
                          required
                          value={regCollegeCode}
                          onChange={(e) => setRegCollegeCode(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                          Affiliated University
                        </label>
                        <input
                          type="text"
                          required
                          value={regUniversity}
                          onChange={(e) => setRegUniversity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={registerRole === 'teacher' ? 'e.g. Dr. Ramesh Kulkarni' : 'e.g. Michael Chang'}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                          {registerRole === 'teacher' ? 'Employee ID' : 'Roll Number'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={registerRole === 'teacher' ? 'FAC-882' : 'CS23-041'}
                          value={regEmpOrRoll}
                          onChange={(e) => setRegEmpOrRoll(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                          College Code
                        </label>
                        <input
                          type="text"
                          required
                          value={regCollegeCode}
                          onChange={(e) => setRegCollegeCode(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                          Department
                        </label>
                        <select
                          value={regDept}
                          onChange={(e) => setRegDept(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                        >
                          <option value="Computer Science & Design">Computer Science & Design</option>
                          <option value="Electronics & Telecom">Electronics & Telecom</option>
                          <option value="Mechanical Eng">Mechanical Eng</option>
                          <option value="AI & Data Science">AI & Data Science</option>
                        </select>
                      </div>
                      {registerRole === 'student' && (
                        <div>
                          <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                            Class / Division
                          </label>
                          <select
                            value={regClass}
                            onChange={(e) => setRegClass(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                          >
                            <option value="TE CSD-A">TE CSD-A</option>
                            <option value="TE CSD-B">TE CSD-B</option>
                            <option value="BE ENTC-A">BE ENTC-A</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@technova.edu"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-[#17151C] mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                  />
                </div>

                {/* Approval Notice */}
                <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-[11px] text-[#92400E]">
                  <span className="font-bold">Approval Workflow: </span>
                  {registerRole === 'teacher'
                    ? 'Faculty registrations must be vetted and approved by College Admin before activation.'
                    : registerRole === 'student'
                    ? 'Student registrations are sent directly to the designated Class Teacher for roster verification.'
                    : 'College credentials will receive central administrative authority.'}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#6D3DE8] hover:bg-[#5416D0] text-white font-bold rounded-xl text-[14px] shadow-xs transition-all font-manrope cursor-pointer"
                >
                  Submit Registration Request
                </button>
              </form>
            )}

            {/* Footer Links */}
            <div className="mt-6 pt-4 border-t border-[#E8E4EE] flex justify-between items-center text-[11px] text-[#6B6875]">
              <button
                type="button"
                onClick={() => setShowTermsModal('terms')}
                className="hover:underline hover:text-[#17151C]"
              >
                Institutional Terms
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowTermsModal('privacy')}
                className="hover:underline hover:text-[#17151C]"
              >
                FERPA & Privacy
              </button>
              <span>•</span>
              <span>v2.4.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">Reset Institutional Password</h3>
              <button onClick={() => setShowForgotModal(false)} className="text-[#6B6875]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-4 text-center">
                <span className="material-symbols-outlined text-[48px] text-[#16A34A] mb-2">mark_email_read</span>
                <h4 className="font-bold text-[15px] mb-1">Verification Code Sent</h4>
                <p className="text-[13px] text-[#6B6875] mb-4">
                  A 6-digit OTP and reset link has been dispatched to <strong>{forgotEmail || 'your email'}</strong>.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="px-5 py-2 bg-[#6D3DE8] text-white font-bold rounded-xl text-[13px]"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[13px] text-[#6B6875]">
                  Enter your registered institutional email to receive an authorization code.
                </p>
                <div>
                  <label className="block text-[12px] font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@institution.edu"
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 border border-[#E8E4EE] rounded-xl text-[13px] text-[#6B6875]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setForgotSubmitted(true)}
                    className="px-5 py-2 bg-[#6D3DE8] text-white font-bold rounded-xl text-[13px]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E4EE] shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-manrope text-lg font-bold text-[#17151C]">
                {showTermsModal === 'terms' ? 'Institutional Terms of Service' : 'Student Data Privacy Policy'}
              </h3>
              <button onClick={() => setShowTermsModal(null)} className="text-[#6B6875]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="text-[13px] text-[#6B6875] space-y-3 leading-relaxed">
              <p>
                DOT (Decision of Teacher) is designed exclusively for accredited collegiate and university academic operations.
              </p>
              <p>
                1. <strong>Data Integrity:</strong> All attendance sessions, grades, and timetable logs constitute official academic records under state educational statutes.
              </p>
              <p>
                2. <strong>Role Responsibility:</strong> Faculty members are authorized to record attendance solely for assigned divisions. Misrepresentation of lecture hours is logged for auditing.
              </p>
              <p>
                3. <strong>Confidentiality:</strong> Student contact records and individual attendance metrics are shielded under educational privacy protocols.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E8E4EE] flex justify-end">
              <button
                onClick={() => setShowTermsModal(null)}
                className="px-5 py-2 bg-[#6D3DE8] text-white font-bold rounded-xl text-[13px]"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
