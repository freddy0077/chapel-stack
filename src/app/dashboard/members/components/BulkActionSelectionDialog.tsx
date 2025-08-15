import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  id: string;
  name: string;
}

interface BulkActionSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedId: string) => void;
  title: string;
  label: string;
  options: Option[];
}

const BulkActionSelectionDialog: React.FC<BulkActionSelectionDialogProps> = ({ 
  isOpen,
  onClose,
  onConfirm,
  title,
  label,
  options 
}) => {
  const [selectedId, setSelectedId] = React.useState<string>('');

  const handleConfirm = () => {
    if (selectedId) {
      onConfirm(selectedId);
    }
  };

  React.useEffect(() => {
    if (options.length > 0) {
      setSelectedId(options[0].id);
    }
  }, [options]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            <div className="mb-6">
              <label htmlFor="action-select" className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <select
                id="action-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedId}
                className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:bg-gray-400"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionSelectionDialog;
