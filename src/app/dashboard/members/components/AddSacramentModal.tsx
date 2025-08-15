'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { CREATE_SACRAMENTAL_RECORD } from '@/graphql/queries/memberQueries';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';

enum SacramentType {
  ANOINTING_OF_THE_SICK = 'ANOINTING_OF_THE_SICK',
  BAPTISM = 'BAPTISM',
  CONFIRMATION = 'CONFIRMATION',
  EUCHARIST_FIRST_COMMUNION = 'EUCHARIST_FIRST_COMMUNION',
  HOLY_ORDERS_DIACONATE = 'HOLY_ORDERS_DIACONATE',
  HOLY_ORDERS_PRIESTHOOD = 'HOLY_ORDERS_PRIESTHOOD',
  MATRIMONY = 'MATRIMONY',
  OTHER = 'OTHER',
  RCIA_INITIATION = 'RCIA_INITIATION',
  RECONCILIATION_FIRST = 'RECONCILIATION_FIRST',
}

interface AddSacramentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMemberIds: string[];
}

const AddSacramentModal: React.FC<AddSacramentModalProps> = ({ isOpen, onClose, selectedMemberIds }) => {
  const { organisationId, branchId, user } = useOrganisationBranch();
  const [formData, setFormData] = useState({
    sacramentType: SacramentType.BAPTISM,
    dateOfSacrament: new Date().toISOString().split('T')[0],
    locationOfSacrament: '',
    officiantName: '',
    notes: '',
    certificateNumber: '',
    godparent1Name: '',
    godparent2Name: '',
    sponsorName: '',
    witness1Name: '',
    witness2Name: '',
  });

  const [createSacramentalRecord, { loading }] = useMutation(CREATE_SACRAMENTAL_RECORD);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        sacramentType: SacramentType.BAPTISM,
        dateOfSacrament: new Date().toISOString().split('T')[0],
        locationOfSacrament: user?.userBranches?.[0]?.branch?.name || '',
        officiantName: '',
        notes: '',
        certificateNumber: '',
        godparent1Name: '',
        godparent2Name: '',
        sponsorName: '',
        witness1Name: '',
        witness2Name: '',
      });
    }
  }, [isOpen, user?.userBranches]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!branchId || !organisationId) {
      toast.error('Cannot determine branch or organisation.');
      return;
    }

    const toastId = toast.loading(`Recording sacrament for ${selectedMemberIds.length} member(s)...`);

    try {
      const promises = selectedMemberIds.map((memberId) =>
        createSacramentalRecord({
          variables: {
            input: {
              ...formData,
              memberId,
              branchId: branchId,
              organisationId: organisationId,
              dateOfSacrament: new Date(formData.dateOfSacrament),
            },
          },
        })
      );

      await Promise.all(promises);
      toast.success('Sacrament(s) recorded successfully!', { id: toastId });
      onClose();
    } catch (error) { 
      console.error('Error recording sacrament:', error);
      toast.error('An error occurred while recording the sacrament(s).', { id: toastId });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-xl"
          >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <BookOpenIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Record Sacrament</h2>
                        <p className="text-sm text-gray-500">For {selectedMemberIds.length} selected member(s)</p>
                    </div>
                </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="sacramentType" className="block text-sm font-medium text-gray-700">Sacrament Type <span className="text-red-500">*</span></label>
                <select
                  id="sacramentType"
                  name="sacramentType"
                  value={formData.sacramentType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {Object.values(SacramentType).map((type) => (
                    <option key={type} value={type}>{type.replace(/_/g, ' ').replace(/\b(\w)/g, s => s.toUpperCase())}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="dateOfSacrament" className="block text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  id="dateOfSacrament"
                  name="dateOfSacrament"
                  value={formData.dateOfSacrament}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="locationOfSacrament" className="block text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="locationOfSacrament"
                  name="locationOfSacrament"
                  value={formData.locationOfSacrament}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="officiantName" className="block text-sm font-medium text-gray-700">Officiant <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="officiantName"
                  name="officiantName"
                  value={formData.officiantName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {formData.sacramentType === 'BAPTISM' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="godparent1Name" className="block text-sm font-medium text-gray-700">Godparent 1</label>
                      <input
                      type="text"
                      id="godparent1Name"
                      name="godparent1Name"
                      value={formData.godparent1Name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                  </div>
                  <div>
                      <label htmlFor="godparent2Name" className="block text-sm font-medium text-gray-700">Godparent 2</label>
                      <input
                      type="text"
                      id="godparent2Name"
                      name="godparent2Name"
                      value={formData.godparent2Name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                  </div>
                </div>
              )}

              {formData.sacramentType === 'CONFIRMATION' && (
                <div>
                    <label htmlFor="sponsorName" className="block text-sm font-medium text-gray-700">Sponsor</label>
                    <input
                    type="text"
                    id="sponsorName"
                    name="sponsorName"
                    value={formData.sponsorName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
              )}

              {formData.sacramentType === 'MATRIMONY' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="witness1Name" className="block text-sm font-medium text-gray-700">Witness 1</label>
                        <input
                        type="text"
                        id="witness1Name"
                        name="witness1Name"
                        value={formData.witness1Name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="witness2Name" className="block text-sm font-medium text-gray-700">Witness 2</label>
                        <input
                        type="text"
                        id="witness2Name"
                        name="witness2Name"
                        value={formData.witness2Name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
              )}

              <div>
                  <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700">Certificate Number</label>
                  <input
                  type="text"
                  id="certificateNumber"
                  name="certificateNumber"
                  value={formData.certificateNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {loading ? 'Saving...' : 'Save Sacraments'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddSacramentModal;
