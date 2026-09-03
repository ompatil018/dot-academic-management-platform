import {
  UserProfile,
  UserRole,
  College,
  Course,
  CollegeClass,
  SubjectItem,
  StudentProfile,
  TeacherProfile,
  StudentAttendanceEntry,
  LectureHistoryItem,
  TimetableLecture,
  ApprovalRequest,
  NotificationItem,
  OfflineSyncItem,
  ConflictAlert,
} from '../types';
import {
  SEED_COURSES,
  SEED_CLASSES,
  SEED_CSD_SUBJECTS,
  SEED_TEACHERS,
  SEED_STUDENTS_ROSTER_TE_CSD_A,
  SEED_ALL_STUDENTS,
  SEED_TIMETABLE_TE_CSD_A,
  SEED_30DAY_LECTURE_HISTORY,
  SEED_APPROVALS,
  SEED_NOTIFICATIONS,
} from './seedGenerator';

// Storage key for persistence with seeded records
const STORAGE_KEY = 'DOT_ACADEMIC_STORE_V4_DEMO';

export const INITIAL_COLLEGE: College = {
  id: 'col-01',
  name: 'TechNova Institute of Technology',
  code: 'TECH-2026',
  university: 'State Technological University',
  address: 'Innovation Campus, Academic Boulevard, Pune 411045',
  email: 'academic.dean@technova.edu',
  mobile: '+91 98230 45678',
};

export const PRESET_USERS: Record<string, UserProfile> = {
  admin: {
    id: 'user-admin',
    name: 'Dr. Evelyn Carter',
    role: 'COLLEGE_ADMIN',
    roles: ['COLLEGE_ADMIN'],
    title: 'Dean of Academic Affairs',
    department: 'Central Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'evelyn.carter@technova.edu',
    institution: 'TechNova Institute of Technology',
    employeeId: 'ADM-001',
    mobile: '+91 98001 11222',
  },
  hod: {
    id: 'teacher-csd-hod',
    name: 'Dr. Anjali Kulkarni',
    role: 'HOD',
    roles: ['HOD', 'SUBJECT_TEACHER'],
    title: 'Head of Department (CSD)',
    department: 'Department of Computer Science & Design',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'anjali.kulkarni@technova.edu',
    institution: 'TechNova Institute of Technology',
    employeeId: 'HOD-CSD-01',
    assignedSubjects: ['Operating Systems', 'Artificial Intelligence'],
    mobile: '+91 98002 22333',
  },
  classTeacher: {
    id: 'teacher-csd-5',
    name: 'Prof. Anjali Sharma',
    role: 'CLASS_TEACHER',
    roles: ['CLASS_TEACHER', 'SUBJECT_TEACHER'],
    title: 'Associate Professor & Class Teacher (TE CSD-A)',
    department: 'Department of Computer Science & Design',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'anjali.sharma@technova.edu',
    institution: 'TechNova Institute of Technology',
    employeeId: 'FAC-CSD-204',
    assignedClass: 'TE CSD-A',
    assignedSubjects: ['Data Structures', 'Computer Networks'],
    mobile: '+91 98003 33444',
  },
  subjectTeacher: {
    id: 'teacher-csd-6',
    name: 'Prof. Rajesh Verma',
    role: 'SUBJECT_TEACHER',
    roles: ['SUBJECT_TEACHER'],
    title: 'Assistant Professor',
    department: 'Department of Computer Science & Design',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'rajesh.verma@technova.edu',
    institution: 'TechNova Institute of Technology',
    employeeId: 'FAC-CSD-312',
    assignedSubjects: ['Database Management Systems', 'Web Technology'],
    mobile: '+91 98004 44555',
  },
  student: {
    id: 'stud-te-csd-1',
    name: 'Aarav Joshi',
    role: 'STUDENT',
    roles: ['STUDENT'],
    title: 'B.Tech CSD (3rd Year, TE CSD-A)',
    department: 'Computer Science & Design - Division A',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    email: 'aarav.joshi.csd201@technova.edu.in',
    institution: 'TechNova Institute of Technology',
    rollNumber: 'CSD201',
    assignedClass: 'TE CSD-A',
    mobile: '+91 98005 55666',
  },
};

export const INITIAL_COURSES: Course[] = SEED_COURSES;
export const INITIAL_CLASSES: CollegeClass[] = SEED_CLASSES;
export const INITIAL_SUBJECTS: SubjectItem[] = SEED_CSD_SUBJECTS;
export const INITIAL_STUDENTS_ROSTER: StudentAttendanceEntry[] = SEED_STUDENTS_ROSTER_TE_CSD_A;
export const INITIAL_TIMETABLE: TimetableLecture[] = SEED_TIMETABLE_TE_CSD_A;
export const INITIAL_LECTURE_HISTORY: LectureHistoryItem[] = SEED_30DAY_LECTURE_HISTORY;
export const INITIAL_APPROVALS: ApprovalRequest[] = SEED_APPROVALS;
export const INITIAL_NOTIFICATIONS: NotificationItem[] = SEED_NOTIFICATIONS;
export const INITIAL_TEACHERS: TeacherProfile[] = SEED_TEACHERS;
export const INITIAL_ALL_STUDENTS: StudentProfile[] = SEED_ALL_STUDENTS;

export interface AcademicStoreState {
  college: College;
  courses: Course[];
  classes: CollegeClass[];
  subjects: SubjectItem[];
  teachers: TeacherProfile[];
  students: StudentProfile[];
  studentsRoster: StudentAttendanceEntry[];
  timetable: TimetableLecture[];
  lectureHistory: LectureHistoryItem[];
  approvals: ApprovalRequest[];
  notifications: NotificationItem[];
  isOffline: boolean;
  offlineQueue: OfflineSyncItem[];
  lastSyncedAt: string;
  activeAcademicYear: string;
  appVersion: {
    current: string;
    updateAvailable: boolean;
    whatsNew: string[];
  };
}

class AcademicStore {
  private state: AcademicStoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AcademicStoreState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          college: parsed?.college || INITIAL_COLLEGE,
          courses: Array.isArray(parsed?.courses) && parsed.courses.length > 0 ? parsed.courses : INITIAL_COURSES,
          classes: Array.isArray(parsed?.classes) && parsed.classes.length > 0 ? parsed.classes : INITIAL_CLASSES,
          subjects: Array.isArray(parsed?.subjects) && parsed.subjects.length > 0 ? parsed.subjects : INITIAL_SUBJECTS,
          teachers: Array.isArray(parsed?.teachers) && parsed.teachers.length > 0 ? parsed.teachers : INITIAL_TEACHERS,
          students: Array.isArray(parsed?.students) && parsed.students.length > 0 ? parsed.students : INITIAL_ALL_STUDENTS,
          studentsRoster: Array.isArray(parsed?.studentsRoster) && parsed.studentsRoster.length > 0 ? parsed.studentsRoster : INITIAL_STUDENTS_ROSTER,
          timetable: Array.isArray(parsed?.timetable) && parsed.timetable.length > 0 ? parsed.timetable : INITIAL_TIMETABLE,
          lectureHistory: Array.isArray(parsed?.lectureHistory) && parsed.lectureHistory.length > 0 ? parsed.lectureHistory : INITIAL_LECTURE_HISTORY,
          approvals: Array.isArray(parsed?.approvals) && parsed.approvals.length > 0 ? parsed.approvals : INITIAL_APPROVALS,
          notifications: Array.isArray(parsed?.notifications) && parsed.notifications.length > 0 ? parsed.notifications : INITIAL_NOTIFICATIONS,
          offlineQueue: Array.isArray(parsed?.offlineQueue) ? parsed.offlineQueue : [],
          lastSyncedAt: parsed?.lastSyncedAt || 'Just now',
          activeAcademicYear: parsed?.activeAcademicYear || '2026–27',
          appVersion: parsed?.appVersion || {
            current: '2.4.0',
            updateAvailable: false,
            whatsNew: [],
          },
          isOffline: false,
        };
      }
    } catch (e) {
      console.warn('Failed to load DOT academic store from localStorage', e);
    }

    return {
      college: INITIAL_COLLEGE,
      courses: INITIAL_COURSES,
      classes: INITIAL_CLASSES,
      subjects: INITIAL_SUBJECTS,
      teachers: INITIAL_TEACHERS,
      students: INITIAL_ALL_STUDENTS,
      studentsRoster: INITIAL_STUDENTS_ROSTER,
      timetable: INITIAL_TIMETABLE,
      lectureHistory: INITIAL_LECTURE_HISTORY,
      approvals: INITIAL_APPROVALS,
      notifications: INITIAL_NOTIFICATIONS,
      isOffline: false,
      offlineQueue: [],
      lastSyncedAt: 'Just now',
      activeAcademicYear: '2026–27',
      appVersion: {
        current: '2.4.0',
        updateAvailable: false,
        whatsNew: [
          'Full TechNova 2026–27 complete demo dataset seeded (1248 students, 86 teachers, 6 courses, 32 classes)',
          'All dashboards dynamically connected to database state',
          'Live dynamic NOW/NEXT calculation from calendar schedule',
          'Offline attendance recording with automatic sync queue',
        ],
      },
    };
  }

  public getState(): AcademicStoreState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist DOT state', e);
    }
  }

  // --- Offline & Sync Actions ---
  public setOfflineMode(isOffline: boolean) {
    this.state.isOffline = isOffline;
    if (!isOffline && this.state.offlineQueue.length > 0) {
      this.syncOfflineQueue();
    } else {
      this.notify();
    }
  }

  public syncOfflineQueue() {
    this.state.lastSyncedAt = 'Syncing...';
    this.notify();

    setTimeout(() => {
      // Process pending queue items
      this.state.offlineQueue = [];
      this.state.lastSyncedAt = 'Just now';
      this.notify();
    }, 1000);
  }

  // --- Conflict Detection ---
  public checkTimetableConflict(
    newLecture: Omit<TimetableLecture, 'id'>,
    excludeId?: string
  ): ConflictAlert | null {
    const dayLectures = this.state.timetable.filter(
      (l) => l.day === newLecture.day && l.id !== excludeId
    );

    for (const lec of dayLectures) {
      if (lec.time === newLecture.time) {
        // Teacher Conflict
        if (
          newLecture.teacherId &&
          lec.teacherId === newLecture.teacherId &&
          newLecture.type !== 'Break' &&
          lec.type !== 'Break'
        ) {
          return {
            type: 'teacher',
            title: 'Schedule Conflict',
            message: `Professor ${newLecture.teacher} is already assigned to ${lec.subject} (${lec.className}) at ${lec.time}.`,
            conflictingLecture: lec,
          };
        }

        // Room Conflict
        if (
          newLecture.room &&
          newLecture.room !== 'Campus Commons' &&
          lec.room.toLowerCase().trim() === newLecture.room.toLowerCase().trim() &&
          newLecture.type !== 'Break' &&
          lec.type !== 'Break'
        ) {
          return {
            type: 'room',
            title: 'Room Conflict',
            message: `${newLecture.room} is already booked for ${lec.subject} (${lec.className}) at ${lec.time}.`,
            conflictingLecture: lec,
          };
        }

        // Class Conflict
        if (
          lec.classId === newLecture.classId &&
          newLecture.type !== 'Break' &&
          lec.type !== 'Break'
        ) {
          return {
            type: 'class',
            title: 'Class Slot Conflict',
            message: `Class ${newLecture.className} already has ${lec.subject} scheduled at ${lec.time}.`,
            conflictingLecture: lec,
          };
        }
      }
    }

    return null;
  }

  // --- Timetable Actions ---
  public addTimetableLecture(lecture: Omit<TimetableLecture, 'id'>): { success: boolean; conflict?: ConflictAlert } {
    const conflict = this.checkTimetableConflict(lecture);
    if (conflict) {
      return { success: false, conflict };
    }

    const newId = `lec-${Date.now()}`;
    const fullLecture: TimetableLecture = { ...lecture, id: newId };
    this.state.timetable.push(fullLecture);

    // Add notification
    this.addNotification({
      type: 'timetable',
      title: 'Timetable Updated',
      message: `New lecture added: ${lecture.subject} on ${lecture.day} at ${lecture.time} (${lecture.room}).`,
      timeAgo: 'Just now',
      unread: true,
    });

    this.notify();
    return { success: true };
  }

  public updateTimetableLecture(id: string, updates: Partial<TimetableLecture>): { success: boolean; conflict?: ConflictAlert } {
    const lecture = this.state.timetable.find((l) => l.id === id);
    if (!lecture) return { success: false };

    const oldRoom = lecture.room;
    const oldTime = lecture.time;

    Object.assign(lecture, updates);

    const changes: string[] = [];
    if (updates.room && updates.room !== oldRoom) changes.push(`room changed from ${oldRoom} to ${updates.room}`);
    if (updates.time && updates.time !== oldTime) changes.push(`time changed from ${oldTime} to ${updates.time}`);

    this.addNotification({
      type: 'timetable',
      title: `Timetable Updated: ${lecture.subject}`,
      message: `${lecture.subject} (${lecture.className}) ${changes.join(' and ') || 'slot updated'}. Room: ${lecture.room}, Time: ${lecture.time}.`,
      timeAgo: 'Just now',
      unread: true,
    });

    this.notify();
    return { success: true };
  }

  public deleteTimetableLecture(id: string) {
    const removed = this.state.timetable.find((l) => l.id === id);
    this.state.timetable = this.state.timetable.filter((l) => l.id !== id);
    if (removed) {
      this.addNotification({
        type: 'timetable',
        title: 'Lecture Cancelled',
        message: `${removed.subject} on ${removed.day} at ${removed.time} was removed from the schedule.`,
        timeAgo: 'Just now',
        unread: true,
      });
    }
    this.notify();
  }

  // --- Attendance Actions ---
  public recordAttendance(params: {
    subject: string;
    classId: string;
    className: string;
    room: string;
    time: string;
    teacherName: string;
    updatedRoster: StudentAttendanceEntry[];
  }) {
    const presentCount = params.updatedRoster.filter((s) => s.status === 'present').length;
    const totalCount = params.updatedRoster.length;
    const attendancePercent = Math.round((presentCount / totalCount) * 100 * 10) / 10;

    const newSession: LectureHistoryItem = {
      id: `lh-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      subject: params.subject,
      class: params.className,
      attendancePercent,
      presentCount,
      totalCount,
      room: params.room,
      time: params.time,
      teacherName: params.teacherName,
      syncedOffline: this.state.isOffline,
      status: 'completed',
    };

    if (this.state.isOffline) {
      this.state.offlineQueue.push({
        id: `offline-${Date.now()}`,
        type: 'attendance',
        payload: newSession,
        createdAt: Date.now(),
        status: 'pending',
      });
    }

    // Prepend to history
    this.state.lectureHistory.unshift(newSession);

    // Update students roster status and individual attendance %
    this.state.studentsRoster = this.state.studentsRoster.map((s) => {
      const match = params.updatedRoster.find((item) => item.id === s.id);
      if (match) {
        // adjust overall percentage
        const currentPct = s.percentage || 85;
        const newPct = match.status === 'present' ? Math.min(100, currentPct + 0.5) : Math.max(40, currentPct - 1.2);
        return {
          ...s,
          status: match.status,
          percentage: Math.round(newPct * 10) / 10,
        };
      }
      return s;
    });

    // Notify low attendance students if below 75%
    const lowAttendanceList = this.state.studentsRoster.filter((s) => (s.percentage || 100) < 75);
    if (lowAttendanceList.length > 0) {
      this.addNotification({
        type: 'alert',
        title: `Low Attendance Warning (${lowAttendanceList.length} Students)`,
        message: `${lowAttendanceList.slice(0, 3).map((s) => s.name).join(', ')} currently below 75% requirement.`,
        timeAgo: 'Just now',
        unread: true,
      });
    }

    this.notify();
  }

  public updateStudentsRoster(updatedRoster: StudentAttendanceEntry[]) {
    this.state.studentsRoster = [...updatedRoster];
    this.notify();
  }

  // --- Lecture History / Log Actions ---
  public addLectureLog(item: LectureHistoryItem) {
    this.state.lectureHistory.unshift(item);
    this.addNotification({
      type: 'info',
      title: `Daily Lecture Logged: ${item.subject}`,
      message: `${item.subject} (${item.class}) by ${item.teacherName || 'Faculty'}. Attendance: ${item.attendancePercent}% (${item.presentCount}/${item.totalCount}).`,
      timeAgo: 'Just now',
      unread: true,
    });
    this.notify();
  }

  public updateLectureLog(id: string, updates: Partial<LectureHistoryItem>) {
    const item = this.state.lectureHistory.find((l) => l.id === id);
    if (item) {
      Object.assign(item, updates);
      this.notify();
    }
  }

  public deleteLectureLog(id: string) {
    this.state.lectureHistory = this.state.lectureHistory.filter((l) => l.id !== id);
    this.notify();
  }
  public approveRequest(id: string) {
    const req = this.state.approvals.find((a) => a.id === id);
    if (req) {
      req.status = 'approved';

      if (req.roleType === 'Student Registration') {
        // Add student to roster
        const newRollNo = `CSD${200 + this.state.studentsRoster.length + 1}`;
        this.state.studentsRoster.push({
          id: `s-${Date.now()}`,
          rollNo: newRollNo,
          name: req.name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(req.name)}`,
          status: 'present',
          percentage: 100,
        });

        // Update class and course total
        const targetClass = this.state.classes.find((c) => c.id === 'class-csd-a' || c.id === 'class-csd-te-a');
        if (targetClass) targetClass.totalStudents += 1;
        const targetCourse = this.state.courses.find((c) => c.id === 'course-csd');
        if (targetCourse && targetCourse.totalStudents) targetCourse.totalStudents += 1;
      }

      this.addNotification({
        type: 'info',
        title: 'Request Approved',
        message: `${req.roleType} for ${req.name} was approved.`,
        timeAgo: 'Just now',
        unread: true,
      });

      this.notify();
    }
  }

  public rejectRequest(id: string) {
    const req = this.state.approvals.find((a) => a.id === id);
    if (req) {
      req.status = 'rejected';
      this.addNotification({
        type: 'info',
        title: 'Request Rejected',
        message: `${req.roleType} for ${req.name} was rejected.`,
        timeAgo: 'Just now',
        unread: false,
      });
      this.notify();
    }
  }

  public addApprovalRequest(req: Omit<ApprovalRequest, 'id' | 'status' | 'submittedAt'>) {
    const newReq: ApprovalRequest = {
      ...req,
      id: `appr-${Date.now()}`,
      status: 'pending',
      submittedAt: 'Just now',
    };
    this.state.approvals.unshift(newReq);
    this.addNotification({
      type: 'info',
      title: `New ${req.roleType}`,
      message: `${req.name} submitted a registration request for ${req.departmentOrYear}.`,
      timeAgo: 'Just now',
      unread: true,
    });
    this.notify();
  }

  // --- Courses & HOD Management ---
  public addCourse(course: Omit<Course, 'id'>) {
    const newCourse: Course = {
      ...course,
      id: `course-${Date.now()}`,
    };
    this.state.courses.push(newCourse);
    this.notify();
  }

  public updateCourseHod(courseId: string, hodName: string) {
    const course = this.state.courses.find((c) => c.id === courseId);
    if (course) {
      course.hodName = hodName;
      this.addNotification({
        type: 'info',
        title: 'HOD Reassigned',
        message: `${hodName} was appointed as HOD for ${course.name}.`,
        timeAgo: 'Just now',
        unread: true,
      });
      this.notify();
    }
  }

  public updateClassTeacher(classId: string, teacherName: string) {
    const cls = this.state.classes.find((c) => c.id === classId);
    if (cls) {
      cls.classTeacherName = teacherName;
      this.addNotification({
        type: 'info',
        title: 'Class Teacher Assigned',
        message: `${teacherName} was assigned as Class Teacher for ${cls.name}.`,
        timeAgo: 'Just now',
        unread: true,
      });
      this.notify();
    }
  }

  // --- Notifications ---
  public addNotification(notif: Omit<NotificationItem, 'id'>) {
    this.state.notifications.unshift({
      ...notif,
      id: `notif-${Date.now()}`,
    });
    this.notify();
  }

  public markAllNotificationsRead() {
    this.state.notifications.forEach((n) => (n.unread = false));
    this.notify();
  }

  public clearAllNotifications() {
    this.state.notifications = [];
    this.notify();
  }

  // --- Dynamic Live NOW / NEXT Calculation ---
  public getNowAndNextLecture(
    day: string = 'Monday',
    timeSlot: string = '10:00 AM'
  ): { now: TimetableLecture | null; next: TimetableLecture | null } {
    const dayLectures = this.state.timetable.filter((l) => l.day === day && l.type !== 'Break');
    const currentIndex = dayLectures.findIndex((l) => l.time === timeSlot || l.active);
    const now = currentIndex >= 0 ? dayLectures[currentIndex] : dayLectures[0] || null;
    const next = currentIndex >= 0 && currentIndex + 1 < dayLectures.length ? dayLectures[currentIndex + 1] : dayLectures[1] || null;
    return { now, next };
  }
}

export const academicStore = new AcademicStore();
