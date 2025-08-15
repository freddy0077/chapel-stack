import React, { useState } from 'react';
import { 
  SparklesIcon, 
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Member } from '../../types/member.types';

interface SacramentsSectionProps {
  member: Member;
}

interface Sacrament {
  id: string;
  type: 'baptism' | 'confirmation' | 'communion' | 'marriage' | 'ordination' | 'dedication';
  date: string;
  location?: string;
  officiant?: string;
  notes?: string;
  certificate?: string;
}

interface AddSacramentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sacrament: Omit<Sacrament, 'id'>) => void;
  memberId: string;
}

const AddSacramentModal: React.FC<AddSacramentModalProps> = ({ isOpen, onClose, onAdd, memberId }) => {
  const [formData, setFormData] = useState({
    type: 'baptism' as Sacrament['type'],
    date: '',
    location: '',
    officiant: '',
    notes: '',
    certificate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      type: 'baptism',
      date: '',
      location: '',
      officiant: '',
      notes: '',
      certificate: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Sacrament</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sacrament Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Sacrament['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="baptism">Baptism</option>
                <option value="confirmation">Confirmation</option>
                <option value="communion">First Communion</option>
                <option value="marriage">Marriage</option>
                <option value="ordination">Ordination</option>
                <option value="dedication">Child Dedication</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Church name or location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Officiant
              </label>
              <input
                type="text"
                value={formData.officiant}
                onChange={(e) => setFormData({ ...formData, officiant: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pastor or officiant name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Additional notes or details"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Sacrament
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SacramentsSection: React.FC<SacramentsSectionProps> = ({ member }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [sacraments, setSacraments] = useState<Sacrament[]>([]);

  // Initialize with existing sacrament data from member
  React.useEffect(() => {
    const existingSacraments: Sacrament[] = [];
    
    if (member.baptismDate) {
      existingSacraments.push({
        id: 'baptism-' + member.id,
        type: 'baptism',
        date: member.baptismDate.toString(),
        location: member.baptismLocation,
        officiant: '',
        notes: ''
      });
    }
    
    if (member.confirmationDate) {
      existingSacraments.push({
        id: 'confirmation-' + member.id,
        type: 'confirmation',
        date: member.confirmationDate.toString(),
        location: '',
        officiant: '',
        notes: ''
      });
    }
    
    setSacraments(existingSacraments);
  }, [member]);

  const getSacramentIcon = (type: string) => {
    switch (type) {
      case 'baptism':
        return <SparklesIcon className="h-4 w-4 text-blue-500" />;
      case 'confirmation':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'communion':
        return <SparklesIcon className="h-4 w-4 text-purple-500" />;
      case 'marriage':
        return <SparklesIcon className="h-4 w-4 text-pink-500" />;
      case 'ordination':
        return <SparklesIcon className="h-4 w-4 text-yellow-500" />;
      case 'dedication':
        return <SparklesIcon className="h-4 w-4 text-indigo-500" />;
      default:
        return <SparklesIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSacramentColor = (type: string) => {
    switch (type) {
      case 'baptism':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmation':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'communion':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'marriage':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'ordination':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'dedication':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatSacramentType = (type: string) => {
    switch (type) {
      case 'communion':
        return 'First Communion';
      case 'dedication':
        return 'Child Dedication';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const handleAddSacrament = (newSacrament: Omit<Sacrament, 'id'>) => {
    const sacrament: Sacrament = {
      ...newSacrament,
      id: `${newSacrament.type}-${Date.now()}`
    };
    setSacraments([...sacraments, sacrament]);
    // TODO: Call GraphQL mutation to add sacrament
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <SparklesIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Sacraments & Milestones</h3>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Sacrament
        </button>
      </div>

      {sacraments.length > 0 ? (
        <div className="space-y-4">
          {sacraments.map((sacrament) => (
            <div
              key={sacrament.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getSacramentIcon(sacrament.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">
                    {formatSacramentType(sacrament.type)}
                  </h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSacramentColor(sacrament.type)}`}>
                    {getSacramentIcon(sacrament.type)}
                    {formatSacramentType(sacrament.type)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {new Date(sacrament.date).toLocaleDateString()}
                  </span>
                  
                  {sacrament.location && (
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-3 w-3" />
                      {sacrament.location}
                    </span>
                  )}
                  
                  {sacrament.officiant && (
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      {sacrament.officiant}
                    </span>
                  )}
                </div>
                
                {sacrament.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    {sacrament.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <SparklesIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No sacraments recorded</p>
          <p className="text-gray-400 text-xs mt-1">
            Add baptism, confirmation, and other spiritual milestones
          </p>
        </div>
      )}

      <AddSacramentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSacrament}
        memberId={member.id}
      />
    </div>
  );
};

export default SacramentsSection;
