'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Zap, AlertCircle, CheckCircle, FileJson, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function DataOperationsPage() {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'bulk'>('import');
  const [entityType, setEntityType] = useState('members');
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkOperation, setBulkOperation] = useState<'update' | 'delete' | 'activate' | 'deactivate'>('delete');
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [importData, setImportData] = useState<string>('');

  const entityTypes = [
    { value: 'members', label: 'Members' },
    { value: 'users', label: 'Users' },
    { value: 'branches', label: 'Branches' },
    { value: 'organizations', label: 'Organizations' },
  ];

  const handleValidateImport = async () => {
    if (!importData.trim()) {
      toast.error('Please paste data to validate');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate validation
      const lines = importData.trim().split('\n');
      const recordCount = lines.length;
      
      setValidationResult({
        valid: true,
        recordCount,
        errors: [],
        warnings: recordCount > 1000 ? ['Large dataset may take longer to process'] : [],
        estimatedTime: `${Math.ceil(recordCount / 100)} seconds`,
      });
      
      toast.success(`Validation passed: ${recordCount} records ready to import`);
    } catch (error) {
      toast.error('Validation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!validationResult?.valid) {
      toast.error('Please validate data first');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate import
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully imported ${validationResult.recordCount} records`);
      setImportData('');
      setValidationResult(null);
    } catch (error) {
      toast.error('Import failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const filename = `${entityType}_export_${new Date().toISOString().split('T')[0]}.${format}`;
      toast.success(`Export started: ${filename}`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkOperation = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select records');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate bulk operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Successfully performed ${bulkOperation} on ${selectedIds.length} records`);
      setSelectedIds([]);
    } catch (error) {
      toast.error('Bulk operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">Data Operations</h1>
        </div>
        <p className="text-slate-400">Import, export, and manage data in bulk</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex gap-4"
      >
        {[
          { id: 'import', label: 'Import Data', icon: Upload },
          { id: 'export', label: 'Export Data', icon: Download },
          { id: 'bulk', label: 'Bulk Operations', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-8"
      >
        {/* Import Tab */}
        {activeTab === 'import' && (
          <motion.div variants={itemVariants} className="grid gap-6">
            {/* Entity Type Selection */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Select Entity Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {entityTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setEntityType(type.value)}
                    className={`p-3 rounded-lg font-medium transition-all ${
                      entityType === type.value
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Input */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Paste Data</h2>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste JSON or CSV data here..."
                className="w-full h-48 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <p className="text-sm text-slate-400 mt-2">Supports JSON arrays or CSV format</p>
            </div>

            {/* Validation Result */}
            {validationResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-slate-800/50 backdrop-blur-xl border rounded-xl p-6 ${
                  validationResult.valid
                    ? 'border-green-500/50'
                    : 'border-red-500/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {validationResult.valid ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">
                      {validationResult.valid ? 'Validation Passed' : 'Validation Failed'}
                    </h3>
                    <p className="text-slate-300 mb-3">
                      {validationResult.recordCount} records found
                    </p>
                    {validationResult.errors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-red-400 mb-1">Errors:</p>
                        <ul className="text-sm text-red-300 space-y-1">
                          {validationResult.errors.slice(0, 3).map((err: any, i: number) => (
                            <li key={i}>• {err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {validationResult.warnings.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-yellow-400 mb-1">Warnings:</p>
                        <ul className="text-sm text-yellow-300 space-y-1">
                          {validationResult.warnings.map((warn: any, i: number) => (
                            <li key={i}>• {warn}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleValidateImport}
                disabled={isLoading || !importData.trim()}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all"
              >
                {isLoading ? 'Validating...' : 'Validate Data'}
              </button>
              <button
                onClick={handleImport}
                disabled={isLoading || !validationResult?.valid}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all"
              >
                {isLoading ? 'Importing...' : 'Import Data'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <motion.div variants={itemVariants} className="grid gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Export Settings</h2>
              
              <div className="grid gap-6">
                {/* Entity Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Entity Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {entityTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setEntityType(type.value)}
                        className={`p-3 rounded-lg font-medium transition-all ${
                          entityType === type.value
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Export Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'json', label: 'JSON', icon: FileJson },
                      { value: 'csv', label: 'CSV', icon: FileText },
                    ].map((fmt) => {
                      const Icon = fmt.icon;
                      return (
                        <button
                          key={fmt.value}
                          onClick={() => setFormat(fmt.value as any)}
                          className={`flex items-center gap-2 p-3 rounded-lg font-medium transition-all ${
                            format === fmt.value
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {fmt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-sm text-blue-200">
                    Export will include all records of the selected entity type in {format.toUpperCase()} format.
                  </p>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all text-lg"
            >
              {isLoading ? 'Exporting...' : 'Export Data'}
            </button>
          </motion.div>
        )}

        {/* Bulk Operations Tab */}
        {activeTab === 'bulk' && (
          <motion.div variants={itemVariants} className="grid gap-6">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Bulk Operations</h2>
              
              <div className="grid gap-6">
                {/* Entity Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Entity Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {entityTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setEntityType(type.value)}
                        className={`p-3 rounded-lg font-medium transition-all ${
                          entityType === type.value
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operation */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Operation
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'update', label: 'Update' },
                      { value: 'delete', label: 'Delete' },
                      { value: 'activate', label: 'Activate' },
                      { value: 'deactivate', label: 'Deactivate' },
                    ].map((op) => (
                      <button
                        key={op.value}
                        onClick={() => setBulkOperation(op.value as any)}
                        className={`p-3 rounded-lg font-medium transition-all ${
                          bulkOperation === op.value
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected IDs */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Select Records ({selectedIds.length} selected)
                  </label>
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 h-32 overflow-y-auto">
                    <p className="text-slate-400 text-sm">
                      Simulated: {selectedIds.length > 0 ? `${selectedIds.length} records selected` : 'No records selected'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedIds(['id1', 'id2', 'id3'])}
                    className="mt-3 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    Select Sample Records
                  </button>
                </div>

                {/* Warning */}
                {bulkOperation === 'delete' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-sm text-red-200">
                      ⚠️ This operation cannot be undone. Please ensure you have a backup.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleBulkOperation}
              disabled={isLoading || selectedIds.length === 0}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all text-lg"
            >
              {isLoading ? 'Processing...' : `Execute ${bulkOperation.toUpperCase()}`}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
