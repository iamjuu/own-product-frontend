import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full ${maxWidth} bg-white border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black text-[#181829] tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-[#181829]">{children}</div>
      </div>
    </div>
  );
};

export const EmptyState = ({ title, message, description, icon: Icon }) => {
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200/60 shadow-sm">
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#ece8ff] flex items-center justify-center text-[#6339f4] mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-sm font-bold text-[#181829]">{title}</h3>
      <p className="text-xs text-[#8a87a6] mt-1 max-w-sm">{message || description}</p>
    </div>
  );
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-6 space-y-4">
        <h3 className="text-sm font-black text-[#181829] tracking-tight">{title}</h3>
        <p className="text-xs text-[#8a87a6] leading-relaxed">{message}</p>
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-[#8a87a6] hover:bg-slate-100 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all shadow-md ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-[#6339f4] hover:bg-[#5327ec] shadow-[#6339f4]/25'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

