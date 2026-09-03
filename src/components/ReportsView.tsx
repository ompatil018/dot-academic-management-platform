import React, { useState } from 'react';
import { UserRole } from '../types';
import { academicStore } from '../data/academicStore';

interface ReportsViewProps {
  role: UserRole;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ role }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'monthly' | 'class' | 'subject' | 'low_attendance'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const state = academicStore.getState();
  const students = state.students || [];
  const lowAttendanceList = students.filter((s) => (s.percentage || 100) < 75);

  const handleExportCSV = (reportName: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportName.includes('Low Attendance')) {
      csvContent += 'Roll No,Name,Class,Attendance Percentage,Status\n';
      lowAttendanceList.forEach((s) => {
        csvContent += `${s.rollNo},${s.name},TE CSD-A,${s.percentage}%,Critical (<75%)\n`;
      });
    } else {
      csvContent += 'Roll No,Name,Class,Attendance Percentage,Status\n';
      students.forEach((s) => {
        csvContent += `${s.rollNo},${s.name},TE CSD-A,${s.percentage || 85}%,${(s.percentage || 85) >= 75 ? 'Eligible' : 'Detained'}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Exported "${reportName}" to CSV successfully.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownload = (docName: string, format: string = 'PDF') => {
    if (format === 'CSV') {
      handleExportCSV(docName);
      return;
    }
    setToastMessage(`Generated signed document "${docName}" (${format}).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const reportsList = [
    {
      id: 'rep-1',
      category: 'monthly',
      title: 'Monthly Department Attendance Audit - October 2026',
      type: 'PDF Record',
      size: '2.4 MB',
      date: 'Generated Oct 28, 2026',
    },
    {
      id: 'rep-2',
      category: 'class',
      title: 'Class-wise Attendance & Division Performance Ledger (All 32 Classes)',
      type: 'CSV Data',
      size: '640 KB',
      date: 'Generated Oct 26, 2026',
    },
    {
      id: 'rep-3',
      category: 'subject',
      title: 'Subject-wise Attendance Distribution Report (Data Structures, DBMS, OS)',
      type: 'Excel Spreadsheet',
      size: '1.2 MB',
      date: 'Generated Oct 25, 2026',
    },
    {
      id: 'rep-4',
      category: 'low_attendance',
      title: 'Low Attendance Student List (<75% Detention Warning Roster)',
      type: 'CSV Data',
      size: '320 KB',
      date: 'Generated Oct 27, 2026',
    },
    {
      id: 'rep-5',
      category: 'monthly',
      title: 'Semester Midterm Examination Eligibility List',
      type: 'PDF Record',
      size: '840 KB',
      date: 'Generated Oct 24, 2026',
    },
    {
      id: 'rep-6',
      category: 'class',
      title: 'Faculty Workload & Timetable Assignment Audit',
      type: 'PDF Record',
      size: '1.8 MB',
      date: 'Generated Oct 15, 2026',
    },
  ];

  const filteredReports = activeFilter === 'all'
    ? reportsList
    : reportsList.filter((r) => r.category === activeFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
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
            Academic Performance & Audit Reports
          </h2>
          <p className="text-[14px] text-[#6B6875]">
            Detailed metrics, compliance documentation, and semester analytical summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV('College_Attendance_Master')}
            className="bg-white border border-[#E8E4EE] text-[#17151C] font-bold text-[13px] px-3.5 py-2 rounded-xl hover:bg-[#FDF7FF] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#6D3DE8]">table_view</span>
            Export CSV
          </button>
          <button
            onClick={() => handleDownload('Full Institutional Audit Report', 'PDF')}
            className="bg-[#6D3DE8] text-white font-bold text-[13px] px-4 py-2 rounded-xl hover:bg-[#5416D0] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Curriculum Velocity</span>
            <span className="material-symbols-outlined text-[#6D3DE8]">speed</span>
          </div>
          <span className="font-manrope text-3xl font-extrabold text-[#17151C]">78.4%</span>
          <p className="text-[12px] text-[#16A34A] font-bold mt-1">On schedule with syllabus milestone</p>
        </div>

        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Classroom Utilization</span>
            <span className="material-symbols-outlined text-[#6D3DE8]">domain</span>
          </div>
          <span className="font-manrope text-3xl font-extrabold text-[#17151C]">91.2%</span>
          <p className="text-[12px] text-[#6B6875] mt-1">42 of 46 rooms assigned in peak slots</p>
        </div>

        <div className="bg-white border border-[#E8E4EE] rounded-2xl p-5 shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-[#6B6875] uppercase tracking-wider">Faculty Punctuality</span>
            <span className="material-symbols-outlined text-[#6D3DE8]">verified</span>
          </div>
          <span className="font-manrope text-3xl font-extrabold text-[#16A34A]">98.6%</span>
          <p className="text-[12px] text-[#6B6875] mt-1">Sessions started within grace threshold</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-[#E8E4EE] pb-2">
        {[
          { id: 'all', label: 'All Reports' },
          { id: 'monthly', label: 'Monthly Attendance' },
          { id: 'class', label: 'Class-wise Reports' },
          { id: 'subject', label: 'Subject-wise Reports' },
          { id: 'low_attendance', label: `Low Attendance Alerts (${lowAttendanceList.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-colors ${
              activeFilter === tab.id
                ? 'bg-[#6D3DE8] text-white shadow-xs'
                : 'bg-white text-[#6B6875] hover:bg-[#F3EEFF] hover:text-[#6D3DE8] border border-[#E8E4EE]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Listing */}
      <div className="bg-white border border-[#E8E4EE] rounded-2xl overflow-hidden shadow-[0px_2px_8px_rgba(23,21,28,0.03)]">
        <div className="p-4 sm:p-5 border-b border-[#E8E4EE] bg-[#FDF7FF] flex justify-between items-center">
          <div>
            <h3 className="font-manrope text-lg font-bold text-[#17151C]">Available Academic Records</h3>
            <p className="text-[12px] text-[#6B6875]">Download signed institutional audit summaries & export spreadsheets</p>
          </div>
        </div>

        <div className="divide-y divide-[#E8E4EE]">
          {filteredReports.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDF7FF] transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F3EEFF] border border-[#E0D4FC] flex items-center justify-center text-[#6D3DE8] shrink-0">
                  <span className="material-symbols-outlined text-[22px]">
                    {item.type.includes('CSV') || item.type.includes('Spreadsheet') ? 'table_chart' : 'description'}
                  </span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#17151C] font-manrope">{item.title}</h4>
                  <p className="text-[12px] text-[#6B6875]">
                    {item.type} • {item.size} • {item.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {item.type.includes('CSV') ? (
                  <button
                    onClick={() => handleExportCSV(item.title)}
                    className="text-[#6D3DE8] hover:text-[#4C1D95] font-bold text-[13px] flex items-center gap-1 bg-[#F3EEFF] hover:bg-[#E0D4FC] px-3.5 py-1.5 rounded-xl border border-[#E0D4FC] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">file_download</span>
                    Download CSV
                  </button>
                ) : (
                  <button
                    onClick={() => handleDownload(item.title, 'PDF')}
                    className="text-[#6D3DE8] hover:text-[#4C1D95] font-bold text-[13px] flex items-center gap-1 bg-[#F3EEFF] hover:bg-[#E0D4FC] px-3.5 py-1.5 rounded-xl border border-[#E0D4FC] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
