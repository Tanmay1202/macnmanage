import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = (msg) => addToast(msg, 'success');
    const error = (msg) => addToast(msg, 'error');
    const info = (msg) => addToast(msg, 'info');

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 p-4 rounded-sm border shadow-lg min-w-[300px] animate-in slide-in-from-right-full fade-in duration-300 ${toast.type === 'success' ? 'bg-card border-emerald-500/50 text-foreground' :
                                toast.type === 'error' ? 'bg-card border-destructive/50 text-foreground' :
                                    'bg-card border-border text-foreground'
                            }`}
                    >
                        <div className={`mt-0.5 ${toast.type === 'success' ? 'text-emerald-500' :
                                toast.type === 'error' ? 'text-destructive' :
                                    'text-primary'
                            }`}>
                            {toast.type === 'success' && <CheckCircle2 size={16} />}
                            {toast.type === 'error' && <AlertCircle size={16} />}
                            {toast.type === 'info' && <Info size={16} />}
                        </div>
                        <div className="flex-1 text-sm font-medium leading-tight">{toast.message}</div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
