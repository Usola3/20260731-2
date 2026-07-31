import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  User,
  BookOpen,
  Award,
  CheckCircle2,
  RefreshCw,
  Save,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Plus,
  Trash2,
} from 'lucide-react';
import { Student, IEPGoal, ItinerantLog, MonthlyGoal } from '../types';

interface TabIEPManagementProps {
  students: Student[];
  iepGoals: IEPGoal[];
  logs: ItinerantLog[];
  onSaveIEPGoal: (iep: IEPGoal) => void;
  showToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

const DEFAULT_1ST_SEMESTER_MONTHS = ['3월', '4월', '5월', '6월', '7월'];
const DEFAULT_2ND_SEMESTER_MONTHS = ['9월', '10월', '11월', '12월', '1월'];

export const TabIEPManagement: React.FC<TabIEPManagementProps> = ({
  students,
  iepGoals,
  logs,
  onSaveIEPGoal,
  showToast,
}) => {
  const [selectedStudentName, setSelectedStudentName] = useState<string>(
    students[0]?.name || '김민준'
  );
  const [semester, setSemester] = useState<string>('1학기');
  const [domain, setDomain] = useState<string>('국어 / 의사소통');

  const [currentIEP, setCurrentIEP] = useState<IEPGoal>({
    id: `iep-${Date.now()}`,
    studentName: selectedStudentName,
    schoolName: '햇살초등학교',
    academicYear: '2026학년도',
    semester: '1학기',
    domain: '국어 / 의사소통',
    longTermGoal: '',
    monthlyGoals: DEFAULT_1ST_SEMESTER_MONTHS.map((m) => ({ month: m, goal: '' })),
    evaluationText: '',
    updatedAt: new Date().toISOString(),
  });

  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Load existing IEP Goal when student/semester/domain changes
  useEffect(() => {
    const matchedStudent = students.find((s) => s.name === selectedStudentName);
    const existing = iepGoals.find(
      (g) => g.studentName === selectedStudentName && g.semester === semester
    );

    if (existing) {
      // Ensure monthlyGoals format exists
      let mgList = existing.monthlyGoals;
      if (!mgList || mgList.length === 0) {
        // Fallback convert shortTermGoals if existing
        if (existing.shortTermGoals && existing.shortTermGoals.length > 0) {
          mgList = existing.shortTermGoals.map((st, idx) => ({
            month: `${idx + 3}월`,
            goal: st,
          }));
        } else {
          const defaultMonths =
            semester === '2학기' ? DEFAULT_2ND_SEMESTER_MONTHS : DEFAULT_1ST_SEMESTER_MONTHS;
          mgList = defaultMonths.map((m) => ({ month: m, goal: '' }));
        }
      }
      setCurrentIEP({
        ...existing,
        monthlyGoals: mgList,
      });
      setDomain(existing.domain);
    } else {
      const defaultMonths =
        semester === '2학기' ? DEFAULT_2ND_SEMESTER_MONTHS : DEFAULT_1ST_SEMESTER_MONTHS;
      setCurrentIEP({
        id: `iep-${Date.now()}`,
        studentName: selectedStudentName,
        schoolName: matchedStudent?.schoolName || '특수학급',
        academicYear: '2026학년도',
        semester: semester,
        domain: domain,
        longTermGoal: '기초 낱말의 뜻을 이해하고 자발적 의사소통 표현 능력을 향상시킨다.',
        monthlyGoals: defaultMonths.map((m, idx) => ({
          month: m,
          goal:
            idx === 0
              ? '그림 카드를 보고 해당 단어 낱말 카드를 80% 이상 정확히 매칭하기'
              : idx === 1
              ? '2음절 기초 단어를 소리 내어 읽고 뜻 이해하기'
              : idx === 2
              ? '교사의 음성 시범을 듣고 2음절 단어를 정확히 받아쓰기'
              : '',
        })),
        evaluationText: '',
        updatedAt: new Date().toISOString(),
      });
    }
    setAiRecommendation('');
  }, [selectedStudentName, semester, students, iepGoals]);

  // Filter student's itinerant log history
  const studentLogs = logs.filter((l) => l.studentName === selectedStudentName);

  // Trigger Gemini AI IEP Evaluation Generation
  const handleGenerateAIEvaluation = async () => {
    if (!currentIEP.longTermGoal.trim()) {
      showToast('IEP 장기목표를 먼저 입력해 주세요.', 'error');
      return;
    }

    setIsGenerating(true);
    setAiRecommendation('');

    try {
      const response = await fetch('/api/gemini/iep-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName: selectedStudentName,
          schoolName: currentIEP.schoolName,
          iepGoal: currentIEP.longTermGoal,
          area: currentIEP.domain,
          semester: `${currentIEP.academicYear} ${currentIEP.semester}`,
          logHistory: studentLogs,
          monthlyGoals: currentIEP.monthlyGoals,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Gemini AI 문구 생성 실패');
      }

      setAiRecommendation(data.recommendation);
      showToast('Gemini AI가 월별 목표 및 일지 기반 IEP 평가 문구를 생성했습니다!', 'success');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'AI 평가 추천 생성 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyAiText = () => {
    if (!aiRecommendation) return;
    setCurrentIEP((prev) => ({
      ...prev,
      evaluationText: aiRecommendation,
    }));
    showToast('AI 추천 문구가 평가란에 적용되었습니다.', 'info');
  };

  const handleCopyAiText = () => {
    if (!aiRecommendation) return;
    navigator.clipboard.writeText(aiRecommendation);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleMonthlyGoalChange = (index: number, field: 'month' | 'goal', value: string) => {
    const updated = [...currentIEP.monthlyGoals];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentIEP({ ...currentIEP, monthlyGoals: updated });
  };

  const handleAddMonthlyGoal = () => {
    const nextMonthNum = currentIEP.monthlyGoals.length + 3;
    const newMonthLabel = `${nextMonthNum > 12 ? nextMonthNum - 12 : nextMonthNum}월`;
    setCurrentIEP({
      ...currentIEP,
      monthlyGoals: [...currentIEP.monthlyGoals, { month: newMonthLabel, goal: '' }],
    });
  };

  const handleRemoveMonthlyGoal = (index: number) => {
    const updated = currentIEP.monthlyGoals.filter((_, i) => i !== index);
    setCurrentIEP({ ...currentIEP, monthlyGoals: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveIEPGoal({
      ...currentIEP,
      updatedAt: new Date().toISOString(),
    });
    showToast(`${selectedStudentName} 학생의 IEP 목표 및 월별 목표가 저장되었습니다.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 border border-pink-200/80 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-pink-500 shadow-sm border border-pink-200 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>IEP 목표 & 월별 세부 목표 관리</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500 text-white font-bold">
                월별 목표 지원 🌸
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              학기 장기목표와 <strong className="text-pink-600">월별 상세 목표(3월~7월 / 9월~1월)</strong>를 설정하고, 누적 일지({studentLogs.length}건)를 분석하여 AI 평가 총평을 자동 추천받으세요.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: IEP Input & Monthly Goals (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-purple-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="border-b border-purple-50 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-500" />
                <span>학생 선택 및 IEP 월별 목표 작성</span>
              </h3>
            </div>

            {/* Select Student & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-violet-500" />
                  <span>학생 선택</span>
                </label>
                <select
                  value={selectedStudentName}
                  onChange={(e) => setSelectedStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.schoolName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">학기 구분</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                >
                  <option value="1학기">1학기 (3월~7월)</option>
                  <option value="2학기">2학기 (9월~1월)</option>
                  <option value="월별 평가">월별 수시평가</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">교육 영역</label>
                <input
                  type="text"
                  value={currentIEP.domain}
                  onChange={(e) => setCurrentIEP({ ...currentIEP, domain: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Long-term Goal */}
            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span>IEP 학기 장기목표 *</span>
              </label>
              <textarea
                rows={2}
                required
                value={currentIEP.longTermGoal}
                onChange={(e) => setCurrentIEP({ ...currentIEP, longTermGoal: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:border-violet-500 focus:bg-white leading-relaxed transition-all"
                placeholder="예: 기초 낱말의 뜻을 이해하고 2~3음절 낱말을 스스로 정확히 읽고 쓸 수 있다."
              />
            </div>

            {/* Monthly Goals Section (Replaces Short-term Goals) */}
            <div className="text-xs space-y-3 bg-pink-50/40 border border-pink-100 p-4 rounded-2xl">
              <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                <label className="font-extrabold text-pink-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  <span>월별 목표 작성</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddMonthlyGoal}
                  className="px-2.5 py-1 rounded-xl bg-white border border-pink-200 text-pink-600 hover:bg-pink-100 font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>월 추가</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {currentIEP.monthlyGoals.map((mg, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={mg.month}
                      onChange={(e) => handleMonthlyGoalChange(idx, 'month', e.target.value)}
                      className="w-16 sm:w-20 px-2.5 py-2 rounded-xl bg-white border border-pink-200 text-pink-800 font-bold text-center text-xs focus:outline-none focus:border-pink-500 shadow-sm"
                      placeholder="월"
                    />
                    <input
                      type="text"
                      value={mg.goal}
                      onChange={(e) => handleMonthlyGoalChange(idx, 'goal', e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-medium text-xs focus:outline-none focus:border-violet-500 shadow-sm"
                      placeholder={`${mg.month} 구체적 세부 목표를 입력해 주세요...`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMonthlyGoal(idx)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      title="월별 목표 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation Field */}
            <div className="text-xs pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-violet-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-violet-500" />
                  <span>최종 IEP 평가 및 종합 총평</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  (우측 Gemini AI 추천 버튼으로 자동 작성 가능)
                </span>
              </div>
              <textarea
                rows={4}
                value={currentIEP.evaluationText}
                onChange={(e) => setCurrentIEP({ ...currentIEP, evaluationText: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-violet-500 focus:bg-white leading-relaxed transition-all"
                placeholder="학생의 수행 성취도 및 월별 성장 변화 평가 내용..."
              />
            </div>

            {/* Submit Save */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-pink-200 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>IEP 월별 목표 및 평가 저장</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Gemini AI Recommendation Generator Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-purple-100 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="border-b border-purple-50 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Gemini AI 월별 평가 추천</h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                Gemini 3.6
              </span>
            </div>

            {/* Summary Context Badge */}
            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs space-y-1.5">
              <div className="text-slate-500 font-medium">분석 대상 학생 정보:</div>
              <div className="text-slate-900 font-extrabold text-sm">{selectedStudentName} 학생</div>
              <div className="text-slate-600 text-[11px] flex justify-between pt-1 border-t border-purple-100">
                <span>누적 순회일지:</span>
                <span className="font-bold text-violet-600">{studentLogs.length}건 기재됨</span>
              </div>
              <div className="text-slate-600 text-[11px] flex justify-between">
                <span>설정된 월별 목표:</span>
                <span className="font-bold text-pink-600">
                  {currentIEP.monthlyGoals.filter((g) => g.goal.trim()).length}개 항목
                </span>
              </div>
            </div>

            {/* AI Trigger Button */}
            <button
              onClick={handleGenerateAIEvaluation}
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-violet-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>월별 목표 & 누적일지 분석 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>✨ AI 월별 종합 IEP 평가문 추천 생성</span>
                </>
              )}
            </button>

            {/* AI Generated Result Box */}
            {aiRecommendation ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-violet-200 space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between text-violet-700 font-bold text-xs pb-2 border-b border-slate-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>추천된 개별화교육 평가 문장</span>
                  </span>
                  <button
                    onClick={handleCopyAiText}
                    className="p-1 text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px] font-semibold"
                  >
                    {copiedText ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedText ? '복사 완료' : '복사'}</span>
                  </button>
                </div>

                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {aiRecommendation}
                </p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={handleApplyAiText}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>좌측 평가 입력란에 자동 반영</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-slate-400 text-xs space-y-2">
                <AlertCircle className="w-6 h-6 mx-auto text-violet-400" />
                <p className="leading-relaxed">
                  상단 버튼을 누르면 작성하신 <strong className="text-slate-600">월별 목표</strong>와 그동안 기록한 <strong className="text-slate-600">{studentLogs.length}건의 순회일지</strong>를 바탕으로 종합 평가문이 자동 생성됩니다.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
            💡 Tip: 월별 목표(3월~7월)를 구체적으로 입력해두면 AI가 월별 성취도를 파악하여 더 입체적인 평가 총평을 작성해 드립니다.
          </div>
        </div>
      </div>
    </div>
  );
};
