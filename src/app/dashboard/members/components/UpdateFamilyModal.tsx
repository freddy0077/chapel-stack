import { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_FAMILIES = gql`
  query GetFamilies($skip: Int, $take: Int) {
    families(skip: $skip, take: $take) {
      id
      name
    }
  }
`;

const ADD_MEMBER_TO_FAMILY = gql`
  mutation AddMemberToFamily($familyId: String!, $memberId: String!) {
    addMemberToFamily(familyId: $familyId, memberId: $memberId) {
      id
      name
      members { id firstName lastName }
    }
  }
`;

function filterFamilies(families: any[], search: string) {
  if (!search) return families;
  const s = search.toLowerCase();
  return families.filter(f => f.name.toLowerCase().includes(s));
}

export default function UpdateFamilyModal({ open, onClose, memberId, onUpdated }: { open: boolean; onClose: () => void; memberId: string; onUpdated: () => void }) {
  const [search, setSearch] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [skip] = useState(0);
  const [take] = useState(50);
  const { data, loading } = useQuery(GET_FAMILIES, { variables: { skip, take } });
  const [addMemberToFamily, { loading: adding, error }] = useMutation(ADD_MEMBER_TO_FAMILY);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => { setSelectedFamilyId(null); }, [search]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!selectedFamilyId) return;
    setSubmitError(null);
    try {
      await addMemberToFamily({ variables: { familyId: selectedFamilyId, memberId } });
      onUpdated();
      onClose();
    } catch (e: any) {
      setSubmitError(e.message || "Failed to update family.");
    }
  };

  const filtered = filterFamilies(data?.families || [], search);

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-10">
        <div className="font-bold text-lg mb-4">Update Member's Family</div>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          placeholder="Search families by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        <div className="max-h-48 overflow-y-auto mb-4">
          {loading ? (
            <div>Loading families...</div>
          ) : (
            filtered.length > 0 ? (
              <ul>
                {filtered.map((family: any) => (
                  <li key={family.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${selectedFamilyId === family.id ? 'bg-indigo-100 font-semibold' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedFamilyId(family.id)}
                    >
                      {family.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No families found.</div>
            )
          )}
        </div>
        {submitError && <div className="text-red-600 text-sm mb-2">{submitError}</div>}
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700" onClick={onClose} disabled={adding}>Cancel</button>
          <button className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" onClick={handleSubmit} disabled={adding || !selectedFamilyId}>{adding ? "Updating..." : "Update Family"}</button>
        </div>
      </div>
    </div>
  );
}
