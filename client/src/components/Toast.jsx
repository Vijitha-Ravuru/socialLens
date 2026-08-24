import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400" style={{ color: '#10b981' }} />,
    error: <AlertCircle size={18} className="text-rose-400" style={{ color: '#f43f5e' }} />,
    info: <Info size={18} className="text-indigo-400" style={{ color: '#818cf8' }} />,
  };

  return (
    <div className="toast-popup">
      {icons[toast.type || 'info']}
      <span style={{ fontSize: '0.9rem' }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          marginLeft: '6px',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
