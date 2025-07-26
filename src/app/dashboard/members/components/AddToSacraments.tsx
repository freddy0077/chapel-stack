import { useState } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useCreateBaptismRecord } from "@/graphql/hooks/useCreateBaptismRecord";
import { useCreateConfirmationRecord } from "@/graphql/hooks/useCreateConfirmationRecord";
import { useCreateFirstCommunionRecord } from "@/graphql/hooks/useCreateFirstCommunionRecord";
import { useCreateMatrimonyRecord } from "@/graphql/hooks/useCreateMatrimonyRecord";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import {
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  UsersIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

const SACRAMENT_OPTIONS = [
  { value: "BAPTISM", label: "Baptism" },
  { value: "CONFIRMATION", label: "Confirmation" },
  { value: "EUCHARIST_FIRST_COMMUNION", label: "First Communion" },
  { value: "MATRIMONY", label: "Matrimony" },
];

export default function AddToSacraments({ memberId, onSuccess }: { memberId: string; onSuccess?: () => void }) {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId } = useOrganisationBranch();

  const [sacramentType, setSacramentType] = useState("");
  const [dateOfSacrament, setDateOfSacrament] = useState("");
  const [officiantName, setOfficiantName] = useState("");
  const [locationOfSacrament, setLocationOfSacrament] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Baptism and Confirmation specific
  const [godparent1Name, setGodparent1Name] = useState("");
  const [godparent2Name, setGodparent2Name] = useState("");
  const [sponsorName, setSponsorName] = useState("");

  // Matrimony-specific
  const [witness1Name, setWitness1Name] = useState("");
  const [witness2Name, setWitness2Name] = useState("");

  // Mutations
  const { createBaptismRecord, loading: loadingBaptism, error: errorBaptism } = useCreateBaptismRecord();
  const { createConfirmationRecord, loading: loadingConfirmation, error: errorConfirmation } = useCreateConfirmationRecord();
  const { createFirstCommunionRecord, loading: loadingCommunion, error: errorCommunion } = useCreateFirstCommunionRecord();
  const { createMatrimonyRecord, loading: loadingMatrimony, error: errorMatrimony } = useCreateMatrimonyRecord();

  const loading = loadingBaptism || loadingConfirmation || loadingCommunion || loadingMatrimony;
  const error = errorBaptism || errorConfirmation || errorCommunion || errorMatrimony;

  const resetFields = () => {
    setSacramentType("");
    setDateOfSacrament("");
    setOfficiantName("");
    setLocationOfSacrament("");
    setCertificateUrl("");
    setNotes("");
    setWitness1Name("");
    setWitness2Name("");
    setGodparent1Name("");
    setGodparent2Name("");
    setSponsorName("");
  };

  const handleAdd = async () => {
    if (!sacramentType || !dateOfSacrament || !officiantName || !locationOfSacrament) return;
    try {
      const input: any = {
        memberId,
        sacramentType,
        dateOfSacrament,
        officiantName,
        locationOfSacrament,
        certificateUrl: certificateUrl || undefined,
        notes: notes || undefined,
        branchId,
      };
      if (sacramentType === "MATRIMONY") {
        input.witness1Name = witness1Name;
        input.witness2Name = witness2Name;
        await createMatrimonyRecord({ variables: { input } });
      } else if (sacramentType === "BAPTISM") {
        input.godparent1Name = godparent1Name || undefined;
        input.godparent2Name = godparent2Name || undefined;
        await createBaptismRecord({ variables: { input } });
      } else if (sacramentType === "CONFIRMATION") {
        input.sponsorName = sponsorName || undefined;
        input.godparent1Name = godparent1Name || undefined;
        input.godparent2Name = godparent2Name || undefined;
        await createConfirmationRecord({ variables: { input } });
      } else if (sacramentType === "EUCHARIST_FIRST_COMMUNION") {
        await createFirstCommunionRecord({ variables: { input } });
      }
      setSuccessMsg("Sacrament record added!");
      resetFields();
      if (onSuccess) onSuccess();
    } catch (e) {
      setSuccessMsg("");
    }
  };

  const canAdd = !!sacramentType && !!dateOfSacrament && !!officiantName && !!locationOfSacrament && !loading;

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
      <h3 className="text-2xl font-bold text-indigo-700 mb-8 text-center tracking-tight">Add Sacramental Record</h3>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={e => { e.preventDefault(); handleAdd(); }}
        autoComplete="off"
      >
        {/* Sacrament Type - always first, full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sacrament Type <span className="text-red-500">*</span></label>
          <select
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
            value={sacramentType}
            onChange={e => setSacramentType(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">Select Sacrament</option>
            {SACRAMENT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Only show the rest if type is selected */}
        {sacramentType && <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
              value={dateOfSacrament}
              onChange={e => setDateOfSacrament(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Officiant Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
              value={officiantName}
              onChange={e => setOfficiantName(e.target.value)}
              placeholder="e.g. Rev. John Doe"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
              value={locationOfSacrament}
              onChange={e => setLocationOfSacrament(e.target.value)}
              placeholder="e.g. St. Peter's Church"
              disabled={loading}
              required
            />
          </div>
          {/* Baptism-specific fields */}
          {sacramentType === "BAPTISM" && <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Godparent 1 Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                value={godparent1Name}
                onChange={e => setGodparent1Name(e.target.value)}
                placeholder="e.g. Jane Smith"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Godparent 2 Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                value={godparent2Name}
                onChange={e => setGodparent2Name(e.target.value)}
                placeholder="e.g. Mark Johnson"
                disabled={loading}
              />
            </div>
          </>}

          {/* Confirmation-specific fields */}
          {sacramentType === "CONFIRMATION" && <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                value={sponsorName}
                onChange={e => setSponsorName(e.target.value)}
                placeholder="e.g. James Wilson"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Godparent 1 Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                value={godparent1Name}
                onChange={e => setGodparent1Name(e.target.value)}
                placeholder="e.g. Jane Smith"
                disabled={loading}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Godparent 2 Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                value={godparent2Name}
                onChange={e => setGodparent2Name(e.target.value)}
                placeholder="e.g. Mark Johnson"
                disabled={loading}
              />
            </div>
          </>}
          
          {/* Matrimony-specific fields */}
          {sacramentType === "MATRIMONY" && <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Witness 1 Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                value={witness1Name}
                onChange={e => setWitness1Name(e.target.value)}
                placeholder="e.g. Jane Smith"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Witness 2 Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
                value={witness2Name}
                onChange={e => setWitness2Name(e.target.value)}
                placeholder="e.g. Mark Johnson"
                disabled={loading}
              />
            </div>
          </>}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate URL</label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
              value={certificateUrl}
              onChange={e => setCertificateUrl(e.target.value)}
              placeholder="Paste certificate link (optional)"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base min-h-[48px]"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional notes (optional)"
              disabled={loading}
            />
          </div>
        </>}
        <div className="md:col-span-2 flex flex-col items-center mt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
            disabled={!canAdd}
            style={{ minWidth: 160 }}
          >
            <PlusIcon className="h-5 w-5" /> Add Record
          </button>
          {successMsg && <span className="text-green-600 text-base font-medium animate-pulse mt-3">{successMsg}</span>}
          {error && <span className="text-red-600 text-base font-medium mt-3 animate-shake">{error.message}</span>}
        </div>
      </form>
    </div>
  );
}
