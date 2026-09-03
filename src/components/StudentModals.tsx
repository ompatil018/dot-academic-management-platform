import React, { useState } from 'react';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName?: string;
  subjectTitle?: string;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({
  isOpen,
  onClose,
  subjectName,
  subjectTitle,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  if (!isOpen) return null;

  const displayTitle = subjectName || subjectTitle || 'Data Structures & Algorithms';

  const modules = [
    {
      unit: 'Unit 1',
      title: 'Linear Data Structures & Algorithm Complexity',
      topics: 'Asymptotic notation, amortized analysis, stacks, queues, doubly & circular linked lists, applications.',
      hours: '10 Hours',
    },
    {
      unit: 'Unit 2',
      title: 'Non-Linear Trees & Hierarchical Structures',
      topics: 'Binary trees, AVL trees, Red-Black trees, B-Trees, heaps, priority queues, and trie structures.',
      hours: '12 Hours',
    },
    {
      unit: 'Unit 3',
      title: 'Graph Algorithms & Traversal Techniques',
      topics: 'BFS, DFS, Dijkstra shortest path, Bellman-Ford, Prim & Kruskal minimum spanning trees.',
      hours: '10 Hours',
    },
    {
      unit: 'Unit 4',
      title: 'Hashing & Advanced Dynamic Programming',
      topics: 'Hash collision resolution, universal hashing, memoization, knapsack problems, matrix chain multiplication.',
      hours: '8 Hours',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-start mb-4 border-b border-[#E8E4EE] pb-3">
          <div>
            <span className="text-[11px] font-bold text-[#6D3DE8] uppercase tracking-wider bg-[#F3EEFF] border border-[#E0D4FC] px-2.5 py-0.5 rounded-full">
              Verified Curriculum
            </span>
            <h3 className="font-manrope text-xl font-bold text-[#17151C] mt-1">
              {displayTitle} (CS-302)
            </h3>
            <p className="text-[13px] text-[#6B6875]">Faculty: Prof. Anjali Sharma • 4 Credits • Semester V</p>
          </div>
          <button onClick={onClose} className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {downloaded && (
          <div className="mb-3 p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-[13px] text-[#16A34A] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Official PDF syllabus package generated and downloaded.
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {modules.map((m) => (
            <div
              key={m.unit}
              className="p-3.5 bg-[#FDF7FF] rounded-xl border border-[#E8E4EE] hover:border-[#6D3DE8]/40 transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[12px] font-bold text-[#6D3DE8]">{m.unit}</span>
                <span className="text-[11px] font-semibold text-[#6B6875]">{m.hours}</span>
              </div>
              <h4 className="text-[14px] font-bold text-[#17151C] font-manrope">{m.title}</h4>
              <p className="text-[12px] text-[#6B6875] mt-1 leading-relaxed">{m.topics}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-3 border-t border-[#E8E4EE] flex items-center justify-between">
          <span className="text-[12px] text-[#6B6875]">Updated for Academic Year 2026-27</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E8E4EE] text-[#6B6875] rounded-xl text-[13px] font-semibold hover:bg-[#F3EEFF] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setDownloaded(true);
                setTimeout(() => setDownloaded(false), 4000);
              }}
              className="px-4 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FacultyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacultyContactModal: React.FC<FacultyContactModalProps> = ({ isOpen, onClose }) => {
  const [selectedFaculty, setSelectedFaculty] = useState('Prof. Anjali Sharma (Class Teacher)');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#17151C]/50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4EE] shadow-[0_16px_40px_rgba(23,21,28,0.12)] animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4 border-b border-[#E8E4EE] pb-3">
          <h3 className="font-manrope text-xl font-bold text-[#17151C]">Contact Faculty Member</h3>
          <button onClick={onClose} className="text-[#6B6875] hover:text-[#17151C] p-1 rounded-lg hover:bg-[#F3EEFF]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center">
            <span className="material-symbols-outlined text-[48px] text-[#16A34A] mb-2">
              mark_email_read
            </span>
            <p className="font-bold text-[#17151C] font-manrope">Message Dispatched!</p>
            <p className="text-[13px] text-[#6B6875] mt-1">
              Your academic inquiry has been relayed to {selectedFaculty.split(' ')[1]} via internal DOT relay.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                Faculty Member
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
              >
                <option value="Prof. Anjali Sharma (Class Teacher)">Prof. Anjali Sharma (Class Teacher - Data Structures)</option>
                <option value="Dr. Rajesh Rao (HOD - Computer Science & Design)">Dr. Rajesh Rao (HOD - CSD)</option>
                <option value="Prof. Verma (Operating Systems)">Prof. Verma (Operating Systems)</option>
                <option value="Prof. Sharma (Computer Networks)">Prof. Sharma (Computer Networks)</option>
                <option value="Mr. Amit Gupta (Database Lab)">Mr. Amit Gupta (Database Lab)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#17151C] mb-1">
                Message / Academic Query
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about assignments, lecture doubts, or proctor office hours..."
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E4EE] rounded-xl text-[13px] text-[#17151C] outline-none focus:border-[#6D3DE8] focus:ring-2 focus:ring-[#6D3DE8]/20"
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
                className="px-5 py-2 bg-[#6D3DE8] text-white rounded-xl text-[13px] font-bold hover:bg-[#5416D0] flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                Send Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
