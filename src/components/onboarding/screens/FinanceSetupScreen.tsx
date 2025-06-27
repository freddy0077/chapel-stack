import React, { useState, useEffect } from 'react';
import { saveOnboardingStepData } from '../utils/onboardingStorage';
import { markScreenCompleted } from '../utils/completedScreens';

interface FinanceSetupScreenProps {
  onNext: (financeData: unknown) => void;
  onBack?: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

// Finance entity import types for your backend structure
const FINANCE_IMPORT_TYPES = [
  { key: 'fund', label: 'Funds/Accounts', sampleHeaders: ['Name','Type','Opening Balance','Currency'], sampleData: [['Main Bank','Bank','10000','USD']] },
  { key: 'contributionType', label: 'Contribution Types', sampleHeaders: ['Name','Description'], sampleData: [['Tithe','Tithes and offerings']] },
  { key: 'contribution', label: 'Contributions', sampleHeaders: ['Date','Amount','Type','Fund','Member','Payment Method','Batch'], sampleData: [['2024-01-01','500','Tithe','Main Bank','John Doe','Cash','Batch 1']] },
  { key: 'expenseCategory', label: 'Expense Categories', sampleHeaders: ['Name','Description'], sampleData: [['Utilities','Electricity, water, etc.']] },
  { key: 'expense', label: 'Expenses', sampleHeaders: ['Date','Amount','Category','Vendor','Payment Method','Description'], sampleData: [['2024-01-02','100','Utilities','ECG','Bank Transfer','Electricity bill']] },
  { key: 'vendor', label: 'Vendors', sampleHeaders: ['Name','Contact'], sampleData: [['ECG','0200000000']] },
  { key: 'paymentMethod', label: 'Payment Methods', sampleHeaders: ['Name'], sampleData: [['Cash']] },
  { key: 'budget', label: 'Budgets', sampleHeaders: ['Name','Year','Total'], sampleData: [['2024 Budget','2024','50000']] },
  { key: 'pledge', label: 'Pledges', sampleHeaders: ['Date','Amount','Member','Fund','Status'], sampleData: [['2024-01-10','1000','Jane Smith','Missions Fund','Pending']] },
];

const FinanceSetupScreen: React.FC<FinanceSetupScreenProps> = ({ onNext, onBack, onSkip, isLoading }) => {
  const [uploads, setUploads] = useState<Record<string, { fileName: string, previewRows: unknown[][] }>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (key: string, headers: string[], sampleData: unknown[]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setUploads(u => ({ ...u, [key]: { fileName: file.name, previewRows: [headers, ...sampleData] } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(uploads).length === 0) {
      setError('Please upload at least one finance data file.');
      return;
    }
    saveOnboardingStepData('FinanceSetup', {
      uploadedFiles: Object.keys(uploads).map(key => uploads[key]?.fileName).filter(Boolean)
    });
    onNext(uploads); // Placeholder for backend integration
    setSuccess(true);
  };

  useEffect(() => {
    if (success) {
      markScreenCompleted('FinanceSetup');
    }
  }, [success]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      {/* Under Development Banner */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
        <div className="bg-yellow-200 bg-opacity-90 border-4 border-yellow-400 rounded-2xl px-12 py-10 shadow-2xl flex flex-col items-center max-w-2xl">
          <span className="text-5xl md:text-7xl font-extrabold text-yellow-700 tracking-widest mb-4">UNDER DEVELOPMENT</span>
          <span className="text-lg text-yellow-800 font-semibold mb-4 text-center">
            This page will allow you to import and set up all your church’s financial data, including accounts, contribution types, donations, expenses, vendors, payment methods, budgets, and pledges. You’ll be able to upload spreadsheets or connect to accounting software to migrate your records easily.
          </span>
          <span className="text-base text-yellow-900 mb-6 text-center">
            We’re working hard to bring you a seamless finance onboarding experience. In the meantime, you can skip this step and complete your setup later.
          </span>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="mt-2 px-8 py-3 rounded-lg bg-yellow-500 text-white text-lg font-bold shadow hover:bg-yellow-600 transition"
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 opacity-40 blur-sm pointer-events-none select-none">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">Finance Setup</h2>
        <p className="mb-6 text-gray-600">Import your financial data by uploading spreadsheets for each finance type below. Download the sample template for each, fill in your data, and upload. You can import as many as you want now, or skip and do it later.</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          {FINANCE_IMPORT_TYPES.map(type => (
            <div key={type.key} className="mb-4 border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <label className="block text-base font-semibold text-indigo-700">{type.label}</label>
                <a href="#" className="text-indigo-600 underline text-xs" download>Download sample</a>
              </div>
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileChange(type.key, type.sampleHeaders, type.sampleData)}
                className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                disabled={isLoading}
              />
              {uploads[type.key]?.fileName && (
                <span className="block text-sm text-gray-500 mt-1">Selected: {uploads[type.key].fileName}</span>
              )}
              {uploads[type.key]?.previewRows && (
                <div className="mt-2 border rounded-lg overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead className="bg-indigo-50">
                      <tr>
                        {uploads[type.key].previewRows[0].map((header: string, i: number) => (
                          <th key={i} className="px-2 py-1 font-semibold text-indigo-700">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {uploads[type.key].previewRows.slice(1).map((row, i) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                          {row.map((cell: string, j: number) => (
                            <td key={j} className="px-2 py-1">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="flex justify-between items-center mt-8 gap-2">
            {onBack && (
              <button type="button" onClick={onBack} className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition" disabled={isLoading}>Back</button>
            )}
            {onSkip && (
              <button type="button" onClick={onSkip} className="px-4 py-2 rounded-lg border border-transparent text-indigo-400 font-semibold hover:underline" disabled={isLoading}>Skip</button>
            )}
            <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition" disabled={isLoading}>
              {isLoading ? 'Importing...' : 'Import & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceSetupScreen;
