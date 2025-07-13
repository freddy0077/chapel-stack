import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { REMOVE_FAMILY_RELATIONSHIP } from '@/graphql/mutations/familyRelationshipMutations';
import { TrashIcon } from '@heroicons/react/24/outline';

interface RemoveFamilyRelationshipProps {
  relationshipId: string;
  relationshipName: string;
  onSuccess?: () => void;
}

export default function RemoveFamilyRelationship({ 
  relationshipId, 
  relationshipName,
  onSuccess 
}: RemoveFamilyRelationshipProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Remove family relationship mutation
  const [removeFamilyRelationship, { loading }] = useMutation(REMOVE_FAMILY_RELATIONSHIP, {
    onCompleted: (data) => {
      if (data.removeFamilyRelationship) {
        toast.success('Family relationship removed successfully');
        setIsConfirming(false);
        onSuccess?.();
      } else {
        toast.error('Failed to remove family relationship');
        setIsConfirming(false);
      }
    },
    onError: (error) => {
      console.error('Error removing family relationship:', error);
      toast.error('Failed to remove family relationship');
      setIsConfirming(false);
    }
  });

  // Handle remove relationship
  const handleRemove = () => {
    removeFamilyRelationship({
      variables: {
        id: relationshipId
      }
    });
  };

  if (isConfirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600">Confirm removal?</span>
        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Removing..." : "Yes"}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={loading}
          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="text-gray-500 hover:text-red-600 transition-colors"
      title={`Remove ${relationshipName} relationship`}
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
