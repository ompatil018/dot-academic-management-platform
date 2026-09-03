import {
  UserProfile,
  LectureHistoryItem,
  StudentAttendanceEntry,
  ApprovalRequest,
  CourseOverviewItem,
  ScheduleEvent,
  NotificationItem,
} from '../types';
import {
  PRESET_USERS,
  INITIAL_LECTURE_HISTORY,
  INITIAL_STUDENTS_ROSTER,
  INITIAL_APPROVALS,
  INITIAL_COURSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TIMETABLE,
} from './academicStore';

export const USERS = PRESET_USERS;
export { INITIAL_LECTURE_HISTORY, INITIAL_STUDENTS_ROSTER, INITIAL_APPROVALS, INITIAL_COURSES };

export const STUDENT_SCHEDULE: ScheduleEvent[] = INITIAL_TIMETABLE.slice(0, 5);
export const TEACHER_SCHEDULE: ScheduleEvent[] = INITIAL_TIMETABLE.filter(
  (t) => t.teacherId === 'user-class-teacher' || t.teacher.includes('Anjali')
).slice(0, 4);

export const NOTIFICATIONS: NotificationItem[] = INITIAL_NOTIFICATIONS;

export const initialMockData = {
  currentUserTeacher: PRESET_USERS.classTeacher,
  currentUserAdmin: PRESET_USERS.admin,
  currentUserStudent: PRESET_USERS.student,
  teacherLectureHistory: INITIAL_LECTURE_HISTORY,
  studentsSectionA: INITIAL_STUDENTS_ROSTER,
  adminPendingApprovals: INITIAL_APPROVALS,
  adminCourses: INITIAL_COURSES,
  studentTodaySchedule: STUDENT_SCHEDULE,
  teacherTodaySchedule: TEACHER_SCHEDULE,
  notifications: NOTIFICATIONS,
};


