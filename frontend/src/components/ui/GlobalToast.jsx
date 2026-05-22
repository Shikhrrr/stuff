import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function GlobalToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleApiError = (event) => {
      setToast({ message: event.detail.message });
      // Auto-dismiss after 5 seconds
      setTimeout(() => setToast(null), 5000);
    };

    window.addEventListener('api-error', handleApiError);
    return () => window.removeEventListener('api-error', handleApiError);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 max-w-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
        <p className="text-sm font-medium">{toast.message}</p>
        <button 
          onClick={() => setToast(null)}
          className="p-1 hover:bg-red-100 rounded-full transition-colors ml-2"
        >
          <X className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}
