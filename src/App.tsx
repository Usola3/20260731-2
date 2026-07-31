import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TabItinerantLog } from './components/TabItinerantLog';
import { TabIEPManagement } from './components/TabIEPManagement';
import { TabStudentTimeline } from './components/TabStudentTimeline';
import { PrintDocumentModal } from './components/PrintDocumentModal';
import { GASGuideModal } from './components/GASGuideModal';
import { Toast } from './components/Toast';

import { Student, ItinerantLog, IEPGoal, GASConfig, TabType, ToastMessage } from './types';
import { INITIAL_STUDENTS, INITIAL_LOGS, INITIAL_IEP_GOALS } from './data/sampleData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('log-entry');

  // Load Initial States from LocalStorage or Defaults
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sped_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [logs, setLogs] = useState<ItinerantLog[]>(() => {
    const saved = localStorage.getItem('sped_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [iepGoals, setIepGoals] = useState<IEPGoal[]>(() => {
    const saved = localStorage.getItem('sped_iep_goals');
    return saved ? JSON.parse(saved) : INITIAL_IEP_GOALS;
  });

  const [gasConfig, setGasConfig] = useState<GASConfig>(() => {
    const saved = localStorage.getItem('sped_gas_config');
    return saved
      ? JSON.parse(saved)
      : {
          webAppUrl: '',
          autoSync: true,
        };
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [printModalLogs, setPrintModalLogs] = useState<ItinerantLog[] | null>(null);
  const [showGasGuide, setShowGasGuide] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sped_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sped_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('sped_iep_goals', JSON.stringify(iepGoals));
  }, [iepGoals]);

  useEffect(() => {
    localStorage.setItem('sped_gas_config', JSON.stringify(gasConfig));
  }, [gasConfig]);

  const showToast = (text: string, type: 'success' | 'error' | 'info') => {
    setToast({ id: `toast-${Date.now()}`, text, type });
  };

  // Save new or updated log
  const handleSaveLog = async (newLog: ItinerantLog): Promise<boolean> => {
    try {
      // 1. Update local state
      setLogs((prev) => [newLog, ...prev]);

      // 2. If GAS Web App URL is set, send POST request
      if (gasConfig.webAppUrl && gasConfig.autoSync) {
        try {
          await fetch('/api/gas/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gasUrl: gasConfig.webAppUrl,
              payload: newLog,
            }),
          });
          showToast('순회일지가 로컬 및 구글 스프레드시트에 성공적으로 저장되었습니다!', 'success');
        } catch (gasErr) {
          console.warn('GAS sync warning:', gasErr);
          showToast(
            '로컬에는 저장되었으나, 구글 시트 전송 중 오류가 발생했습니다 (URL 확인 필요).',
            'info'
          );
        }
      } else {
        showToast('순회교육일지가 로컬 저장소에 저장되었습니다.', 'success');
      }

      return true;
    } catch (err) {
      console.error(err);
      showToast('일지 저장 중 오류가 발생했습니다.', 'error');
      return false;
    }
  };

  // Delete log
  const handleDeleteLog = (id: string) => {
    if (confirm('해당 순회교육일지를 정말 삭제하시겠습니까?')) {
      setLogs((prev) => prev.filter((item) => item.id !== id));
      showToast('순회교육일지가 삭제되었습니다.', 'info');
    }
  };

  // Save IEP Goal
  const handleSaveIEPGoal = (updatedIEP: IEPGoal) => {
    setIepGoals((prev) => {
      const exists = prev.some(
        (item) =>
          item.studentName === updatedIEP.studentName && item.semester === updatedIEP.semester
      );
      if (exists) {
        return prev.map((item) =>
          item.studentName === updatedIEP.studentName && item.semester === updatedIEP.semester
            ? updatedIEP
            : item
        );
      } else {
        return [...prev, updatedIEP];
      }
    });
  };

  // Reset to Sample Data
  const handleResetSampleData = () => {
    if (confirm('모든 데이터(일지, IEP, 학생)를 예시 데이터로 재설정하시겠습니까?')) {
      setStudents(INITIAL_STUDENTS);
      setLogs(INITIAL_LOGS);
      setIepGoals(INITIAL_IEP_GOALS);
      showToast('특수교육 예시 데이터가 초기화되었습니다.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] text-slate-800 flex flex-col font-sans antialiased">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gasConfig={gasConfig}
        onSaveGasConfig={(cfg) => {
          setGasConfig(cfg);
          showToast('Google Apps Script 설정이 저장되었습니다.', 'success');
        }}
        onResetSampleData={handleResetSampleData}
        onOpenGasGuide={() => setShowGasGuide(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'log-entry' && (
          <TabItinerantLog
            logs={logs}
            students={students}
            gasConfig={gasConfig}
            onSaveLog={handleSaveLog}
            onDeleteLog={handleDeleteLog}
            onOpenPrintModal={(targetLogs) => setPrintModalLogs(targetLogs)}
            showToast={showToast}
          />
        )}

        {activeTab === 'iep-management' && (
          <TabIEPManagement
            students={students}
            iepGoals={iepGoals}
            logs={logs}
            onSaveIEPGoal={handleSaveIEPGoal}
            showToast={showToast}
          />
        )}

        {activeTab === 'student-timeline' && (
          <TabStudentTimeline
            students={students}
            logs={logs}
            iepGoals={iepGoals}
            onOpenPrintModal={(targetLogs) => setPrintModalLogs(targetLogs)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white py-4 text-center text-xs text-slate-500 print:hidden shadow-sm">
        <p>
          순회교육일지 및 IEP AI 관리 시스템 &copy; 2026 Special Education Assistant. All rights reserved.
        </p>
      </footer>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Official Print Modal */}
      {printModalLogs && (
        <PrintDocumentModal logs={printModalLogs} onClose={() => setPrintModalLogs(null)} />
      )}

      {/* GAS Setup Guide Modal */}
      {showGasGuide && <GASGuideModal onClose={() => setShowGasGuide(false)} />}
    </div>
  );
}
