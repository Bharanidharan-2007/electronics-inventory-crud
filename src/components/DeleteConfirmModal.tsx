import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  componentName: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, componentName }: Props) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} />
            Confirm Delete
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{componentName}</strong>? This action cannot be undone.
          </p>
        </div>
        
        <div className="p-4 flex justify-end gap-2 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-white transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
