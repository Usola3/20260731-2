import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Users,
  Settings,
  HelpCircle,
  Database,
  CheckCircle,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { TabType, GASConfig } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  gasConfig: GASConfig;
  onSaveGasConfig: (config: GASConfig) => void;
  onResetSampleData: () => void;
  onOpenGasGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  gasConfig,
  onSaveGasConfig,
  onResetSampleData,
  onOpenGasGuide,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempUrl, setTempUrl] = useState(gasConfig.webAppUrl);
  const [autoSync, setAutoSync] = useState(gasConfig.autoSync);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGasConfig({
      webAppUrl: tempUrl.trim(),
      autoSync: autoSync,
      lastSyncedAt: gasConfig.lastSyncedAt,
    });
    setShowSettingsModal(false);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 text-slate-800 sticky top-0 z-40 print:hidden shadow-sm">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-400 via-pink-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-violet-200">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  순회교육일지 & IEP AI 관리 시스템
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                  특수교육 전용 🌸
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                순회교육일지 작성 · A4 결재서식 다운로드/인쇄 · Gemini AI 기반 월별 IEP 평가 추천
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* GAS Sync Status Button */}
            <button
              onClick={() => {
                setTempUrl(gasConfig.webAppUrl);
                setShowSettingsModal(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold transition-all shadow-sm ${
                gasConfig.webAppUrl
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Google Apps Script 연동 설정"
            >
              <Globe className="w-3.5 h-3.5 text-violet-500" />
              <span>{gasConfig.webAppUrl ? '구글 시트 연동됨' : '구글 시트 연동'}</span>
              {gasConfig.webAppUrl ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Settings className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* GAS Setup Guide */}
            <button
              onClick={onOpenGasGuide}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 font-bold transition-all shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
              <span>연동 가이드</span>
            </button>

            {/* Reset Sample Data */}
            <button
              onClick={onResetSampleData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold transition-all shadow-sm"
              title="특수교육 예시 데이터 불러오기"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
              <span>예시 데이터</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('log-entry')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'log-entry'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-200 shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-700 border border-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>순회교육일지 작성</span>
          </button>

          <button
            onClick={() => setActiveTab('iep-management')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'iep-management'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200 shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-pink-50 hover:text-pink-700 border border-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>IEP 관리 & AI 추천</span>
          </button>

          <button
            onClick={() => setActiveTab('student-timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
              activeTab === 'student-timeline'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-200 shadow-md'
                : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>학생별 누적 기록 모아보기</span>
          </button>
        </div>
      </div>

      {/* GAS Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-purple-100 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-800 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Google Apps Script 연동 설정</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  GAS Web App 배포 URL (Google Sheets 데이터 저장용)
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
                />
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  * 구글 스프레드시트에 웹 앱(Web App)으로 배포한 Apps Script URL을 입력하시면
                  순회일지 작성 시 자동으로 구글 시트에 데이터가 누적됩니다.
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100">
                <div>
                  <div className="text-xs font-bold text-slate-800">일지 저장 시 자동 POST 전송</div>
                  <div className="text-[11px] text-slate-500">
                    로컬 저장과 함께 GAS URL로 데이터를 전송합니다.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="w-5 h-5 rounded-lg text-violet-600 focus:ring-violet-400 accent-violet-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200 transition-colors"
                >
                  설정 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
