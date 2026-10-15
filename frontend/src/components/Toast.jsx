import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(15, 20, 35, 0.94)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${
                isSuccess
                  ? 'rgba(16, 185, 129, 0.4)'
                  : isError
                  ? 'rgba(244, 63, 94, 0.4)'
                  : 'rgba(0, 242, 254, 0.3)'
              }`,
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
              color: '#f8fafc',
            }}
          >
            {isSuccess && <CheckCircle2 size={18} color="#34d399" />}
            {isError && <AlertCircle size={18} color="#fb7185" />}
            {!isSuccess && !isError && <Info size={18} color="#38bdf8" />}

            <span style={{ fontSize: '0.9rem', flex: 1, fontWeight: 500 }}>
              {toast.message}
            </span>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
