"use client";

import React, { useState, useEffect } from 'react';
import SharedModal from './SharedModal';
import { formatDate } from '@/utils/financeHelpers';
import { Event, BatchEventItem } from '@/types/finance';

interface BatchOfferingModalProps {
  open: boolean;
  onClose: () => void;
  events: Event[];
  onSubmit: (batch: BatchEventItem[]) => void;
  loading: boolean;
}

export default function BatchOfferingModal({ 
  open, 
  onClose, 
  events, 
  onSubmit, 
  loading 
}: BatchOfferingModalProps) {
  const [form, setForm] = useState<BatchEventItem[]>([]);

  useEffect(() => {
    setForm(events.map((e: Event) => ({ 
      eventId: e.id, 
      amount: '', 
      note: '',
      included: false
    })));
  }, [events, open]);

  const handleChange = (idx: number, field: 'amount' | 'note' | 'included', value: string | boolean) => {
    setForm(f => f.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = form.filter(row => 
      row.included && row.amount && !isNaN(Number(row.amount)) && Number(row.amount) > 0
    );
    
    if (batch.length > 0) {
      onSubmit(batch);
    } else {
      alert('Please include at least one event with a valid amount.');
    }
  };

  const handleSelectAll = () => {
    const allSelected = form.every(row => row.included);
    setForm(f => f.map(row => ({ ...row, included: !allSelected })));
  };

  const selectedCount = form.filter(row => row.included).length;
  const totalAmount = form
    .filter(row => row.included && row.amount)
    .reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  return (
    <SharedModal open={open} title="Batch Offering for Events" onClose={onClose} maxWidth="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Summary */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-indigo-700">
              Selected Events: <strong>{selectedCount}</strong>
            </span>
            <span className="text-indigo-700">
              Total Amount: <strong>₵{totalAmount.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {form.every(row => row.included) ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left font-semibold text-gray-900">Include</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-900">Event</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-900">Date</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-900">Amount (₵)</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-900">Note (optional)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event, idx) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={form[idx]?.included || false}
                      onChange={(e) => handleChange(idx, 'included', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900">
                    {event.title || event.name}
                  </td>
                  <td className="px-3 py-3 text-gray-600">
                    {formatDate(event.startDate || event.date || '')}
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form[idx]?.amount || ''}
                      onChange={(e) => handleChange(idx, 'amount', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                      disabled={!form[idx]?.included}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={form[idx]?.note || ''}
                      onChange={(e) => handleChange(idx, 'note', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Optional note"
                      disabled={!form[idx]?.included}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No events available for batch offering.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading || selectedCount === 0}
          >
            {loading ? "Processing..." : `Record ${selectedCount} Offerings`}
          </button>
        </div>
      </form>
    </SharedModal>
  );
}
