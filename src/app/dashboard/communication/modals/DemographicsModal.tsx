import React, { useState } from 'react';

interface DemographicsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { summary: string; filters: any }) => void;
}

const ageGroups = [
  '',
  'Under 18',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
];

const DemographicsModal: React.FC<DemographicsModalProps> = ({ open, onClose, onSave }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSave = () => {
    const summary = [
      age ? `Age: ${age}` : '',
      gender ? `Gender: ${gender}` : '',
    ].filter(Boolean).join(', ');
    onSave({ summary, filters: { age, gender } });
    setAge(''); setGender('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 animate-fade-in">
        <div className="text-lg font-semibold mb-2">Filter by Demographics</div>
        <div className="mb-2 text-sm text-gray-700">Specify demographic filters:</div>
        <select
          className="w-full mb-2 p-2 border rounded"
          value={age}
          onChange={e => setAge(e.target.value)}
        >
          <option value="">Select age group (optional)</option>
          {ageGroups.slice(1).map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
        <select
          className="w-full mb-2 p-2 border rounded"
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="">Select gender (optional)</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-light" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default DemographicsModal;
