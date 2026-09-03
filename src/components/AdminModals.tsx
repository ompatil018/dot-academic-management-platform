import React, { useState } from 'react';
import { CourseOverviewItem } from '../types';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: CourseOverviewItem) => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onAddCourse }) => {
  const [name, setName] = useState('');
  const [hod, setHod] = useState('');
  const [totalClasses, setTotalClasses] = useState(12);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !hod.trim()) return;

    const newCourse: CourseOverviewItem = {
      id: `course-${Date.now()}`,
      name: name.trim(),
      code: `CS-${Date.now().toString().slice(-3)}`,
      hodId: 'user-hod-1',
      hodName: hod.trim(),
      totalClasses: Number(totalClasses) || 10,
      avgAttendance: 95,
      status: 'healthy',
      color: '#6D3DE8',
    };

    onAddCourse(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-manrope text-xl font-bold text-[#17151C]">Add Academic Course</h3>
          <button onClick={onClose} className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#17151C] mb-1">Course / Department Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Artificial Intelligence & Data Science"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#17151C] mb-1">Head of Department (HOD)</label>
            <input
              type="text"
              required
              value={hod}
              onChange={(e) => setHod(e.target.value)}
              placeholder="e.g. Dr. Ada Lovelace"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#17151C] mb-1">Total Divisions Planned</label>
            <input
              type="number"
              min={1}
              max={60}
              required
              value={totalClasses}
              onChange={(e) => setTotalClasses(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4EE]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] rounded-xl text-[13px] font-semibold hover:bg-[#F3EEFF] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0] transition-colors shadow-xs"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeacherAdded: (name: string, dept: string) => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, onTeacherAdded }) => {
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Computer Science & Design');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onTeacherAdded(name.trim(), dept);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-manrope text-xl font-bold text-[#17151C]">Register Faculty Member</h3>
          <button onClick={onClose} className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#17151C] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prof. Katherine Johnson"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#17151C] mb-1">Institutional Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="k.johnson@technova.edu"
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#17151C] mb-1">Department</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[14px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
            >
              <option value="Computer Science & Design">Computer Science & Design</option>
              <option value="Mechanical Eng.">Mechanical Eng.</option>
              <option value="Electronics & Telecom">Electronics & Telecom</option>
              <option value="AI & Data Science">AI & Data Science</option>
              <option value="Biotechnology">Biotechnology</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E4EE]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] rounded-xl text-[13px] font-semibold hover:bg-[#F3EEFF] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0] transition-colors shadow-xs"
            >
              Register Faculty
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ManageHodModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseOverviewItem[];
  onUpdateHod: (courseId: string, newHod: string) => void;
}

export const ManageHodModal: React.FC<ManageHodModalProps> = ({
  isOpen,
  onClose,
  courses,
  onUpdateHod,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-manrope text-xl font-bold text-[#17151C]">Manage Department Heads (HODs)</h3>
            <p className="text-[13px] text-[#6B6875]">Assign or update HOD authority across departments</p>
          </div>
          <button onClick={onClose} className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="divide-y divide-[#E8E4EE] max-h-80 overflow-y-auto mb-4">
          {courses.map((course) => (
            <div key={course.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[14px] font-bold text-[#17151C]">{course.name}</p>
                {editingId === course.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 px-3 py-1.5 text-[13px] border border-[#6D3DE8] rounded-xl bg-white text-[#17151C] outline-none"
                    placeholder="Enter HOD Full Name"
                  />
                ) : (
                  <p className="text-[13px] text-[#6B6875]">{course.hod}</p>
                )}
              </div>

              <div>
                {editingId === course.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (editName.trim()) {
                          onUpdateHod(course.id, editName.trim());
                        }
                        setEditingId(null);
                      }}
                      className="px-3 py-1 bg-[#6D3DE8] text-white text-[12px] font-bold rounded-lg shadow-xs hover:bg-[#5416D0]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 border border-[#E8E4EE] text-[12px] text-[#6B6875] rounded-lg hover:bg-[#F3EEFF]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(course.id);
                      setEditName(course.hod);
                    }}
                    className="text-[13px] font-bold text-[#6D3DE8] hover:text-[#4C1D95]"
                  >
                    Edit HOD
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-[#E8E4EE]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0] transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
