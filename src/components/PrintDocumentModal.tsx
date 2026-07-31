import React, { useState } from 'react';
import { Printer, X, FileCheck, CheckSquare, Edit3 } from 'lucide-react';
import { ItinerantLog } from '../types';

interface PrintDocumentModalProps {
  logs: ItinerantLog[];
  onClose: () => void;
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({ logs, onClose }) => {
  const [approvalRoles, setApprovalRoles] = useState({
    role1: '담 당',
    role2: '팀 장',
    role3: '원 장',
  });
  const [approvalNames, setApprovalNames] = useState({
    name1: '박특수',
    name2: '이순회',
    name3: '김지원',
  });
  const [editApproval, setEditApproval] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  if (!logs || logs.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white border border-purple-100 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-800 my-auto">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between p-4 border-b border-purple-50 bg-white/90 sticky top-0 z-10 print:hidden rounded-t-3xl">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-violet-600" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900">순회교육일지 A4 공문서 서식 인쇄</h3>
              <p className="text-xs text-slate-500 font-medium">
                총 {logs.length}건의 일지가 결재란 포함 A4 표준 서식으로 준비되었습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditApproval(!editApproval)}
              className="px-3.5 py-2 rounded-2xl bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold flex items-center gap-1.5 border border-violet-200 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-violet-600" />
              <span>결재란 수정</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-2xl bg-violet-600 text-white hover:bg-violet-700 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-violet-200 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>A4 인쇄 / PDF 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Approval Edit Panel (Hidden on Print) */}
        {editApproval && (
          <div className="p-4 bg-purple-50/60 border-b border-purple-100 print:hidden text-xs space-y-2">
            <div className="font-bold text-violet-800">결재 직책 및 성명 지정:</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">결재자 1 (직책/성명)</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={approvalRoles.role1}
                    onChange={(e) => setApprovalRoles({ ...approvalRoles, role1: e.target.value })}
                    className="w-1/2 p-1.5 rounded-xl bg-white border border-purple-200 text-slate-800 text-center font-bold"
                  />
                  <input
                    type="text"
                    value={approvalNames.name1}
                    onChange={(e) => setApprovalNames({ ...approvalNames, name1: e.target.value })}
                    className="w-1/2 p-1.5 rounded-xl bg-white border border-purple-200 text-slate-800 text-center font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">결재자 2 (직책/성명)</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={approvalRoles.role2}
                    onChange={(e) => setApprovalRoles({ ...approvalRoles, role2: e.target.value })}
                    className="w-1/2 p-1.5 rounded-xl bg-white border border-purple-200 text-slate-800 text-center font-bold"
                  />
                  <input
                    type="text"
                    value={approvalNames.name2}
                    onChange={(e) => setApprovalNames({ ...approvalNames, name2: e.target.value })}
                    className="w-1/2 p-1.5 rounded-xl bg-white border border-purple-200 text-slate-800 text-center font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-medium block mb-1">결재자 3 (직책/성명)</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={approvalRoles.role3}
                    onChange={(e) => setApprovalRoles({ ...approvalRoles, role3: e.target.value })}
                    className="w-1/2 p-1.5 rounded-xl bg-white border border-purple-200 text-slate-800 text-center font-bold"
                  />
                  <input
                    type="text"
                    value={approvalNames.name3}
                    onChange={(e) => setApprovalNames({ ...approvalNames, name3: e.target.value })}
                    className="w-1/2 p-1.5 rounded-xl bg-white border border-purple-200 text-slate-800 text-center font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Printable Scroll View Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0 print:overflow-visible rounded-b-3xl">
          {/* Printable Document Sheets */}
          <div className="space-y-10 print:space-y-0">
            {logs.map((log, index) => (
              <div
                key={log.id || index}
                className="bg-white text-black p-8 sm:p-12 rounded-xl shadow-xl mx-auto border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-0 print:m-0 print:w-full print:max-w-none printable-page font-serif text-sm leading-relaxed"
                style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
              >
                {/* Document Header */}
                <div className="flex justify-between items-start mb-6">
                  {/* Title */}
                  <div className="pt-2">
                    <h1 className="text-2xl font-bold tracking-widest text-slate-900 border-b-2 border-black pb-1 inline-block">
                      순회교육 지도일지
                    </h1>
                    <div className="text-xs text-slate-600 mt-1 font-sans">
                      2026학년도 특수교육지원센터 순회지도
                    </div>
                  </div>

                  {/* Formal Approval Box (결재란) */}
                  <div className="border border-black text-xs font-sans">
                    <table className="border-collapse text-center">
                      <tbody>
                        <tr>
                          <td
                            rowSpan={2}
                            className="border-r border-black bg-slate-100 px-1 py-2 font-bold w-6 text-[10px]"
                          >
                            결<br />재
                          </td>
                          <td className="border-r border-b border-black px-3 py-1 font-semibold w-16">
                            {approvalRoles.role1}
                          </td>
                          <td className="border-r border-b border-black px-3 py-1 font-semibold w-16">
                            {approvalRoles.role2}
                          </td>
                          <td className="border-b border-black px-3 py-1 font-semibold w-16">
                            {approvalRoles.role3}
                          </td>
                        </tr>
                        <tr>
                          <td className="border-r border-black h-12 align-bottom pb-1 text-[11px] text-slate-700">
                            {log.approvalPersons?.teacher || approvalNames.name1}
                          </td>
                          <td className="border-r border-black h-12 align-bottom pb-1 text-[11px] text-slate-700">
                            {log.approvalPersons?.teamLeader || approvalNames.name2}
                          </td>
                          <td className="h-12 align-bottom pb-1 text-[11px] text-slate-700">
                            {log.approvalPersons?.director || approvalNames.name3}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Primary Student & Info Table */}
                <table className="w-full border-collapse border border-black text-xs mb-6 font-sans">
                  <tbody>
                    <tr>
                      <th className="border border-black bg-slate-100 px-3 py-2 text-left font-bold w-24">
                        일 시
                      </th>
                      <td className="border border-black px-3 py-2 w-1/3">
                        {log.date} ({log.period ? `${log.period} ` : ''}
                        {log.startTime && log.endTime ? `${log.startTime} ~ ${log.endTime}` : ''})
                      </td>
                      <th className="border border-black bg-slate-100 px-3 py-2 text-left font-bold w-24">
                        소속 학교
                      </th>
                      <td className="border border-black px-3 py-2">{log.schoolName}</td>
                    </tr>
                    <tr>
                      <th className="border border-black bg-slate-100 px-3 py-2 text-left font-bold">
                        학 생 명
                      </th>
                      <td className="border border-black px-3 py-2 font-bold text-sm">
                        {log.studentName} {log.gradeClass ? `(${log.gradeClass})` : ''}
                      </td>
                      <th className="border border-black bg-slate-100 px-3 py-2 text-left font-bold">
                        교육 영역
                      </th>
                      <td className="border border-black px-3 py-2 font-medium">{log.domain}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Main Instruction Activities Box */}
                <div className="mb-6 font-sans">
                  <div className="bg-slate-100 border border-black px-3 py-1.5 font-bold text-xs border-b-0 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-800" />
                    <span>순회교육 내용 및 주요 지도 활동</span>
                  </div>
                  <div className="border border-black p-4 text-xs min-h-[180px] whitespace-pre-wrap leading-relaxed">
                    {log.content || '지도 내용이 기록되지 않았습니다.'}
                  </div>
                </div>

                {/* Observations & Remarks Box */}
                <div className="mb-6 font-sans">
                  <div className="bg-slate-100 border border-black px-3 py-1.5 font-bold text-xs border-b-0">
                    학생 반응 및 특이사항 (관찰 기록)
                  </div>
                  <div className="border border-black p-4 text-xs min-h-[100px] whitespace-pre-wrap leading-relaxed">
                    {log.remarks || '특이사항 없음'}
                  </div>
                </div>

                {/* Future Plan / Notes */}
                <div className="mb-8 font-sans">
                  <div className="bg-slate-100 border border-black px-3 py-1.5 font-bold text-xs border-b-0">
                    다음 차시 지도계획 및 제언
                  </div>
                  <div className="border border-black p-3 text-xs leading-relaxed">
                    - 학생의 개별 수행 수준 및 특수교육 피드백에 맞추어 차시 어휘 확장 및 적응 지도 지속
                    실시.
                  </div>
                </div>

                {/* Footer Signature Notice */}
                <div className="mt-12 text-center text-xs font-sans text-slate-800 space-y-1 pt-6 border-t border-slate-300">
                  <p>위와 같이 순회교육을 성실히 실시하였음을 확인합니다.</p>
                  <p className="font-bold text-sm pt-2">
                    2026년 {log.date ? log.date.split('-')[1] : '07'}월{' '}
                    {log.date ? log.date.split('-')[2] : '30'}일
                  </p>
                  <p className="text-right pr-4 font-semibold text-slate-900 pt-2">
                    순회지도 교사: {log.approvalPersons?.teacher || approvalNames.name1} (인)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
