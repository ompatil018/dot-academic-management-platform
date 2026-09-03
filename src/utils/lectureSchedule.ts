import { TimetableLecture } from '../types';

export interface LectureTimeStatus {
  currentLecture: TimetableLecture | null;
  nextLecture: TimetableLecture | null;
  timeRemainingMinutes?: number;
  currentDay: string;
  currentTimeString: string;
  isSimulated?: boolean;
}

// Convert "10:00 AM" or "01:00 PM" into minutes from midnight
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/(\d+):(\d+)\s*(AM|PM)/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export function getDynamicLectureStatus(
  timetable: TimetableLecture[],
  filterTeacherId?: string,
  simulatedTimeMinutes?: number // Optional minutes from midnight for testing
): LectureTimeStatus {
  const now = new Date();
  const currentDayIndex = now.getDay();
  let dayName = DAY_NAMES[currentDayIndex];

  // If weekend, default query to Monday so students/teachers can preview upcoming week
  if (dayName === 'Sunday' || dayName === 'Saturday') {
    dayName = 'Monday';
  }

  // Calculate minutes from midnight
  let currentMinutes: number;
  let isSimulated = false;

  if (typeof simulatedTimeMinutes === 'number') {
    currentMinutes = simulatedTimeMinutes;
    isSimulated = true;
  } else {
    currentMinutes = now.getHours() * 60 + now.getMinutes();
  }

  // Filter lectures for the day
  let dayLectures = timetable.filter(
    (item) => item.day === dayName && item.type !== 'Break'
  );

  if (filterTeacherId) {
    dayLectures = dayLectures.filter(
      (item) => item.teacherId === filterTeacherId || (item.teacher && item.teacher.includes(filterTeacherId))
    );
  }

  // Sort chronologically
  dayLectures.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

  let currentLecture: TimetableLecture | null = null;
  let nextLecture: TimetableLecture | null = null;
  let timeRemainingMinutes = 0;

  for (let i = 0; i < dayLectures.length; i++) {
    const start = parseTimeToMinutes(dayLectures[i].time);
    const end = parseTimeToMinutes(dayLectures[i].endTime);

    if (currentMinutes >= start && currentMinutes < end) {
      currentLecture = dayLectures[i];
      timeRemainingMinutes = end - currentMinutes;
      // Next lecture is the one after current
      if (i + 1 < dayLectures.length) {
        nextLecture = dayLectures[i + 1];
      }
      break;
    } else if (currentMinutes < start) {
      // First lecture that hasn't started yet is the next lecture
      if (!nextLecture) {
        nextLecture = dayLectures[i];
      }
    }
  }

  // If no lecture is currently running (e.g. outside college hours),
  // fallback to active flagged lecture or first scheduled lecture of the day
  if (!currentLecture && dayLectures.length > 0) {
    const activeFlagged = dayLectures.find((l) => l.active);
    if (activeFlagged) {
      currentLecture = activeFlagged;
      const idx = dayLectures.indexOf(activeFlagged);
      nextLecture = idx + 1 < dayLectures.length ? dayLectures[idx + 1] : null;
      timeRemainingMinutes = 45;
    } else if (!nextLecture) {
      currentLecture = dayLectures[0];
      nextLecture = dayLectures.length > 1 ? dayLectures[1] : null;
      timeRemainingMinutes = 60;
    } else {
      // nextLecture exists, so we can display nextLecture or use first lecture as current
      currentLecture = dayLectures[0];
      timeRemainingMinutes = 40;
    }
  }
  const displayHours = Math.floor(currentMinutes / 60);
  const displayMins = currentMinutes % 60;
  const ampm = displayHours >= 12 ? 'PM' : 'AM';
  const hour12 = displayHours % 12 || 12;
  const currentTimeString = `${String(hour12).padStart(2, '0')}:${String(displayMins).padStart(2, '0')} ${ampm}`;

  return {
    currentLecture,
    nextLecture,
    timeRemainingMinutes,
    currentDay: dayName,
    currentTimeString,
    isSimulated,
  };
}
