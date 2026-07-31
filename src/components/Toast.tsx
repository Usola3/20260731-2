import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-900/90 text-emerald-100 border-emerald-700/50',
    error: 'bg-rose-900/90 text-rose-100 border-rose-700/50',
    info: 'bg-indigo-900/90 text-indigo-100 border-indigo-700/50',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up print:hidden">
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md transition-all ${
          bgColors[toast.type]
        }`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-sm font-medium leading-relaxed">{toast.text}</div>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
