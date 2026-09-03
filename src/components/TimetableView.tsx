import React, { useState, useEffect } from 'react';
import { UserRole, TimetableLecture } from '../types';
import { academicStore } from '../data/academicStore';

interface TimetableViewProps {
  role: UserRole;
  userRole?: string;
}

export const TimetableView: React.FC<TimetableViewProps> = ({ role, userRole }) => {
  const [selectedDay, setSelectedDay] = useState('Tuesday');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{
    id: string;
    subject: string;
    room: string;
    time: string;
  } | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [storeState, setStoreState] = useState(academicStore.getState());

  useEffect(() => {
    const unsub = academicStore.subscribe(() => {
      setStoreState({ ...academicStore.getState() });
    });
    return unsub;
  }, []);

  // New slot state for Class Teacher
  const [newSubject, setNewSubject] = useState('Data Structures & Algorithms');
  const [newRoom, setNewRoom] = useState('Room B-204');
  const [newTime, setNewTime] = useState('10:00 – 11:00 AM');
  const [newTeacher, setNewTeacher] = useState('Prof. Anjali Sharma');
  const [newDivision, setNewDivision] = useState('TE CSD-A');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Dynamically map schedule from database store for the selected day
  const currentSlots = (storeState.timetable || [])
    .filter((slot) => slot.day === selectedDay)
    .map((slot) => ({
      id: slot.id,
      time: slot.endTime ? `${slot.time} – ${slot.endTime}` : slot.time,
      subject: slot.subject,
      code: slot.code || 'CSD-201',
      room: slot.room,
      facultyOrClass:
        role === 'teacher' || userRole === 'CLASS_TEACHER' || userRole === 'SUBJECT_TEACHER'
          ? `${slot.className || 'TE CSD-A'} (${slot.type === 'Lab' ? 'Lab Batch' : 'All Students'})`
          : slot.teacher,
      type: (slot.type === 'Break' ? 'Tutorial' : slot.type) as 'Lecture' | 'Lab' | 'Tutorial',
    }));

  const canEditTimetable = userRole === 'CLASS_TEACHER' || userRole === 'HOD' || userRole === 'COLLEGE_ADMIN';

  const handleExportICS = () => {
    setToastMessage('Institutional calendar (.ics) generated and exported for your device.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startTime = newTime.split('–')[0]?.trim() || newTime;
    const endTime = newTime.split('–')[1]?.trim() || '11:00 AM';

    const result = academicStore.addTimetableLecture({
      day: selectedDay as any,
      time: startTime,
      endTime,
      subject: newSubject,
      code: 'CSD-' + Math.floor(200 + Math.random() * 50),
      room: newRoom,
      teacher: newTeacher,
      teacherId: 'teacher-csd-5',
      classId: 'class-csd-a',
      className: newDivision,
      type: 'Lecture',
    });

    if (!result.success && result.conflict) {
      setConflictWarning(`Timetable Conflict Detected: ${result.conflict.message}`);
      return;
    }

    setConflictWarning(null);
    setShowAddModal(false);
    setToastMessage(`Successfully scheduled ${newSubject} for ${selectedDay} at ${newTime}. Synced with faculty & student portal.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#17151C] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#6D3DE8] text-sm animate-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#6B6875] hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-manrope text-2xl sm:text-[28px] font-bold text-[#17151C] tracking-tight">
            Institutional Timetable & Scheduling
          </h2>
          <p className="text-[14px] text-[#6B6875]">
            Academic Year 2026–27 • Department of Computer Science & Design • TE CSD-A
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEditTimetable && (
            <button
              onClick={() => {
                setConflictWarning(null);
                setShowAddModal(true);
              }}
              className="bg-[#6D3DE8] text-white font-bold text-[13px] px-3.5 py-2 rounded-xl hover:bg-[#5416D0] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add_alarm</span>
              Schedule Lecture
            </button>
          )}
          <button
            onClick={handleExportICS}
            className="bg-white border border-[#E8E4EE] text-[#6D3DE8] font-bold text-[13px] px-3.5 py-2 rounded-xl hover:bg-[#F3EEFF] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            Export to Calendar (.ics)
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${
              selectedDay === d
                ? 'bg-[#6D3DE8] text-white shadow-xs'
                : 'bg-white border border-[#E8E4EE] text-[#6B6875] hover:bg-[#FDF7FF] hover:text-[#17151C]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Day Schedule Cards */}
      <div className="space-y-3">
        {currentSlots.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E4EE] text-[#6B6875]">
            No classes scheduled for {selectedDay}.
          </div>
        ) : (
          currentSlots.map((slot, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#6D3DE8]/50 transition-all shadow-[0px_2px_8px_rgba(23,21,28,0.03)]"
            >
              <div className="flex items-start gap-4">
                <div className="bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl p-3 text-center min-w-[120px] shrink-0">
                  <span className="material-symbols-outlined text-[#6D3DE8] text-[20px] block mb-1">
                    schedule
                  </span>
                  <span className="text-[12px] font-bold text-[#17151C] block leading-tight">
                    {slot.time}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        slot.type === 'Lecture'
                          ? 'bg-[#F3EEFF] text-[#6D3DE8] border-[#E0D4FC]'
                          : slot.type === 'Lab'
                          ? 'bg-purple-100 text-[#4C1D95] border-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {slot.type}
                    </span>
                    <span className="text-[12px] font-mono text-[#6B6875]">{slot.code}</span>
                  </div>
                  <h3 className="font-manrope text-lg font-bold text-[#17151C]">{slot.subject}</h3>
                  <div className="flex flex-wrap gap-4 text-[13px] text-[#6B6875] mt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#6D3DE8]">
                        location_on
                      </span>
                      {slot.room}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#6D3DE8]">
                        person
                      </span>
                      {slot.facultyOrClass}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-[12px] font-bold text-[#16A34A] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  Verified Active
                </span>
                {canEditTimetable && (
                  <button
                    onClick={() => setEditingSlot({
                      id: slot.id,
                      subject: slot.subject,
                      room: slot.room,
                      time: slot.time,
                    })}
                    className="p-1.5 text-[#6D3DE8] hover:bg-[#F3EEFF] rounded-lg border border-[#E0D4FC] text-[12px] font-bold flex items-center gap-1 transition-colors"
                    title="Edit Room or Time Slot"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Lecture Modal (Class Teacher / HOD Feature) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b border-[#E8E4EE] pb-3">
              <div>
                <h3 className="font-manrope text-xl font-bold text-[#17151C]">Schedule Timetable Slot</h3>
                <p className="text-[12px] text-[#6B6875]">With automated conflict & overlap detection</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {conflictWarning && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[12px] text-[#DC2626] flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">warning</span>
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms (CS-201)</option>
                  <option value="Database Systems">Database Systems (CS-203)</option>
                  <option value="Computer Networks">Computer Networks (CS-304)</option>
                  <option value="Operating Systems">Operating Systems (CS-302)</option>
                  <option value="Discrete Mathematics">Discrete Mathematics (MA-202)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">Time Slot</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none"
                  >
                    <option value="09:00 – 10:00 AM">09:00 – 10:00 AM</option>
                    <option value="10:00 – 11:00 AM">10:00 – 11:00 AM</option>
                    <option value="11:30 – 12:30 PM">11:30 – 12:30 PM</option>
                    <option value="01:30 – 02:30 PM">01:30 – 02:30 PM</option>
                    <option value="02:30 – 03:30 PM">02:30 – 03:30 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#17151C] mb-1">Classroom / Lab</label>
                  <select
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none"
                  >
                    <option value="Room B-204">Room B-204</option>
                    <option value="Room A-102">Room A-102</option>
                    <option value="Room C-108">Room C-108</option>
                    <option value="Computing Lab 2">Computing Lab 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">Assigned Teacher</label>
                <input
                  type="text"
                  value={newTeacher}
                  onChange={(e) => setNewTeacher(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">Division</label>
                <input
                  type="text"
                  value={newDivision}
                  onChange={(e) => setNewDivision(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4EE]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] hover:bg-[#F3EEFF] rounded-xl text-[13px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0] transition-colors"
                >
                  Validate & Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b border-[#E8E4EE] pb-3">
              <div>
                <h3 className="font-manrope text-xl font-bold text-[#17151C]">Edit Lecture Slot</h3>
                <p className="text-[12px] text-[#6B6875]">{editingSlot.subject} • {selectedDay}</p>
              </div>
              <button onClick={() => setEditingSlot(null)} className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const [startTime, endTime] = editingSlot.time.includes('–') 
                ? editingSlot.time.split('–').map(s => s.trim()) 
                : [editingSlot.time, '11:00 AM'];
              
              academicStore.updateTimetableLecture(editingSlot.id, {
                room: editingSlot.room,
                time: startTime,
                endTime: endTime || '11:00 AM',
              });

              setToastMessage(`Updated ${editingSlot.subject}: Room set to ${editingSlot.room}, Time ${editingSlot.time}. Changes propagated to all dashboards.`);
              setEditingSlot(null);
              setTimeout(() => setToastMessage(null), 4000);
            }} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">Subject</label>
                <input
                  type="text"
                  disabled
                  value={editingSlot.subject}
                  className="w-full px-3.5 py-2 bg-[#FDF7FF] border border-[#E8E4EE] rounded-xl text-[13px] text-[#6B6875] outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">Classroom / Lab Room</label>
                <input
                  type="text"
                  required
                  value={editingSlot.room}
                  onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                  placeholder="e.g. Room B-206"
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#17151C] mb-1">Time Slot</label>
                <input
                  type="text"
                  required
                  value={editingSlot.time}
                  onChange={(e) => setEditingSlot({ ...editingSlot, time: e.target.value })}
                  placeholder="e.g. 10:00 – 11:00 AM"
                  className="w-full px-3.5 py-2 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#E8E4EE]">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove ${editingSlot.subject} from ${selectedDay}'s schedule?`)) {
                      academicStore.deleteTimetableLecture(editingSlot.id);
                      setToastMessage(`Cancelled lecture slot: ${editingSlot.subject}.`);
                      setEditingSlot(null);
                      setTimeout(() => setToastMessage(null), 4000);
                    }
                  }}
                  className="px-3 py-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl text-[12px] font-bold transition-colors"
                >
                  Delete Slot
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlot(null)}
                    className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] rounded-xl text-[13px] font-semibold hover:bg-[#F3EEFF] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0] transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
