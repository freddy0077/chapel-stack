import React, { useRef, useState } from "react";
import { saveOnboardingStepData } from "../utils/onboardingStorage";

interface MemberImportScreenProps {
  onNext: (members: unknown[]) => void;
  onBack?: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

const SAMPLE_HEADERS = [
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Role",
  "Branch",
];
const SAMPLE_DATA = [
  ["John", "Doe", "john@example.com", "1234567890", "MEMBER", "Main"],
  ["Jane", "Smith", "jane@example.com", "0987654321", "PASTOR", "East"],
];

const MemberImportScreen: React.FC<MemberImportScreenProps> = ({
  onNext,
  onBack,
  onSkip,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<unknown[][] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // For demo: just show sample preview
    setPreviewRows([SAMPLE_HEADERS, ...SAMPLE_DATA]);
    // In real app: parse CSV/Excel and validate
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewRows) {
      setError("Please upload a valid CSV or Excel file.");
      return;
    }
    // In real app: parse and send actual data
    const memberCount = previewRows.length - 1; // Subtract 1 for header row
    saveOnboardingStepData("MemberImport", { fileName, memberCount });
    onNext([]); // Placeholder
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">
          Import Members
        </h2>
        <p className="mb-6 text-gray-600">
          Upload a CSV or Excel file to import members in bulk.{" "}
          <a href="#" className="text-indigo-600 underline ml-1">
            Download sample template
          </a>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              disabled={isLoading}
            />
            {fileName && (
              <span className="text-sm text-gray-500">
                Selected file: {fileName}
              </span>
            )}
          </div>
          {previewRows && (
            <div className="mt-4 border rounded-lg overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50">
                  <tr>
                    {previewRows[0].map((header: string, i: number) => (
                      <th
                        key={i}
                        className="px-3 py-2 font-semibold text-indigo-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.slice(1).map((row, i) => (
                    <tr key={i} className="odd:bg-white even:bg-gray-50">
                      {row.map((cell: string, j: number) => (
                        <td key={j} className="px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="flex justify-between items-center mt-8 gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                disabled={isLoading}
              >
                Back
              </button>
            )}
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-2 rounded-lg border border-transparent text-indigo-400 font-semibold hover:underline"
                disabled={isLoading}
              >
                Skip
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Importing..." : "Import & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberImportScreen;
