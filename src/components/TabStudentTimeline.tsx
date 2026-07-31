import React, { useState } from 'react';
import {
  Users,
  User,
  School,
  Calendar,
  Clock,
  BookOpen,
  Award,
  FileText,
  Printer,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Student, ItinerantLog, IEPGoal } from '../types';

interface TabStudentTimelineProps {
  students: Student[];
  logs: ItinerantLog[];
  iepGoals: IEPGoal[];
  onOpenPrintModal: (selectedLogs: ItinerantLog[]) => void;
}

export const TabStudentTimeline: React.FC<TabStudentTimelineProps> = ({
  students,
  logs,
  iepGoals,
  onOpenPrintModal,
}) => {
  const [selectedStudentName, setSelectedStudentName] = useState<string>(
    students[0]?.name || '김민준'
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentStudent = students.find((s) => s.name === selectedStudentName) || students[0];

  // Get student's itinerant logs
  const studentLogs = logs
    .filter((l) => l.studentName === selectedStudentName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter student logs by search term
  const filteredLogs = studentLogs.filter(
    (log) =>
      log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.date.includes(searchTerm)
  );

  // Get student's current IEP Goals
  const studentIEP = iepGoals.find((g) => g.studentName === selectedStudentName);

  return (
    <div className="space-y-6">
      {/* Top Banner & Student Selection */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-100 via-teal-100 to-indigo-100 border border-emerald-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>학생별 누적 지도 기록 & IEP 타임라인</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              학생을 선택하면 개별화교육 월별 목표와 그동안 작성한 지도 일지를 종합 타임라인으로 확인하실 수 있습니다.
            </p>
          </div>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-700 shrink-0">학생 선택:</span>
          <select
            value={selectedStudentName}
            onChange={(e) => setSelectedStudentName(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-emerald-300 text-slate-800 font-extrabold text-xs sm:text-sm focus:outline-none focus:border-emerald-500 shadow-sm min-w-[190px] transition-all"
          >
            {students.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} ({s.schoolName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Profile & Summary Cards Grid */}
      {currentStudent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Student Info Card */}
          <div className="bg-white border border-purple-100 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-purple-50 pb-2.5">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <User className="w-4 h-4 text-violet-500" />
                <span>학생 기본 정보</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700">
                {currentStudent.category || '특수교육대상자'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">성명:</span>
                <span className="font-extrabold text-slate-900 text-sm">{currentStudent.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">소속 학교:</span>
                <span className="font-bold text-slate-700">{currentStudent.schoolName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">학급/학년:</span>
                <span className="font-semibold text-slate-600">{currentStudent.gradeClass}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">담당 순회교사:</span>
                <span className="font-semibold text-slate-600">
                  {currentStudent.teacherInCharge || '박특수 교사'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white border border-purple-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-3">
            <div className="border-b border-purple-50 pb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>순회교육 누적 현황</span>
              </span>
              <button
                onClick={() => onOpenPrintModal(studentLogs)}
                disabled={studentLogs.length === 0}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 disabled:opacity-40 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>A4 인쇄</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="text-[11px] text-slate-500 font-medium">총 누적 일지</div>
                <div className="text-xl font-extrabold text-emerald-600 mt-0.5">
                  {studentLogs.length}회
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-violet-50/60 border border-violet-100">
                <div className="text-[11px] text-slate-500 font-medium">최근 지도일</div>
                <div className="text-xs font-extrabold text-violet-700 mt-2 truncate">
                  {studentLogs[0]?.date || '기록 없음'}
                </div>
              </div>
            </div>
          </div>

          {/* Current IEP Goal Card */}
          <div className="bg-white border border-purple-100 rounded-3xl p-5 shadow-sm space-y-2.5">
            <div className="border-b border-purple-50 pb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>현재 IEP 장기 목표</span>
              </span>
              <span className="text-[10px] text-pink-700 font-bold bg-pink-100 px-2 py-0.5 rounded-full">
                {studentIEP?.semester || '1학기'}
              </span>
            </div>

            <p className="text-xs text-slate-800 font-medium leading-relaxed line-clamp-2">
              {studentIEP?.longTermGoal || '설정된 장기 목표가 없습니다. IEP 관리 탭에서 작성해 주세요.'}
            </p>

            {/* Monthly Goals summary if present */}
            {studentIEP?.monthlyGoals && studentIEP.monthlyGoals.length > 0 && (
              <div className="pt-2 border-t border-purple-50 flex items-center gap-1 overflow-x-auto no-scrollbar">
                {studentIEP.monthlyGoals
                  .filter((m) => m.goal.trim())
                  .slice(0, 4)
                  .map((m, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 whitespace-nowrap"
                    >
                      {m.month}: {m.goal.substring(0, 8)}...
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div className="bg-white border border-purple-100 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-500" />
            <span>순회교육 지도 기록 타임라인 ({filteredLogs.length}건)</span>
          </h3>

          <div className="relative text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="내용 / 영역 / 날짜 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white w-full sm:w-60 transition-all"
            />
          </div>
        </div>

        {/* Timeline Cards */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            선택한 학생의 작성된 순회교육일지가 없습니다.
          </div>
        ) : (
          <div className="relative border-l-2 border-violet-100 ml-3 sm:ml-6 pl-4 sm:pl-8 space-y-6 my-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[25px] sm:-left-[41px] top-2 w-4 h-4 rounded-full bg-violet-500 border-4 border-white shadow-sm ring-2 ring-violet-200" />

                {/* Card Container */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 hover:bg-white hover:border-violet-300 transition-all">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">{log.date}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold text-[11px]">
                        {log.period} ({log.startTime}~{log.endTime})
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                        {log.domain}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenPrintModal([log])}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>A4 서식 인쇄</span>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                    {log.content}
                  </div>

                  {/* Remarks */}
                  {log.remarks && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                      <strong className="text-amber-700">비고/관찰사항:</strong> {log.remarks}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
