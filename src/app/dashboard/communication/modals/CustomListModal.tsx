import React, { useState } from 'react';

interface CustomListModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { emails: string[]; count: number }) => void;
}

const CustomListModal: React.FC<CustomListModalProps> = ({ open, onClose, onSave }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const parseEmails = (str: string) => {
    return str
      .split(/\s|,|;/)
      .map(e => e.trim())
      .filter(e => e && /.+@.+\..+/.test(e));
  };

  const handleSave = () => {
    const emails = parseEmails(input);
    if (emails.length === 0) {
      setError('Please enter at least one valid email.');
      return;
    }
    onSave({ emails, count: emails.length });
    setInput('');
    setError('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 animate-fade-in">
        <div className="text-lg font-semibold mb-2">Add Custom Recipients</div>
        <div className="mb-2 text-sm text-gray-700">Paste or upload a list of emails (comma, space, or newline separated):</div>
        <textarea
          className="w-full min-h-[100px] p-2 border rounded"
          placeholder="email1@example.com, email2@example.com or paste here..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-light" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default CustomListModal;
