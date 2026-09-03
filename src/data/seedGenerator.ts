import {
  Course,
  CollegeClass,
  SubjectItem,
  StudentProfile,
  TeacherProfile,
  LectureHistoryItem,
  StudentAttendanceEntry,
  ApprovalRequest,
  TimetableLecture,
  NotificationItem,
} from '../types';

// ==========================================
// 1. COURSES & DEPARTMENTS (6 Courses)
// ==========================================
export const SEED_COURSES: Course[] = [
  {
    id: 'course-csd',
    name: 'Computer Science & Design',
    code: 'CSD',
    hodId: 'teacher-csd-hod',
    hodName: 'Dr. Anjali Kulkarni',
    totalClasses: 8,
    totalStudents: 318,
    totalTeachers: 22,
    avgAttendance: 85.6,
    status: 'healthy',
    color: '#6D3DE8',
  },
  {
    id: 'course-entc',
    name: 'Electronics & Telecommunication',
    code: 'ENTC',
    hodId: 'teacher-entc-hod',
    hodName: 'Dr. Rajesh Patil',
    totalClasses: 6,
    totalStudents: 246,
    totalTeachers: 18,
    avgAttendance: 84.2,
    status: 'healthy',
    color: '#4C1D95',
  },
  {
    id: 'course-ce',
    name: 'Computer Engineering',
    code: 'CE',
    hodId: 'teacher-ce-hod',
    hodName: 'Dr. Neha Sharma',
    totalClasses: 6,
    totalStudents: 231,
    totalTeachers: 17,
    avgAttendance: 85.1,
    status: 'healthy',
    color: '#0284C7',
  },
  {
    id: 'course-it',
    name: 'Information Technology',
    code: 'IT',
    hodId: 'teacher-it-hod',
    hodName: 'Dr. Amit Joshi',
    totalClasses: 5,
    totalStudents: 205,
    totalTeachers: 14,
    avgAttendance: 84.0,
    status: 'healthy',
    color: '#16A34A',
  },
  {
    id: 'course-me',
    name: 'Mechanical Engineering',
    code: 'ME',
    hodId: 'teacher-me-hod',
    hodName: 'Dr. P. Deshmukh',
    totalClasses: 4,
    totalStudents: 158,
    totalTeachers: 10,
    avgAttendance: 83.8,
    status: 'review',
    color: '#EA580C',
  },
  {
    id: 'course-civil',
    name: 'Civil Engineering',
    code: 'CIVIL',
    hodId: 'teacher-civil-hod',
    hodName: 'Dr. S. More',
    totalClasses: 3,
    totalStudents: 90,
    totalTeachers: 5,
    avgAttendance: 84.5,
    status: 'healthy',
    color: '#0D9488',
  },
];

// ==========================================
// 2. CLASSES & DIVISIONS (32 Classes)
// ==========================================
export const SEED_CLASSES: CollegeClass[] = [
  // CSD (8 Classes, 318 Students)
  { id: 'class-csd-fe-a', name: 'FE CSD-A', courseId: 'course-csd', division: 'A', classTeacherId: 'teacher-csd-1', classTeacherName: 'Prof. Vikram Mehta', totalStudents: 39, roomDefault: 'B-201', academicYear: '2026–27' },
  { id: 'class-csd-fe-b', name: 'FE CSD-B', courseId: 'course-csd', division: 'B', classTeacherId: 'teacher-csd-2', classTeacherName: 'Prof. Sunita Rao', totalStudents: 40, roomDefault: 'B-202', academicYear: '2026–27' },
  { id: 'class-csd-se-a', name: 'SE CSD-A', courseId: 'course-csd', division: 'A', classTeacherId: 'teacher-csd-3', classTeacherName: 'Prof. Priya Nair', totalStudents: 40, roomDefault: 'B-203', academicYear: '2026–27' },
  { id: 'class-csd-se-b', name: 'SE CSD-B', courseId: 'course-csd', division: 'B', classTeacherId: 'teacher-csd-4', classTeacherName: 'Prof. Rohan Kadam', totalStudents: 39, roomDefault: 'B-205', academicYear: '2026–27' },
  { id: 'class-csd-te-a', name: 'TE CSD-A', courseId: 'course-csd', division: 'A', classTeacherId: 'teacher-csd-5', classTeacherName: 'Prof. Anjali Sharma', totalStudents: 40, roomDefault: 'B-204', academicYear: '2026–27' },
  { id: 'class-csd-te-b', name: 'TE CSD-B', courseId: 'course-csd', division: 'B', classTeacherId: 'teacher-csd-6', classTeacherName: 'Prof. Rajesh Verma', totalStudents: 40, roomDefault: 'B-206', academicYear: '2026–27' },
  { id: 'class-csd-be-a', name: 'BE CSD-A', courseId: 'course-csd', division: 'A', classTeacherId: 'teacher-csd-hod', classTeacherName: 'Dr. Anjali Kulkarni', totalStudents: 40, roomDefault: 'C-301', academicYear: '2026–27' },
  { id: 'class-csd-be-b', name: 'BE CSD-B', courseId: 'course-csd', division: 'B', classTeacherId: 'teacher-csd-7', classTeacherName: 'Prof. Manoj Shinde', totalStudents: 40, roomDefault: 'C-302', academicYear: '2026–27' },

  // ENTC (6 Classes, 246 Students)
  { id: 'class-entc-fe-a', name: 'FE ENTC-A', courseId: 'course-entc', division: 'A', classTeacherId: 'teacher-entc-1', classTeacherName: 'Prof. Sanjay Gaikwad', totalStudents: 41, roomDefault: 'E-101', academicYear: '2026–27' },
  { id: 'class-entc-se-a', name: 'SE ENTC-A', courseId: 'course-entc', division: 'A', classTeacherId: 'teacher-entc-2', classTeacherName: 'Prof. Archana Mane', totalStudents: 41, roomDefault: 'E-102', academicYear: '2026–27' },
  { id: 'class-entc-se-b', name: 'SE ENTC-B', courseId: 'course-entc', division: 'B', classTeacherId: 'teacher-entc-3', classTeacherName: 'Prof. Nilesh Jagtap', totalStudents: 40, roomDefault: 'E-103', academicYear: '2026–27' },
  { id: 'class-entc-te-a', name: 'TE ENTC-A', courseId: 'course-entc', division: 'A', classTeacherId: 'teacher-entc-4', classTeacherName: 'Prof. Pallavi Shinde', totalStudents: 42, roomDefault: 'E-201', academicYear: '2026–27' },
  { id: 'class-entc-be-a', name: 'BE ENTC-A', courseId: 'course-entc', division: 'A', classTeacherId: 'teacher-entc-hod', classTeacherName: 'Dr. Rajesh Patil', totalStudents: 41, roomDefault: 'E-301', academicYear: '2026–27' },
  { id: 'class-entc-be-b', name: 'BE ENTC-B', courseId: 'course-entc', division: 'B', classTeacherId: 'teacher-entc-5', classTeacherName: 'Prof. Vivek Kulkarni', totalStudents: 41, roomDefault: 'E-302', academicYear: '2026–27' },

  // CE (6 Classes, 231 Students)
  { id: 'class-ce-fe-a', name: 'FE CE-A', courseId: 'course-ce', division: 'A', classTeacherId: 'teacher-ce-1', classTeacherName: 'Prof. Meenakshi Sundaram', totalStudents: 38, roomDefault: 'A-101', academicYear: '2026–27' },
  { id: 'class-ce-se-a', name: 'SE CE-A', courseId: 'course-ce', division: 'A', classTeacherId: 'teacher-ce-2', classTeacherName: 'Prof. Harish Chandra', totalStudents: 39, roomDefault: 'A-102', academicYear: '2026–27' },
  { id: 'class-ce-se-b', name: 'SE CE-B', courseId: 'course-ce', division: 'B', classTeacherId: 'teacher-ce-3', classTeacherName: 'Prof. Radhika Iyer', totalStudents: 38, roomDefault: 'A-103', academicYear: '2026–27' },
  { id: 'class-ce-te-a', name: 'TE CE-A', courseId: 'course-ce', division: 'A', classTeacherId: 'teacher-ce-4', classTeacherName: 'Prof. Deepak Salunkhe', totalStudents: 39, roomDefault: 'A-201', academicYear: '2026–27' },
  { id: 'class-ce-be-a', name: 'BE CE-A', courseId: 'course-ce', division: 'A', classTeacherId: 'teacher-ce-hod', classTeacherName: 'Dr. Neha Sharma', totalStudents: 38, roomDefault: 'A-301', academicYear: '2026–27' },
  { id: 'class-ce-be-b', name: 'BE CE-B', courseId: 'course-ce', division: 'B', classTeacherId: 'teacher-ce-5', classTeacherName: 'Prof. Alok Pandey', totalStudents: 39, roomDefault: 'A-302', academicYear: '2026–27' },

  // IT (5 Classes, 205 Students)
  { id: 'class-it-fe-a', name: 'FE IT-A', courseId: 'course-it', division: 'A', classTeacherId: 'teacher-it-1', classTeacherName: 'Prof. Shruti Mahajan', totalStudents: 41, roomDefault: 'D-101', academicYear: '2026–27' },
  { id: 'class-it-se-a', name: 'SE IT-A', courseId: 'course-it', division: 'A', classTeacherId: 'teacher-it-2', classTeacherName: 'Prof. Hemant Bhagat', totalStudents: 41, roomDefault: 'D-102', academicYear: '2026–27' },
  { id: 'class-it-te-a', name: 'TE IT-A', courseId: 'course-it', division: 'A', classTeacherId: 'teacher-it-hod', classTeacherName: 'Dr. Amit Joshi', totalStudents: 41, roomDefault: 'D-201', academicYear: '2026–27' },
  { id: 'class-it-te-b', name: 'TE IT-B', courseId: 'course-it', division: 'B', classTeacherId: 'teacher-it-3', classTeacherName: 'Prof. Swati Deshpande', totalStudents: 41, roomDefault: 'D-202', academicYear: '2026–27' },
  { id: 'class-it-be-a', name: 'BE IT-A', courseId: 'course-it', division: 'A', classTeacherId: 'teacher-it-4', classTeacherName: 'Prof. Chetan Gore', totalStudents: 41, roomDefault: 'D-301', academicYear: '2026–27' },

  // ME (4 Classes, 158 Students)
  { id: 'class-me-fe-a', name: 'FE ME-A', courseId: 'course-me', division: 'A', classTeacherId: 'teacher-me-1', classTeacherName: 'Prof. Vinod Thorat', totalStudents: 40, roomDefault: 'W-101', academicYear: '2026–27' },
  { id: 'class-me-se-a', name: 'SE ME-A', courseId: 'course-me', division: 'A', classTeacherId: 'teacher-me-2', classTeacherName: 'Prof. Sandeep Shinde', totalStudents: 39, roomDefault: 'W-102', academicYear: '2026–27' },
  { id: 'class-me-te-a', name: 'TE ME-A', courseId: 'course-me', division: 'A', classTeacherId: 'teacher-me-hod', classTeacherName: 'Dr. P. Deshmukh', totalStudents: 40, roomDefault: 'W-201', academicYear: '2026–27' },
  { id: 'class-me-be-a', name: 'BE ME-A', courseId: 'course-me', division: 'A', classTeacherId: 'teacher-me-3', classTeacherName: 'Prof. Rakesh Jadhav', totalStudents: 39, roomDefault: 'W-301', academicYear: '2026–27' },

  // CIVIL (3 Classes, 90 Students)
  { id: 'class-civil-se-a', name: 'SE CIVIL-A', courseId: 'course-civil', division: 'A', classTeacherId: 'teacher-civil-1', classTeacherName: 'Prof. Mahesh Pawar', totalStudents: 30, roomDefault: 'V-101', academicYear: '2026–27' },
  { id: 'class-civil-te-a', name: 'TE CIVIL-A', courseId: 'course-civil', division: 'A', classTeacherId: 'teacher-civil-hod', classTeacherName: 'Dr. S. More', totalStudents: 30, roomDefault: 'V-201', academicYear: '2026–27' },
  { id: 'class-civil-be-a', name: 'BE CIVIL-A', courseId: 'course-civil', division: 'A', classTeacherId: 'teacher-civil-2', classTeacherName: 'Prof. Kiran Kadam', totalStudents: 30, roomDefault: 'V-301', academicYear: '2026–27' },
];

// ==========================================
// 3. SUBJECTS FOR COMPUTER SCIENCE & DESIGN
// ==========================================
export const SEED_CSD_SUBJECTS: SubjectItem[] = [
  {
    id: 'sub-csd-101',
    code: 'CSD301',
    name: 'Data Structures',
    courseId: 'course-csd',
    type: 'Theory',
    credits: 4,
    assignedTeacherId: 'teacher-csd-5',
    assignedTeacherName: 'Prof. Anjali Sharma',
  },
  {
    id: 'sub-csd-102',
    code: 'CSD302',
    name: 'Database Management Systems',
    courseId: 'course-csd',
    type: 'Theory',
    credits: 4,
    assignedTeacherId: 'teacher-csd-6',
    assignedTeacherName: 'Prof. Rajesh Verma',
  },
  {
    id: 'sub-csd-103',
    code: 'CSD303',
    name: 'Operating Systems',
    courseId: 'course-csd',
    type: 'Theory',
    credits: 4,
    assignedTeacherId: 'teacher-csd-hod',
    assignedTeacherName: 'Dr. Anjali Kulkarni',
  },
  {
    id: 'sub-csd-104',
    code: 'CSD304',
    name: 'Computer Networks',
    courseId: 'course-csd',
    type: 'Theory',
    credits: 4,
    assignedTeacherId: 'teacher-csd-5',
    assignedTeacherName: 'Prof. Anjali Sharma',
  },
  {
    id: 'sub-csd-105',
    code: 'CSD305',
    name: 'Software Engineering',
    courseId: 'course-csd',
    type: 'Theory',
    credits: 3,
    assignedTeacherId: 'teacher-csd-3',
    assignedTeacherName: 'Prof. Priya Nair',
  },
  {
    id: 'sub-csd-106',
    code: 'CSD306',
    name: 'Web Technology',
    courseId: 'course-csd',
    type: 'Theory',
    credits: 3,
    assignedTeacherId: 'teacher-csd-6',
    assignedTeacherName: 'Prof. Rajesh Verma',
  },
  {
    id: 'sub-csd-107',
    code: 'CSD307',
    name: 'Artificial Intelligence',
    courseId: 'course-csd',
    type: 'Theory',
    credits: 4,
    assignedTeacherId: 'teacher-csd-hod',
    assignedTeacherName: 'Dr. Anjali Kulkarni',
  },
  {
    id: 'sub-csd-108',
    code: 'CSD308',
    name: 'Computer Graphics',
    courseId: 'course-csd',
    type: 'Theory',
    credits: 3,
    assignedTeacherId: 'teacher-csd-1',
    assignedTeacherName: 'Prof. Vikram Mehta',
  },
];

// ==========================================
// 4. TEACHERS DIRECTORY (86 Teachers)
// ==========================================
const INDIAN_FACULTY_NAMES: Record<string, { hod: string; names: string[] }> = {
  'course-csd': {
    hod: 'Dr. Anjali Kulkarni',
    names: [
      'Prof. Anjali Sharma',
      'Prof. Rajesh Verma',
      'Prof. Priya Nair',
      'Prof. Vikram Mehta',
      'Prof. Sunita Rao',
      'Prof. Rohan Kadam',
      'Prof. Manoj Shinde',
      'Prof. Abhay Kulkarni',
      'Prof. Tanvi Joshi',
      'Prof. Saurabh Deshmukh',
      'Prof. Leena Patil',
      'Prof. Girish Chitre',
      'Prof. Pallavi Gupte',
      'Prof. Sameer Phadke',
      'Prof. Rashmi Sawant',
      'Prof. Varun Bhave',
      'Prof. Shilpa More',
      'Prof. Mayur Jagtap',
      'Prof. Deepali Date',
      'Prof. Nikhil Kamat',
      'Prof. Amrita Sengupta',
    ],
  },
  'course-entc': {
    hod: 'Dr. Rajesh Patil',
    names: [
      'Prof. Sanjay Gaikwad',
      'Prof. Archana Mane',
      'Prof. Nilesh Jagtap',
      'Prof. Pallavi Shinde',
      'Prof. Vivek Kulkarni',
      'Prof. Sudhir Bapat',
      'Prof. Manjusha Dixit',
      'Prof. Anand Shete',
      'Prof. Rohini Gholap',
      'Prof. Prashant Salunkhe',
      'Prof. Kavita Godbole',
      'Prof. Tushar Kulkarni',
      'Prof. Bharati Awati',
      'Prof. Nitin Mahale',
      'Prof. Jyoti Borse',
      'Prof. Sandeep Patil',
      'Prof. Urmila Deshpande',
    ],
  },
  'course-ce': {
    hod: 'Dr. Neha Sharma',
    names: [
      'Prof. Meenakshi Sundaram',
      'Prof. Harish Chandra',
      'Prof. Radhika Iyer',
      'Prof. Deepak Salunkhe',
      'Prof. Alok Pandey',
      'Prof. Suresh Naidu',
      'Prof. Madhavi Rao',
      'Prof. Arvind Karve',
      'Prof. Shilpa Narvekar',
      'Prof. Vijay Tambe',
      'Prof. Pooja Chitnis',
      'Prof. Sachin Gadgil',
      'Prof. Anita Wani',
      'Prof. Chetan Bagul',
      'Prof. Sujata Korde',
      'Prof. Ganesh Mhetre',
    ],
  },
  'course-it': {
    hod: 'Dr. Amit Joshi',
    names: [
      'Prof. Shruti Mahajan',
      'Prof. Hemant Bhagat',
      'Prof. Swati Deshpande',
      'Prof. Chetan Gore',
      'Prof. Neeta Sawant',
      'Prof. Milind Ranade',
      'Prof. Archana Phadke',
      'Prof. Jayant Joshi',
      'Prof. Seema Kulkarni',
      'Prof. Sanjay Limaye',
      'Prof. Vidya Puranik',
      'Prof. Rahul Belsare',
      'Prof. Snehal Patankar',
    ],
  },
  'course-me': {
    hod: 'Dr. P. Deshmukh',
    names: [
      'Prof. Vinod Thorat',
      'Prof. Sandeep Shinde',
      'Prof. Rakesh Jadhav',
      'Prof. Satish Kale',
      'Prof. Prakash Mohite',
      'Prof. Avinash Jagdale',
      'Prof. Kishor Kadam',
      'Prof. Balasaheb More',
      'Prof. Umesh Gaikwad',
    ],
  },
  'course-civil': {
    hod: 'Dr. S. More',
    names: [
      'Prof. Mahesh Pawar',
      'Prof. Kiran Kadam',
      'Prof. Ashok Nalawade',
      'Prof. Shrikant Gite',
    ],
  },
};

export const SEED_TEACHERS: TeacherProfile[] = [];
// Generate all 86 teachers deterministically
SEED_COURSES.forEach((course) => {
  const dept = INDIAN_FACULTY_NAMES[course.id];
  if (!dept) return;

  // Add HOD
  SEED_TEACHERS.push({
    id: course.hodId,
    name: dept.hod,
    email: `${dept.hod.toLowerCase().replace(/[^a-z]/g, '')}@technova.edu.in`,
    mobile: `+91 9820${Math.floor(100000 + Math.random() * 900000)}`,
    employeeId: `EMP-${course.code}-001`,
    courseId: course.id,
    courseName: course.name,
    title: `Head of Department (${course.code})`,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    isHod: true,
    weeklyLecturesCount: 12,
    assignedSubjects: course.id === 'course-csd' ? ['Operating Systems', 'Artificial Intelligence'] : ['Core Engineering'],
  });

  // Add other faculty
  dept.names.forEach((name, idx) => {
    SEED_TEACHERS.push({
      id: `teacher-${course.code.toLowerCase()}-${idx + 1}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@technova.edu.in`,
      mobile: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      employeeId: `EMP-${course.code}-${String(idx + 2).padStart(3, '0')}`,
      courseId: course.id,
      courseName: course.name,
      title: idx === 0 ? 'Associate Professor' : 'Assistant Professor',
      avatar: idx % 2 === 0
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      isHod: false,
      weeklyLecturesCount: 16 + (idx % 5),
      assignedSubjects: course.id === 'course-csd' ? [SEED_CSD_SUBJECTS[idx % SEED_CSD_SUBJECTS.length].name] : ['Specialized Labs'],
    });
  });
});

// ==========================================
// 5. STUDENTS (1248 Students, including 40 named in TE CSD-A)
// ==========================================
export const TE_CSD_A_STUDENT_NAMES = [
  'Aarav Joshi',
  'Riya Patil',
  'Aditya Shah',
  'Sneha More',
  'Yash Kulkarni',
  'Aryan Sharma',
  'Bhavna Kulkarni',
  'Chetan Verma',
  'Deepa Menon',
  'Dhruv Kapoor',
  'Farhan Ali',
  'Gaurav Joshi',
  'Harini Sundaram',
  'Isha Deshmukh',
  'Jatin Singhal',
  'Kavya Pillai',
  'Kunal Ghosh',
  'Madhav Nambiar',
  'Meera Iyer',
  'Naveen Reddy',
  'Neha Bhatt',
  'Nikhil Saxena',
  'Pooja Hegde',
  'Pranav Kulkarni',
  'Rahul Choudhary',
  'Rhea Sen',
  'Rishi Banerjee',
  'Rohan Mehra',
  'Saanvi Nair',
  'Sameer Siddiqui',
  'Sanya Gupta',
  'Shreya Das',
  'Siddharth Roy',
  'Sneha Chawla',
  'Tanmay Jain',
  'Tarun Varma',
  'Trisha Sen',
  'Uday Kiran',
  'Varun Grover',
  'Vidya Balan',
];

// Realistic student attendance per subject for TE CSD-A
// All 8 core subjects: DSA ~92%, DBMS ~86%, OS ~78%, CN ~94%, SE ~88%, WT ~91%, AI ~83%, CG ~89%
// Some students below 75%: Farhan Ali (68%), Jatin Singhal (65%), Sameer Siddiqui (69%), Naveen Reddy (70%), Yash Kulkarni (72%)
export function getStudentSubjectStats(studentIndex: number) {
  // Aarav Joshi (index 0) - Primary demo student with exact targeted values
  if (studentIndex === 0) {
    const ds = { attended: 37, total: 40, percent: 92 };
    const dbms = { attended: 33, total: 38, percent: 86 };
    const os = { attended: 28, total: 36, percent: 78 };
    const cn = { attended: 34, total: 36, percent: 94 };
    const se = { attended: 28, total: 32, percent: 88 };
    const wt = { attended: 27, total: 30, percent: 91 };
    const ai = { attended: 25, total: 30, percent: 83 };
    const cg = { attended: 25, total: 28, percent: 89 };

    const totalAttended = ds.attended + dbms.attended + os.attended + cn.attended + se.attended + wt.attended + ai.attended + cg.attended;
    const totalClasses = ds.total + dbms.total + os.total + cn.total + se.total + wt.total + ai.total + cg.total;
    const overall = Math.round((totalAttended / totalClasses) * 100);

    return { ds, dbms, os, cn, se, wt, ai, cg, overall, totalAttended, totalClasses };
  }

  // Low attendance students indices: 4 (Yash Kulkarni), 10 (Farhan Ali), 14 (Jatin Singhal), 19 (Naveen Reddy), 29 (Sameer Siddiqui)
  if (studentIndex === 10) { // Farhan Ali
    const ds = { attended: 30, total: 40, percent: 75 };
    const dbms = { attended: 26, total: 38, percent: 68 };
    const os = { attended: 21, total: 36, percent: 58 };
    const cn = { attended: 28, total: 36, percent: 78 };
    const se = { attended: 21, total: 32, percent: 66 };
    const wt = { attended: 21, total: 30, percent: 70 };
    const ai = { attended: 19, total: 30, percent: 63 };
    const cg = { attended: 18, total: 28, percent: 64 };
    const totalAttended = ds.attended + dbms.attended + os.attended + cn.attended + se.attended + wt.attended + ai.attended + cg.attended;
    const totalClasses = 270;
    return { ds, dbms, os, cn, se, wt, ai, cg, overall: Math.round((totalAttended / totalClasses) * 100), totalAttended, totalClasses };
  }

  if (studentIndex === 14) { // Jatin Singhal
    const ds = { attended: 28, total: 40, percent: 70 };
    const dbms = { attended: 25, total: 38, percent: 66 };
    const os = { attended: 20, total: 36, percent: 56 };
    const cn = { attended: 27, total: 36, percent: 75 };
    const se = { attended: 20, total: 32, percent: 63 };
    const wt = { attended: 20, total: 30, percent: 67 };
    const ai = { attended: 18, total: 30, percent: 60 };
    const cg = { attended: 17, total: 28, percent: 61 };
    const totalAttended = ds.attended + dbms.attended + os.attended + cn.attended + se.attended + wt.attended + ai.attended + cg.attended;
    const totalClasses = 270;
    return { ds, dbms, os, cn, se, wt, ai, cg, overall: Math.round((totalAttended / totalClasses) * 100), totalAttended, totalClasses };
  }

  if (studentIndex === 4) { // Yash Kulkarni
    const ds = { attended: 32, total: 40, percent: 80 };
    const dbms = { attended: 28, total: 38, percent: 74 };
    const os = { attended: 23, total: 36, percent: 64 };
    const cn = { attended: 30, total: 36, percent: 83 };
    const se = { attended: 22, total: 32, percent: 69 };
    const wt = { attended: 22, total: 30, percent: 73 };
    const ai = { attended: 20, total: 30, percent: 67 };
    const cg = { attended: 19, total: 28, percent: 68 };
    const totalAttended = ds.attended + dbms.attended + os.attended + cn.attended + se.attended + wt.attended + ai.attended + cg.attended;
    const totalClasses = 270;
    return { ds, dbms, os, cn, se, wt, ai, cg, overall: Math.round((totalAttended / totalClasses) * 100), totalAttended, totalClasses };
  }

  if (studentIndex === 19) { // Naveen Reddy
    const ds = { attended: 31, total: 40, percent: 78 };
    const dbms = { attended: 27, total: 38, percent: 71 };
    const os = { attended: 22, total: 36, percent: 61 };
    const cn = { attended: 29, total: 36, percent: 81 };
    const se = { attended: 22, total: 32, percent: 69 };
    const wt = { attended: 21, total: 30, percent: 70 };
    const ai = { attended: 20, total: 30, percent: 67 };
    const cg = { attended: 19, total: 28, percent: 68 };
    const totalAttended = ds.attended + dbms.attended + os.attended + cn.attended + se.attended + wt.attended + ai.attended + cg.attended;
    const totalClasses = 270;
    return { ds, dbms, os, cn, se, wt, ai, cg, overall: Math.round((totalAttended / totalClasses) * 100), totalAttended, totalClasses };
  }

  if (studentIndex === 29) { // Sameer Siddiqui
    const ds = { attended: 30, total: 40, percent: 75 };
    const dbms = { attended: 26, total: 38, percent: 68 };
    const os = { attended: 22, total: 36, percent: 61 };
    const cn = { attended: 29, total: 36, percent: 81 };
    const se = { attended: 21, total: 32, percent: 66 };
    const wt = { attended: 21, total: 30, percent: 70 };
    const ai = { attended: 19, total: 30, percent: 63 };
    const cg = { attended: 18, total: 28, percent: 64 };
    const totalAttended = ds.attended + dbms.attended + os.attended + cn.attended + se.attended + wt.attended + ai.attended + cg.attended;
    const totalClasses = 270;
    return { ds, dbms, os, cn, se, wt, ai, cg, overall: Math.round((totalAttended / totalClasses) * 100), totalAttended, totalClasses };
  }

  // Normal students with variance around standard targets
  const variance = (studentIndex % 5) - 2; // -2, -1, 0, 1, 2
  const dsPct = Math.min(98, Math.max(88, 93 + variance));
  const dbmsPct = Math.min(95, Math.max(82, 87 + variance));
  const osPct = Math.min(88, Math.max(74, 80 + variance));
  const cnPct = Math.min(98, Math.max(90, 95 + variance));
  const sePct = Math.min(96, Math.max(84, 89 + variance));
  const wtPct = Math.min(96, Math.max(85, 91 + variance));
  const aiPct = Math.min(92, Math.max(78, 84 + variance));
  const cgPct = Math.min(95, Math.max(82, 89 + variance));

  const ds = { attended: Math.round((40 * dsPct) / 100), total: 40, percent: dsPct };
  const dbms = { attended: Math.round((38 * dbmsPct) / 100), total: 38, percent: dbmsPct };
  const os = { attended: Math.round((36 * osPct) / 100), total: 36, percent: osPct };
  const cn = { attended: Math.round((36 * cnPct) / 100), total: 36, percent: cnPct };
  const se = { attended: Math.round((32 * sePct) / 100), total: 32, percent: sePct };
  const wt = { attended: Math.round((30 * wtPct) / 100), total: 30, percent: wtPct };
  const ai = { attended: Math.round((30 * aiPct) / 100), total: 30, percent: aiPct };
  const cg = { attended: Math.round((28 * cgPct) / 100), total: 28, percent: cgPct };

  const totalAttended = ds.attended + dbms.attended + os.attended + cn.attended + se.attended + wt.attended + ai.attended + cg.attended;
  const totalClasses = 40 + 38 + 36 + 36 + 32 + 30 + 30 + 28; // 270
  const overall = Math.round((totalAttended / totalClasses) * 100);

  return {
    ds,
    dbms,
    os,
    cn,
    se,
    wt,
    ai,
    cg,
    overall,
    totalAttended,
    totalClasses,
  };
}

export const SEED_STUDENTS_ROSTER_TE_CSD_A: StudentAttendanceEntry[] = TE_CSD_A_STUDENT_NAMES.map(
  (name, index) => {
    const stats = getStudentSubjectStats(index);
    // Determine status today
    const isAbsentToday = index === 10 || index === 14 || index === 29; // 3 absentees today
    return {
      id: `stud-te-csd-${index + 1}`,
      rollNo: `CSD${201 + index}`,
      name,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (index * 13247) % 50000000}?w=100&auto=format&fit=crop&q=80`,
      status: isAbsentToday ? 'absent' : 'present',
      percentage: stats.overall,
    };
  }
);

// Programmatic complete list of 1248 students across 32 classes
export const SEED_ALL_STUDENTS: StudentProfile[] = [];
let totalStudentCounter = 0;

SEED_CLASSES.forEach((cls) => {
  const isTeCsdA = cls.id === 'class-csd-te-a';
  for (let i = 0; i < cls.totalStudents; i++) {
    totalStudentCounter++;
    const rollSuffix = String(i + 1).padStart(3, '0');
    const name = isTeCsdA && i < TE_CSD_A_STUDENT_NAMES.length
      ? TE_CSD_A_STUDENT_NAMES[i]
      : `${['Aarav', 'Riya', 'Aditya', 'Sneha', 'Yash', 'Aryan', 'Neha', 'Rohan', 'Pooja', 'Deepak', 'Suman', 'Ankit', 'Priya', 'Kavya', 'Gaurav', 'Manish', 'Kunal', 'Tanvi', 'Vikas', 'Meera'][i % 20]} ${['Patil', 'Joshi', 'Sharma', 'Kulkarni', 'Deshmukh', 'Shah', 'Verma', 'Nair', 'More', 'Iyer', 'Choudhary', 'Reddy', 'Gupta', 'Bhatt', 'Pawar'][totalStudentCounter % 15]}`;

    const rollNo = isTeCsdA && i < 40 ? `CSD${201 + i}` : `${cls.name.replace(/[^A-Z0-9]/g, '')}-${rollSuffix}`;
    const stats = isTeCsdA && i < 40 ? getStudentSubjectStats(i) : null;
    const overallAtt = stats ? stats.overall : 76 + ((totalStudentCounter * 7) % 22);

    SEED_ALL_STUDENTS.push({
      id: `stud-${cls.id}-${i + 1}`,
      rollNo,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}.${rollNo.toLowerCase()}@technova.edu.in`,
      mobile: `+91 97${Math.floor(10000000 + Math.random() * 90000000)}`,
      classId: cls.id,
      className: cls.name,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + (totalStudentCounter * 987) % 40000000}?w=100&auto=format&fit=crop&q=80`,
      academicYear: '2026–27',
      status: 'active',
      subjectAttendance: stats
        ? {
            'Data Structures': stats.ds,
            'Database Management Systems': stats.dbms,
            'Operating Systems': stats.os,
            'Computer Networks': stats.cn,
            'Software Engineering': stats.se,
            'Web Technology': stats.wt,
            'Artificial Intelligence': stats.ai,
            'Computer Graphics': stats.cg,
          }
        : {},
    });
  }
});

// ==========================================
// 6. WEEKLY TIMETABLE FOR TE CSD-A (Mon-Fri)
// ==========================================
export const SEED_TIMETABLE_TE_CSD_A: TimetableLecture[] = [
  // MONDAY
  { id: 'tt-mon-1', day: 'Monday', time: '09:00 AM', endTime: '10:00 AM', subject: 'Operating Systems', subjectId: 'sub-csd-103', teacher: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-mon-2', day: 'Monday', time: '10:00 AM', endTime: '11:00 AM', subject: 'Data Structures', subjectId: 'sub-csd-101', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-mon-3', day: 'Monday', time: '11:00 AM', endTime: '11:15 AM', subject: 'Morning Break', teacher: 'Campus Commons', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-mon-4', day: 'Monday', time: '11:15 AM', endTime: '12:15 PM', subject: 'Database Management Systems', subjectId: 'sub-csd-102', teacher: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-mon-5', day: 'Monday', time: '12:15 PM', endTime: '01:00 PM', subject: 'Lunch Break', teacher: 'Cafeteria', room: 'Campus', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-mon-6', day: 'Monday', time: '01:00 PM', endTime: '03:00 PM', subject: 'Data Structures Lab', subjectId: 'sub-csd-101', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-206', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lab' },

  // TUESDAY
  { id: 'tt-tue-1', day: 'Tuesday', time: '09:00 AM', endTime: '10:00 AM', subject: 'Computer Networks', subjectId: 'sub-csd-104', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-tue-2', day: 'Tuesday', time: '10:00 AM', endTime: '11:00 AM', subject: 'Software Engineering', subjectId: 'sub-csd-105', teacher: 'Prof. Priya Nair', teacherId: 'teacher-csd-3', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-tue-3', day: 'Tuesday', time: '11:00 AM', endTime: '11:15 AM', subject: 'Morning Break', teacher: 'Campus Commons', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-tue-4', day: 'Tuesday', time: '11:15 AM', endTime: '12:15 PM', subject: 'Database Management Systems', subjectId: 'sub-csd-102', teacher: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-tue-5', day: 'Tuesday', time: '12:15 PM', endTime: '01:00 PM', subject: 'Lunch Break', teacher: 'Cafeteria', room: 'Campus', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-tue-6', day: 'Tuesday', time: '01:00 PM', endTime: '02:00 PM', subject: 'Operating Systems', subjectId: 'sub-csd-103', teacher: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-tue-7', day: 'Tuesday', time: '02:00 PM', endTime: '03:00 PM', subject: 'Data Structures Tutorial', subjectId: 'sub-csd-101', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Tutorial' },

  // WEDNESDAY
  { id: 'tt-wed-1', day: 'Wednesday', time: '09:00 AM', endTime: '10:00 AM', subject: 'Data Structures', subjectId: 'sub-csd-101', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-wed-2', day: 'Wednesday', time: '10:00 AM', endTime: '11:00 AM', subject: 'Computer Networks', subjectId: 'sub-csd-104', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-wed-3', day: 'Wednesday', time: '11:00 AM', endTime: '11:15 AM', subject: 'Morning Break', teacher: 'Campus Commons', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-wed-4', day: 'Wednesday', time: '11:15 AM', endTime: '12:15 PM', subject: 'Software Engineering', subjectId: 'sub-csd-105', teacher: 'Prof. Priya Nair', teacherId: 'teacher-csd-3', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-wed-5', day: 'Wednesday', time: '12:15 PM', endTime: '01:00 PM', subject: 'Lunch Break', teacher: 'Cafeteria', room: 'Campus', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-wed-6', day: 'Wednesday', time: '01:00 PM', endTime: '03:00 PM', subject: 'DBMS & Web Lab', subjectId: 'sub-csd-102', teacher: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', room: 'C-301', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lab' },

  // THURSDAY
  { id: 'tt-thu-1', day: 'Thursday', time: '09:00 AM', endTime: '10:00 AM', subject: 'Operating Systems', subjectId: 'sub-csd-103', teacher: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-thu-2', day: 'Thursday', time: '10:00 AM', endTime: '11:00 AM', subject: 'Data Structures', subjectId: 'sub-csd-101', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-thu-3', day: 'Thursday', time: '11:00 AM', endTime: '11:15 AM', subject: 'Morning Break', teacher: 'Campus Commons', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-thu-4', day: 'Thursday', time: '11:15 AM', endTime: '12:15 PM', subject: 'Computer Networks', subjectId: 'sub-csd-104', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-thu-5', day: 'Thursday', time: '12:15 PM', endTime: '01:00 PM', subject: 'Lunch Break', teacher: 'Cafeteria', room: 'Campus', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-thu-6', day: 'Thursday', time: '01:00 PM', endTime: '03:00 PM', subject: 'Networks & OS Lab', subjectId: 'sub-csd-104', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'C-302', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lab' },

  // FRIDAY
  { id: 'tt-fri-1', day: 'Friday', time: '09:00 AM', endTime: '10:00 AM', subject: 'Software Engineering', subjectId: 'sub-csd-105', teacher: 'Prof. Priya Nair', teacherId: 'teacher-csd-3', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-fri-2', day: 'Friday', time: '10:00 AM', endTime: '11:00 AM', subject: 'Database Management Systems', subjectId: 'sub-csd-102', teacher: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-fri-3', day: 'Friday', time: '11:00 AM', endTime: '11:15 AM', subject: 'Morning Break', teacher: 'Campus Commons', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-fri-4', day: 'Friday', time: '11:15 AM', endTime: '12:15 PM', subject: 'Computer Networks', subjectId: 'sub-csd-104', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-fri-5', day: 'Friday', time: '12:15 PM', endTime: '01:00 PM', subject: 'Lunch Break', teacher: 'Cafeteria', room: 'Campus', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Break' },
  { id: 'tt-fri-6', day: 'Friday', time: '01:00 PM', endTime: '02:00 PM', subject: 'Operating Systems', subjectId: 'sub-csd-103', teacher: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', room: 'B-205', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Lecture' },
  { id: 'tt-fri-7', day: 'Friday', time: '02:00 PM', endTime: '03:00 PM', subject: 'Data Structures Tutorial', subjectId: 'sub-csd-101', teacher: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', room: 'B-204', classId: 'class-csd-te-a', className: 'TE CSD-A', type: 'Tutorial' },
];

// ==========================================
// 7. 30-DAY LECTURE HISTORY FOR TE CSD-A
// ==========================================
// Populates:
// - Data Structures: ~92%
// - DBMS: ~86%
// - Operating Systems: ~78%
// - Computer Networks: ~94%
// - Software Engineering: ~88%
// Also includes cancelled lectures and substitute lectures for Reports
export const SEED_30DAY_LECTURE_HISTORY: LectureHistoryItem[] = [
  { id: 'lh-30', date: 'Oct 28, 2026', subject: 'Data Structures', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 93, presentCount: 37, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-29', date: 'Oct 28, 2026', subject: 'Computer Networks', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 95, presentCount: 38, totalCount: 40, room: 'B-204', time: '09:00–10:00 AM', status: 'completed' },
  { id: 'lh-28', date: 'Oct 27, 2026', subject: 'Operating Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', attendancePercent: 78, presentCount: 31, totalCount: 40, room: 'B-204', time: '09:00–10:00 AM', status: 'completed' },
  { id: 'lh-27', date: 'Oct 27, 2026', subject: 'Database Management Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', attendancePercent: 85, presentCount: 34, totalCount: 40, room: 'B-204', time: '11:15–12:15 PM', status: 'completed' },
  { id: 'lh-26', date: 'Oct 26, 2026', subject: 'Software Engineering', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Priya Nair', teacherId: 'teacher-csd-3', attendancePercent: 88, presentCount: 35, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-25', date: 'Oct 25, 2026', subject: 'Data Structures', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 90, presentCount: 36, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-24', date: 'Oct 24, 2026', subject: 'Computer Networks', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 93, presentCount: 37, totalCount: 40, room: 'B-204', time: '11:15–12:15 PM', status: 'completed' },
  { id: 'lh-23', date: 'Oct 23, 2026', subject: 'Operating Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', attendancePercent: 75, presentCount: 30, totalCount: 40, room: 'B-204', time: '01:00–02:00 PM', status: 'completed' },
  { id: 'lh-22', date: 'Oct 22, 2026', subject: 'Database Management Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', attendancePercent: 88, presentCount: 35, totalCount: 40, room: 'B-204', time: '11:15–12:15 PM', status: 'completed' },
  { id: 'lh-21', date: 'Oct 21, 2026', subject: 'Software Engineering', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Priya Nair', teacherId: 'teacher-csd-3', attendancePercent: 90, presentCount: 36, totalCount: 40, room: 'B-204', time: '09:00–10:00 AM', status: 'completed' },
  { id: 'lh-20', date: 'Oct 20, 2026', subject: 'Data Structures Lab', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 95, presentCount: 38, totalCount: 40, room: 'B-206', time: '01:00–03:00 PM', status: 'completed' },
  { id: 'lh-19', date: 'Oct 19, 2026', subject: 'Operating Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', attendancePercent: 80, presentCount: 32, totalCount: 40, room: 'B-204', time: '09:00–10:00 AM', status: 'completed' },
  { id: 'lh-18', date: 'Oct 18, 2026', subject: 'Computer Networks', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 95, presentCount: 38, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-17', date: 'Oct 17, 2026', subject: 'Database Management Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', attendancePercent: 85, presentCount: 34, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-16', date: 'Oct 16, 2026', subject: 'Operating Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Rohan Kadam', teacherId: 'teacher-csd-4', attendancePercent: 78, presentCount: 31, totalCount: 40, room: 'B-204', time: '09:00–10:00 AM', status: 'substitute', substituteTeacher: 'Prof. Rohan Kadam (Substituted for Dr. Kulkarni)' },
  { id: 'lh-15', date: 'Oct 15, 2026', subject: 'Software Engineering', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Priya Nair', teacherId: 'teacher-csd-3', attendancePercent: 0, presentCount: 0, totalCount: 40, room: 'B-204', time: '11:15–12:15 PM', status: 'cancelled', notes: 'Cancelled due to Inter-Collegiate Hackathon Inauguration' },
  { id: 'lh-14', date: 'Oct 14, 2026', subject: 'Data Structures', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 93, presentCount: 37, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-13', date: 'Oct 13, 2026', subject: 'Database Management Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', attendancePercent: 88, presentCount: 35, totalCount: 40, room: 'B-204', time: '11:15–12:15 PM', status: 'completed' },
  { id: 'lh-12', date: 'Oct 12, 2026', subject: 'Computer Networks', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 93, presentCount: 37, totalCount: 40, room: 'B-204', time: '09:00–10:00 AM', status: 'completed' },
  { id: 'lh-11', date: 'Oct 11, 2026', subject: 'Operating Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', attendancePercent: 78, presentCount: 31, totalCount: 40, room: 'B-204', time: '09:00–10:00 AM', status: 'completed' },
  { id: 'lh-10', date: 'Oct 10, 2026', subject: 'Data Structures', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 90, presentCount: 36, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-9', date: 'Oct 09, 2026', subject: 'Software Engineering', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Priya Nair', teacherId: 'teacher-csd-3', attendancePercent: 85, presentCount: 34, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-8', date: 'Oct 08, 2026', subject: 'Computer Networks', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 95, presentCount: 38, totalCount: 40, room: 'B-204', time: '11:15–12:15 PM', status: 'completed' },
  { id: 'lh-7', date: 'Oct 07, 2026', subject: 'Database Management Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Rajesh Verma', teacherId: 'teacher-csd-6', attendancePercent: 85, presentCount: 34, totalCount: 40, room: 'B-204', time: '11:15–12:15 PM', status: 'completed' },
  { id: 'lh-6', date: 'Oct 06, 2026', subject: 'Operating Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', attendancePercent: 80, presentCount: 32, totalCount: 40, room: 'B-204', time: '01:00–02:00 PM', status: 'completed' },
  { id: 'lh-5', date: 'Oct 05, 2026', subject: 'Data Structures', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 93, presentCount: 37, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'completed' },
  { id: 'lh-4', date: 'Oct 04, 2026', subject: 'Computer Networks Lab', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 95, presentCount: 38, totalCount: 40, room: 'C-302', time: '01:00–03:00 PM', status: 'completed' },
  { id: 'lh-3', date: 'Oct 03, 2026', subject: 'Database Management Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Vikram Mehta', teacherId: 'teacher-csd-1', attendancePercent: 83, presentCount: 33, totalCount: 40, room: 'B-204', time: '11:15–12:15 PM', status: 'substitute', substituteTeacher: 'Prof. Vikram Mehta (Guest Session on SQL Optimizer)' },
  { id: 'lh-2', date: 'Oct 02, 2026', subject: 'Data Structures', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Prof. Anjali Sharma', teacherId: 'teacher-csd-5', attendancePercent: 0, presentCount: 0, totalCount: 40, room: 'B-204', time: '10:00–11:00 AM', status: 'cancelled', notes: 'National Holiday (Gandhi Jayanti)' },
  { id: 'lh-1', date: 'Oct 01, 2026', subject: 'Operating Systems', class: 'TE CSD-A', classId: 'class-csd-te-a', teacherName: 'Dr. Anjali Kulkarni', teacherId: 'teacher-csd-hod', attendancePercent: 75, presentCount: 30, totalCount: 40, room: 'B-204', time: '09:00–10:00 AM', status: 'completed' },
];

// ==========================================
// 8. REGISTRATION REQUESTS (Exactly 18 PENDING)
// ==========================================
export const SEED_APPROVALS: ApprovalRequest[] = [
  // 18 Pending Requests (Mix of Teacher and Student registrations)
  { id: 'req-p1', name: 'Dr. Swati Sen', roleType: 'Teacher Registration', departmentOrYear: 'Computer Science & Design', email: 'swati.sen@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '12 mins ago', details: 'PhD IIT Bombay, applying for Assistant Professor in AI/ML' },
  { id: 'req-p2', name: 'Prathamesh Kulkarni', roleType: 'Student Registration', departmentOrYear: 'TE CSD-A', email: 'prathamesh.k@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '25 mins ago', details: 'Direct Second Year transfer admission documentation verified' },
  { id: 'req-p3', name: 'Prof. Abhiram Deshpande', roleType: 'Teacher Registration', departmentOrYear: 'Electronics & Telecommunication', email: 'a.deshpande@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '45 mins ago', details: 'M.Tech VLSI Design, applying for Embedded Systems Lab Faculty' },
  { id: 'req-p4', name: 'Siddhant Bhosle', roleType: 'Student Registration', departmentOrYear: 'SE CE-B', email: 'siddhant.b@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '1 hour ago', details: 'Academic enrollment & eligibility clearance submitted' },
  { id: 'req-p5', name: 'Prof. Manasi Chitnis', roleType: 'Teacher Registration', departmentOrYear: 'Information Technology', email: 'manasi.c@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '2 hours ago', details: 'Cloud Computing & DevOps visiting faculty verification' },
  { id: 'req-p6', name: 'Tanvi Shirodkar', roleType: 'Student Registration', departmentOrYear: 'TE CSD-A', email: 'tanvi.s@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '2 hours ago', details: 'Elective course opt-in: Cyber Security & Ethical Hacking' },
  { id: 'req-p7', name: 'Prof. Omkar Ranade', roleType: 'Teacher Registration', departmentOrYear: 'Mechanical Engineering', email: 'omkar.r@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '3 hours ago', details: 'Thermodynamics & CAD/CAM faculty appointment' },
  { id: 'req-p8', name: 'Aakash Singhania', roleType: 'Student Registration', departmentOrYear: 'BE ENTC-A', email: 'aakash.s@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '4 hours ago', details: 'Final year capstone sponsored project approval request' },
  { id: 'req-p9', name: 'Dr. Meera Nambisan', roleType: 'Teacher Registration', departmentOrYear: 'Civil Engineering', email: 'meera.n@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '5 hours ago', details: 'Structural Engineering & Concrete Technology faculty' },
  { id: 'req-p10', name: 'Aditi Vartak', roleType: 'Student Registration', departmentOrYear: 'FE CSD-B', email: 'aditi.v@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '6 hours ago', details: 'First year seat confirmation and caste validity documentation' },
  { id: 'req-p11', name: 'Prof. Harish Bhat', roleType: 'Teacher Registration', departmentOrYear: 'Computer Engineering', email: 'harish.b@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '7 hours ago', details: 'Distributed Systems & Microservices lab instructor' },
  { id: 'req-p12', name: 'Mihir Gokhale', roleType: 'Student Registration', departmentOrYear: 'TE IT-A', email: 'mihir.g@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '8 hours ago', details: 'Semester tuition scholarship certificate verification' },
  { id: 'req-p13', name: 'Prof. Shailaja Joshi', roleType: 'Teacher Registration', departmentOrYear: 'Computer Science & Design', email: 'shailaja.j@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '10 hours ago', details: 'Human Computer Interaction (HCI) UI/UX instructor' },
  { id: 'req-p14', name: 'Chinmayee Dixit', roleType: 'Student Registration', departmentOrYear: 'SE ENTC-A', email: 'chinmayee.d@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '12 hours ago', details: 'Hostel accommodation & campus access ID request' },
  { id: 'req-p15', name: 'Devendra Kulkarni', roleType: 'Student Registration', departmentOrYear: 'TE CSD-B', email: 'devendra.k@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '14 hours ago', details: 'Sports quota national tournament leave & attendance relief' },
  { id: 'req-p16', name: 'Prof. Anupam Trivedi', roleType: 'Teacher Registration', departmentOrYear: 'Electronics & Telecommunication', email: 'anupam.t@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '16 hours ago', details: 'Satellite Communications & Radar Systems professor' },
  { id: 'req-p17', name: 'Sanya Mirza', roleType: 'Student Registration', departmentOrYear: 'BE ME-A', email: 'sanya.m@technova.edu.in', icon: 'school', status: 'pending', submittedAt: '18 hours ago', details: 'Formula Student Racing team design lead project enrollment' },
  { id: 'req-p18', name: 'Prof. Vidur Soni', roleType: 'Teacher Registration', departmentOrYear: 'Computer Engineering', email: 'vidur.s@technova.edu.in', icon: 'person', status: 'pending', submittedAt: '1 day ago', details: 'Natural Language Processing and Generative AI researcher' },

  // Already Approved requests (for realistic history)
  { id: 'req-a1', name: 'Prof. Anjali Sharma', roleType: 'Teacher Registration', departmentOrYear: 'Computer Science & Design', email: 'anjali.s@technova.edu.in', icon: 'person', status: 'approved', submittedAt: '3 days ago', details: 'Appointed as Class Teacher of TE CSD-A' },
  { id: 'req-a2', name: 'Aryan Sharma', roleType: 'Student Registration', departmentOrYear: 'TE CSD-A', email: 'aryan.s@technova.edu.in', icon: 'school', status: 'approved', submittedAt: '5 days ago', details: 'Admission Roll: CSD206, Enrolled in TE CSD-A' },
  { id: 'req-a3', name: 'Prof. Rajesh Verma', roleType: 'Teacher Registration', departmentOrYear: 'Computer Science & Design', email: 'rajesh.v@technova.edu.in', icon: 'person', status: 'approved', submittedAt: '1 week ago', details: 'Assigned to DBMS & Web Technology' },
  { id: 'req-a4', name: 'Sneha More', roleType: 'Student Registration', departmentOrYear: 'TE CSD-A', email: 'sneha.m@technova.edu.in', icon: 'school', status: 'approved', submittedAt: '2 weeks ago', details: 'Admission Roll: CSD204 confirmed' },

  // Rejected requests (for audit integrity)
  { id: 'req-r1', name: 'Karthik Pillai', roleType: 'Course Change', departmentOrYear: 'Mechanical Engineering', email: 'karthik.p@technova.edu.in', icon: 'swap_horiz', status: 'rejected', submittedAt: '4 days ago', details: 'Branch transfer denied: Cut-off GPA criteria (8.5) not met' },
  { id: 'req-r2', name: 'Ritesh Pandey', roleType: 'Student Registration', departmentOrYear: 'Civil Engineering', email: 'ritesh.p@technova.edu.in', icon: 'school', status: 'rejected', submittedAt: '1 week ago', details: 'Incomplete prerequisite diploma transcripts submitted' },
];

// ==========================================
// 9. REALISTIC NOTIFICATIONS
// ==========================================
export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'timetable',
    title: 'Timetable Changed',
    message: 'Operating Systems lecture rescheduled from Room B-204 to Room B-205 on Friday 01:00 PM.',
    timeAgo: '15 mins ago',
    unread: true,
  },
  {
    id: 'notif-2',
    type: 'alert',
    title: 'Room Changed: Data Structures Lab',
    message: 'Practical Lab session will be conducted in Room B-206 due to server maintenance in Room C-301.',
    timeAgo: '45 mins ago',
    unread: true,
  },
  {
    id: 'notif-3',
    type: 'alert',
    title: 'Lecture Cancelled: Software Engineering',
    message: 'Prof. Priya Nair is attending the University Accreditation Board meeting. Lecture on Thursday 11:15 AM is cancelled.',
    timeAgo: '2 hours ago',
    unread: true,
  },
  {
    id: 'notif-4',
    type: 'info',
    title: 'Substitute Teacher Appointed',
    message: 'Prof. Rohan Kadam will conduct the Operating Systems tutorial today in place of Dr. Anjali Kulkarni.',
    timeAgo: '3 hours ago',
    unread: true,
  },
  {
    id: 'notif-5',
    type: 'alert',
    title: 'Low Attendance Alert (<75%)',
    message: 'Operating Systems attendance is currently at 72.2%. Statutory warning: 75.0% required to qualify for Term Exam.',
    timeAgo: '5 hours ago',
    unread: true,
  },
  {
    id: 'notif-6',
    type: 'attendance',
    title: 'Attendance Reminder: Submit Lecture Log',
    message: 'Please verify and submit attendance for Data Structures (TE CSD-A) before 05:00 PM today.',
    timeAgo: '6 hours ago',
    unread: false,
  },
  {
    id: 'notif-7',
    type: 'graded',
    title: 'Registration Approved',
    message: 'Aryan Sharma enrollment in TE CSD-A for Academic Year 2026–27 has been officially verified by College Administration.',
    timeAgo: '1 day ago',
    unread: false,
  },
  {
    id: 'notif-8',
    type: 'info',
    title: 'Monthly Attendance Audit Published',
    message: 'Institutional attendance average for October 2026 stands at 84.6%. Department reports available for download.',
    timeAgo: '2 days ago',
    unread: false,
  },
];
