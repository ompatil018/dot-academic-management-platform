# DOT – Decision of Teacher

> A role-based academic management platform designed to connect college administration, teachers, and students through a unified digital ecosystem.

[![Status](https://img.shields.io/badge/Status-Active-success)]()
[![Academic Year](https://img.shields.io/badge/Academic%20Year-2026--27-blue)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB)]()
[![Database](https://img.shields.io/badge/Database-Firebase%20Firestore-FFCA28)]()
[![Authentication](https://img.shields.io/badge/Auth-Firebase%20Authentication-FFCA28)]()

---

## 📌 About DOT

**DOT (Decision of Teacher)** is a college academic management platform designed to simplify and centralize day-to-day academic operations.

The platform connects:

**College → Course → HOD → Class → Class Teacher → Subject Teacher → Students**

DOT provides role-based dashboards where every user gets access to the information and actions relevant to their authority.

The system focuses on:

- Academic management
- Smart timetable management
- Attendance management
- Student management
- Teacher management
- Notifications
- Academic reports
- Role-based access
- Academic year management
- Offline-first support
- Real-time data synchronization

---

## 🎯 Problem Statement

Traditional college academic processes often depend on multiple disconnected systems for:

- Timetables
- Attendance
- Student records
- Teacher assignments
- Notifications
- Academic reports
- Registration approvals

This creates information gaps, duplicate work, delayed communication, and difficulty in managing academic changes.

DOT aims to bring these activities into a single connected platform.

---

## 💡 Solution

DOT provides a centralized academic ecosystem where:

- College administrators manage the institution.
- HODs manage their respective courses.
- Class Teachers manage their assigned classes.
- Subject Teachers manage lectures and attendance.
- Students access their timetable, attendance, and academic information.

Changes made in the system can propagate across connected dashboards.

For example:

Timetable Change
→ Teacher Dashboard
→ Student Dashboard
→ NOW/NEXT Lecture
→ Notification

Similarly:

Attendance Update
→ Student Attendance
→ Class Attendance
→ Subject Statistics
→ Reports

---

# 🚀 Key Features

## 🏫 College Administration

- College management
- Course management
- Class management
- Teacher management
- HOD management
- Registration approvals
- College-wide attendance
- Timetable visibility
- Academic reports
- Academic year management

---

## 👨‍💼 HOD Dashboard

HODs can manage their assigned course-level academic activities.

Features:

- Course overview
- Class management
- Teacher management
- Subject management
- Class Teacher assignment
- Timetable management
- Attendance monitoring
- Low-attendance monitoring
- Academic reports

---

## 👩‍🏫 Class Teacher Dashboard

Class Teachers have authority over their assigned class.

Features:

- Student roster
- Class timetable
- Attendance management
- Daily lecture logs
- Monthly attendance records
- Student registration approvals
- Notifications
- Reports
- Timetable management

---

## 👨‍🏫 Subject Teacher Dashboard

Subject Teachers can manage their assigned teaching activities.

Features:

- Assigned classes
- Assigned subjects
- Today's timetable
- Current lecture
- Next lecture
- Attendance
- Lecture history
- Subject performance
- Temporary timetable changes
- Lecture cancellation
- Substitute teacher workflow

---

## 🎓 Student Dashboard

Students can access their academic information through a personalized dashboard.

Features:

- Student profile
- Class information
- Today's timetable
- Current lecture
- Next lecture
- Notifications
- Overall attendance
- Subject-wise attendance
- Monthly attendance
- Lecture history

---

# 📅 Smart Timetable

DOT supports structured timetable management.

Each lecture can contain:

- Day
- Start time
- End time
- Subject
- Teacher
- Room
- Theory / Practical
- Break

The system supports:

- Add lecture
- Edit lecture
- Delete lecture
- Room changes
- Teacher changes
- Subject changes
- Lecture cancellation
- Substitute teacher
- Temporary schedule changes
- Conflict detection

---

# 📊 Attendance Management

DOT provides a centralized attendance system.

Attendance can be tracked at:

- Student level
- Subject level
- Class level
- Teacher level
- Monthly level
- Academic-year level

### Attendance Formula

```text
Attendance % =
(Present Lectures / Total Conducted Lectures) × 100
