export type UserRole = 
  | 'COLLEGE_ADMIN'
  | 'HOD'
  | 'CLASS_TEACHER'
  | 'SUBJECT_TEACHER'
  | 'STUDENT'
  | 'admin'
  | 'teacher'
  | 'student';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roles?: UserRole[];
  title: string;
  department?: string;
  avatarUrl: string;
  email: string;
  institution: string;
  employeeId?: string;
  rollNumber?: string;
  assignedClass?: string;
  assignedSubjects?: string[];
  mobile?: string;
  isActive?: boolean;
}

export interface College {
  id: string;
  name: string;
  code: string;
  university: string;
  address: string;
  email: string;
  mobile: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  hodId: string;
  hodName: string;
  totalClasses: number;
  totalStudents?: number;
  totalTeachers?: number;
  avgAttendance: number;
  status: 'healthy' | 'review' | 'critical';
  color: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  employeeId: string;
  courseId: string;
  courseName: string;
  title: string;
  avatar: string;
  isHod?: boolean;
  assignedSubjects?: string[];
  assignedClass?: string;
  weeklyLecturesCount?: number;
}

export interface CourseOverviewItem extends Course {}

export interface CollegeClass {
  id: string;
  name: string; // e.g. 'TE CSD-A'
  courseId: string;
  division: string;
  classTeacherId: string;
  classTeacherName: string;
  totalStudents: number;
  roomDefault: string;
  academicYear: string;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  courseId: string;
  type: 'Theory' | 'Practical' | 'Tutorial';
  credits: number;
  assignedTeacherId: string;
  assignedTeacherName: string;
}

export interface StudentProfile {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  mobile: string;
  classId: string;
  className: string;
  avatar: string;
  academicYear: string;
  status: 'active' | 'pending' | 'suspended';
  percentage?: number;
  subjectAttendance: Record<string, { attended: number; total: number; percent: number }>;
}

export interface ConflictAlert {
  type: string;
  title?: string;
  message: string;
  conflictingLecture?: TimetableLecture;
}

export interface LectureHistoryItem {
  id: string;
  date: string;
  subject: string;
  subjectId?: string;
  class: string;
  classId?: string;
  teacherId?: string;
  teacherName?: string;
  attendancePercent: number;
  presentCount: number;
  totalCount: number;
  room?: string;
  time?: string;
  syncedOffline?: boolean;
  status?: 'completed' | 'cancelled' | 'substitute';
  substituteTeacher?: string;
  notes?: string;
}

export interface StudentAttendanceEntry {
  id: string;
  rollNo: string;
  name: string;
  avatar: string;
  status: 'present' | 'absent' | 'late';
  percentage?: number;
}

export interface ApprovalRequest {
  id: string;
  name: string;
  email?: string;
  roleType: 'Teacher Registration' | 'Student Registration' | 'Course Change' | 'Leave Request' | 'Grade Re-evaluation';
  departmentOrYear: string;
  targetClassId?: string;
  icon: 'school' | 'person' | 'swap_horiz' | 'event_busy';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  details?: string;
}

export interface TimetableLecture {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string; // e.g. '10:00 AM'
  endTime: string; // e.g. '11:00 AM'
  subject: string;
  code?: string;
  subjectId?: string;
  teacher: string;
  teacherId?: string;
  room: string;
  classId: string;
  className: string;
  type: 'Lecture' | 'Lab' | 'Break' | 'Tutorial';
  active?: boolean;
}

export interface ScheduleEvent extends TimetableLecture {}

export interface NotificationItem {
  id: string;
  type: 'alert' | 'info' | 'graded' | 'reminder' | 'timetable' | 'attendance';
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
  targetRole?: UserRole;
  actionUrl?: string;
  timestamp?: number;
}

export interface OfflineSyncItem {
  id: string;
  type: 'attendance' | 'timetable' | 'approval';
  payload: any;
  createdAt: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}

export interface AttendanceSession {
  id: string;
  date: string;
  subject: string;
  subjectId: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  room: string;
  time: string;
  presentCount: number;
  absentCount: number;
  totalCount: number;
  attendancePercent: number;
  status: 'completed' | 'in_progress' | 'cancelled' | 'substitute';
  substituteTeacher?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

