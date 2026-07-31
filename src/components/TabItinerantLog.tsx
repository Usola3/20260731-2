import React, { useState } from 'react';
import {
  Calendar,
  School,
  User,
  Clock,
  BookOpen,
  FileText,
  Save,
  Printer,
  Trash2,
  Search,
  CheckCircle2,
  Send,
  PlusCircle,
  Filter,
  Sparkles,
} from 'lucide-react';
import { ItinerantLog, GASConfig, Student } from '../types';

interface TabItinerantLogProps {
  logs: ItinerantLog[];
  students: Student[];
  gasConfig: GASConfig;
  onSaveLog: (log: ItinerantLog) => Promise<boolean>;
  onDeleteLog: (id: string) => void;
  onOpenPrintModal: (selectedLogs: ItinerantLog[]) => void;
  showToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const TabItinerantLog: React.FC<TabItinerantLogProps> = ({
  logs,
  students,
  gasConfig,
  onSaveLog,
  onDeleteLog,
  onOpenPrintModal,
  showToast,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<Omit<ItinerantLog, 'id' | 'createdAt'>>({
    date: todayStr,
    schoolName: '햇살초등학교',
    studentName: '김민준',
    gradeClass: '초등 3학년',
    startTime: '09:50',
    endTime: '10:30',
    period: '2교시',
    domain: '국어 / 의사소통',
    content: '',
    remarks: '',
    approvalPersons: {
      teacher: '박특수',
      teamLeader: '이순회',
      director: '김지원',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);

  // When student selection changes, auto-fill school and grade
  const handleStudentSelect = (name: string) => {
    const matched = students.find((s) => s.name === name);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        studentName: matched.name,
        schoolName: matched.schoolName,
        gradeClass: matched.gradeClass,
      }));
    } else {
      setFormData((prev) => ({ ...prev, studentName: name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.content.trim()) {
      showToast('학생명과 교육내용을 입력해 주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    const newLog: ItinerantLog = {
      ...formData,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const success = await onSaveLog(newLog);
    setIsSubmitting(false);

    if (success) {
      setFormData((prev) => ({
        ...prev,
        content: '',
        remarks: '',
      }));
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.date.includes(searchTerm)
  );

  const toggleSelectLog = (id: string) => {
    setSelectedLogIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePrintSelected = () => {
    const targetLogs = logs.filter((log) => selectedLogIds.includes(log.id));
    if (targetLogs.length === 0) {
      showToast('인쇄할 일지 항목을 선택해 주세요.', 'error');
      return;
    }
    onOpenPrintModal(targetLogs);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Info Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-violet-100 via-purple-100 to-indigo-100 border border-violet-200/80 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-violet-600 shadow-sm border border-violet-200 shrink-0">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>순회교육일지 작성 & 결재서식 인쇄</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              순회교육 일지를 작성하여 구글 스프레드시트에 자동 기록하고, 결재란이 포함된 A4 공식 문서로 언제든 출력하세요.
            </p>
          </div>
        </div>

        {gasConfig.webAppUrl ? (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0 shadow-sm">
            <Send className="w-4 h-4 text-emerald-500" />
            <span>GAS 구글 시트 자동 연동</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>로컬 보관 (상단 연동 클릭)</span>
          </div>
        )}
      </div>

      {/* Main Input Form */}
      <div className="bg-white border border-purple-100 rounded-3xl p-5 sm:p-7 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="border-b border-purple-50 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-500" />
              <span>일지 입력 폼</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">* 필수 작성 항목</span>
          </div>

          {/* Form Grid 1: Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Date */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-violet-500" />
                <span>날짜 *</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>

            {/* Student Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-violet-500" />
                <span>학생명 *</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.studentName}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.schoolName})
                    </option>
                  ))}
                  <option value="직접 입력">직접 입력...</option>
                </select>
              </div>
            </div>

            {/* School Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-violet-500" />
                <span>소속 학교명</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 햇살초등학교"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>

            {/* Grade/Class */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                <span>학급/학년</span>
              </label>
              <input
                type="text"
                placeholder="예: 초등 3학년"
                value={formData.gradeClass}
                onChange={(e) => setFormData({ ...formData, gradeClass: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Form Grid 2: Time & Domain */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Education Period */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-500" />
                <span>교시/시간 구분</span>
              </label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
              >
                <option value="1교시">1교시 (09:00~09:40)</option>
                <option value="2교시">2교시 (09:50~10:30)</option>
                <option value="3교시">3교시 (10:40~11:20)</option>
                <option value="4교시">4교시 (11:30~12:10)</option>
                <option value="5교시">5교시 (13:00~13:40)</option>
                <option value="6교시">6교시 (13:50~14:30)</option>
                <option value="기타/방과후">기타 / 방과후</option>
              </select>
            </div>

            {/* Time Start & End */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                교육 시간 (시작 ~ 종료)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-1/2 px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all text-center"
                />
                <span className="text-slate-400 font-bold">~</span>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-1/2 px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all text-center"
                />
              </div>
            </div>

            {/* Domain */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">교육 영역 / 과목</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
              >
                <option value="국어 / 의사소통">국어 / 의사소통</option>
                <option value="수학 / 자립생활">수학 / 자립생활</option>
                <option value="사회성 / 행동지원">사회성 / 행동지원</option>
                <option value="신체 / 소근육발달">신체 / 소근육발달</option>
                <option value="언어치료 / 감각통합">언어치료 / 감각통합 지원</option>
                <option value="진로직업 / 사회적응">진로직업 / 사회적응</option>
              </select>
            </div>
          </div>

          {/* Education Content Textarea */}
          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1.5">
              주요 교육내용 및 활동 상세 *
            </label>
            <textarea
              required
              rows={4}
              placeholder="1. 교수학습 활동 및 사용한 보조 교구&#10;2. 학생의 응답 반응 및 시도 모사&#10;3. 목표 달성 수준 및 촉진 방법..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-violet-500 focus:bg-white leading-relaxed transition-all"
            />
          </div>

          {/* Remarks */}
          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1.5">
              비고 및 관찰 특이사항 (행동 특성, 정서 상태, 요청사항)
            </label>
            <input
              type="text"
              placeholder="예: 활동 초기 주의산만하여 시각적 스케줄 제공 후 집중도 향상됨."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
            />
          </div>

          {/* Approval Teacher Names */}
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-bold">담당 교사 성명</label>
              <input
                type="text"
                value={formData.approvalPersons?.teacher}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    approvalPersons: { ...formData.approvalPersons!, teacher: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-bold">팀장 / 부장 성명</label>
              <input
                type="text"
                value={formData.approvalPersons?.teamLeader}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    approvalPersons: { ...formData.approvalPersons!, teamLeader: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-bold">원장 / 교장 성명</label>
              <input
                type="text"
                value={formData.approvalPersons?.director}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    approvalPersons: { ...formData.approvalPersons!, director: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-white border border-purple-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-violet-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>저장 및 구글 시트 전송 중...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>일지 저장하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Logs Table Section */}
      <div className="bg-white border border-purple-100 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-purple-50">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-500" />
              <span>작성된 순회교육일지 목록 ({filteredLogs.length}건)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              원하는 일지를 선택하여 공식 결재 서식으로 다운로드 및 A4 인쇄할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="학생명 / 학교명 / 영역 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:bg-white w-52 transition-all"
              />
            </div>

            {/* Print Selected Batch */}
            <button
              onClick={handlePrintSelected}
              className="px-3.5 py-2 rounded-2xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-violet-600" />
              <span>선택 인쇄 ({selectedLogIds.length})</span>
            </button>
            <button
              onClick={() => onOpenPrintModal(filteredLogs)}
              className="px-4 py-2 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-200 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>전체 서식 인쇄</span>
            </button>
          </div>
        </div>

        {/* Table List */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            기록된 순회교육일지가 없거나 검색 결과가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="border-b border-purple-100 bg-purple-50/50 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="p-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedLogIds.length === filteredLogs.length && filteredLogs.length > 0
                      }
                      onChange={(e) =>
                        setSelectedLogIds(
                          e.target.checked ? filteredLogs.map((l) => l.id) : []
                        )
                      }
                      className="rounded-md text-violet-600 focus:ring-violet-400 accent-violet-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">수업 날짜</th>
                  <th className="p-3">학생명 / 학교명</th>
                  <th className="p-3">시간 / 영역</th>
                  <th className="p-3">주요 교육 내용</th>
                  <th className="p-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const isChecked = selectedLogIds.includes(log.id);
                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-purple-50/30 transition-colors ${
                        isChecked ? 'bg-purple-50/60' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectLog(log.id)}
                          className="rounded-md text-violet-600 focus:ring-violet-400 accent-violet-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-extrabold text-violet-700">{log.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{log.schoolName}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">
                          {log.period} ({log.startTime}~{log.endTime})
                        </div>
                        <div className="text-[11px] text-emerald-600 font-bold">{log.domain}</div>
                      </td>
                      <td className="p-3 max-w-md">
                        <p className="line-clamp-2 text-slate-700 leading-relaxed text-[11px]">
                          {log.content}
                        </p>
                        {log.remarks && (
                          <div className="text-[10px] text-slate-400 mt-1 truncate">
                            비고: {log.remarks}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => onOpenPrintModal([log])}
                          className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3" />
                          <span>A4 서식</span>
                        </button>
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-[11px] transition-colors inline-flex items-center cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
