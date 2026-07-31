import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, X, Code, Play } from 'lucide-react';

interface GASGuideModalProps {
  onClose: () => void;
}

export const GASGuideModal: React.FC<GASGuideModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const gasCode = `/**
 * 특수교육 순회교육일지 Google Apps Script Web App 백엔드 코드
 * 구글 스프레드시트 -> [확장 프로그램] -> [Apps Script] 에 붙여넣고 배포하세요.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // 헤더 행이 없다면 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "작성일시",
        "수업날짜",
        "소속학교",
        "학생명",
        "학년학급",
        "교시",
        "시작시간",
        "종료시간",
        "교육영역",
        "교육내용",
        "비고/특이사항"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#e2e8f0");
    }
    
    // 데이터 행 추가
    sheet.appendRow([
      new Date().toLocaleString("ko-KR"),
      data.date || "",
      data.schoolName || "",
      data.studentName || "",
      data.gradeClass || "",
      data.period || "",
      data.startTime || "",
      data.endTime || "",
      data.domain || "",
      data.content || "",
      data.remarks || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "순회일지가 구글 시트에 성공적으로 저장되었습니다."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "특수교육 순회일지 Apps Script 서버가 정상 동작 중입니다."
  })).setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(gasCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-purple-100 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-slate-800 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-50">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-violet-600" />
            <h3 className="font-extrabold text-lg text-slate-900">Google Apps Script (GAS) 연동 가이드</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-5 text-xs text-slate-700">
          {/* Step Steps */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-violet-800 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-violet-600" />
              <span>4단계 간편 연동 구축 순서</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 bg-violet-50/60 p-4 rounded-2xl border border-violet-100 text-slate-700 leading-relaxed font-medium">
              <li>
                저장소로 사용할 <strong className="text-slate-900 font-extrabold">구글 스프레드시트</strong>를 새롭게 생성합니다.
              </li>
              <li>
                상단 메뉴에서 <strong className="text-slate-900 font-extrabold">[확장 프로그램] → [Apps Script]</strong>를 클릭합니다.
              </li>
              <li>
                기존 코드를 지우고 아래의 <strong className="text-violet-700 font-extrabold">Apps Script 코드</strong>를 복사해서 붙여넣습니다.
              </li>
              <li>
                우측 상단 <strong className="text-violet-800 font-extrabold">[배포] → [새 배포]</strong> 클릭 후, 웹앱 설정:
                <div className="ml-5 mt-1 text-[11px] text-slate-600 space-y-0.5 font-bold">
                  <div>- 다음 사용자 권한으로 실행: <span className="text-emerald-600 font-extrabold">나(Me)</span></div>
                  <div>- 액세스 권한 있는 사용자: <span className="text-emerald-600 font-extrabold">모든 사용자(Anyone)</span></div>
                </div>
              </li>
              <li>
                생성된 <strong className="text-pink-600 font-extrabold">웹 앱 URL</strong>을 복사하여 본 앱 상단 [구글 시트 연동 설정]에 등록합니다.
              </li>
            </ol>
          </div>

          {/* Code Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Code className="w-4 h-4 text-amber-500" />
                <span>Google Apps Script 표준 소스코드</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>코드 복사</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-52 leading-relaxed shadow-inner">
              {gasCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-purple-50 mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
