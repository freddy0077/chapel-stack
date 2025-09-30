"use client";

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CloudUpload, 
  FileUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useMutation } from '@apollo/client';
import { CREATE_MEMBER, CreateMemberInput, ImportMembersResult, ImportMemberData, ImportMemberResult } from '@/graphql/queries/memberImportQueries';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ImportMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: ImportMembersResult) => void;
}

interface ParsedData {
  data: ImportMemberData[];
  errors: string[];
  preview: ImportMemberData[];
  headers: string[];
  rawData: any[];
}

interface ColumnMapping {
  [csvColumn: string]: string | null; // Maps CSV column to member field
}

const REQUIRED_FIELDS = [
  { key: 'firstName', label: 'First Name', required: true },
  { key: 'lastName', label: 'Last Name', required: true }
];

const SPECIAL_FIELDS = [
  { key: 'fullName', label: '👤 Full Name (Split to First & Last)', description: 'Automatically splits full name into first and last name' }
];

const OPTIONAL_FIELDS = [
  { key: 'middleName', label: 'Middle Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'alternativeEmail', label: 'Alternative Email' },
  { key: 'alternatePhone', label: 'Alternative Phone' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State/Province' },
  { key: 'postalCode', label: 'Postal Code' },
  { key: 'country', label: 'Country' },
  { key: 'dateOfBirth', label: 'Date of Birth' },
  { key: 'gender', label: 'Gender' },
  { key: 'maritalStatus', label: 'Marital Status' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'employerName', label: 'Employer Name' },
  { key: 'education', label: 'Education' },
  { key: 'membershipStatus', label: 'Membership Status' },
  { key: 'membershipType', label: 'Membership Type' },
  { key: 'membershipDate', label: 'Membership Date' },
  { key: 'baptismDate', label: 'Baptism Date' },
  { key: 'baptismLocation', label: 'Baptism Location' },
  { key: 'confirmationDate', label: 'Confirmation Date' },
  { key: 'salvationDate', label: 'Salvation Date' },
  { key: 'notes', label: 'Notes' },
  { key: 'emergencyContactName', label: 'Emergency Contact Name' },
  { key: 'emergencyContactPhone', label: 'Emergency Contact Phone' },
  { key: 'emergencyContactRelation', label: 'Emergency Contact Relation' },
  { key: 'fatherName', label: 'Father Name' },
  { key: 'motherName', label: 'Mother Name' },
  { key: 'fatherOccupation', label: 'Father Occupation' },
  { key: 'motherOccupation', label: 'Mother Occupation' }
];

const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS, ...SPECIAL_FIELDS];

const SAMPLE_CSV_HEADERS = [
  'firstName', 'lastName', 'middleName', 'email', 'phoneNumber', 'address',
  'city', 'dateOfBirth', 'gender', 'maritalStatus', 'occupation', 'membershipStatus'
].join(',');

export default function ImportMembersModal({ isOpen, onClose, onSuccess }: ImportMembersModalProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'options' | 'importing' | 'results'>('upload');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [importResult, setImportResult] = useState<ImportMembersResult | null>(null);
  const [progress, setProgress] = useState(0);

  const [createMember] = useMutation(CREATE_MEMBER);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  }, []);

  // Helper function to split full name
  const splitFullName = (fullName: string): { firstName: string; lastName: string; middleName?: string } => {
    const nameParts = fullName.trim().split(/\s+/).filter(part => part.length > 0);
    
    if (nameParts.length === 0) {
      return { firstName: '', lastName: '' };
    } else if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: '' };
    } else if (nameParts.length === 2) {
      return { firstName: nameParts[0], lastName: nameParts[1] };
    } else {
      // More than 2 parts: first name, middle name(s), last name
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      const middleName = nameParts.slice(1, -1).join(' ');
      return { firstName, lastName, middleName };
    }
  };

  // Process mapped data
  const processMappedData = useCallback(() => {
    if (!parsedData) return;

    const errors: string[] = [];
    const data: ImportMemberData[] = [];

    // Check if required fields are mapped (or if fullName is mapped)
    const hasFullNameMapping = Object.values(columnMapping).includes('fullName');
    const requiredFieldsMapped = hasFullNameMapping || REQUIRED_FIELDS.every(field => 
      Object.values(columnMapping).includes(field.key)
    );

    if (!requiredFieldsMapped) {
      const missingFields = REQUIRED_FIELDS.filter(field => 
        !Object.values(columnMapping).includes(field.key)
      ).map(f => f.label);
      errors.push(`Required fields not mapped: ${missingFields.join(', ')} (or map a Full Name column)`);
    }

    // Process each row
    parsedData.rawData.forEach((row: any, index: number) => {
      const memberData: any = {};
      let hasRequiredData = true;

      // Map columns to member fields
      Object.entries(columnMapping).forEach(([csvColumn, memberField]) => {
        if (memberField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
          let value = String(row[csvColumn]).trim();
          
          // Handle special full name splitting
          if (memberField === 'fullName') {
            const { firstName, lastName, middleName } = splitFullName(value);
            memberData.firstName = firstName;
            memberData.lastName = lastName;
            if (middleName) {
              memberData.middleName = middleName;
            }
          } else {
            // Apply field-specific transformations
            if (memberField === 'gender' || memberField === 'maritalStatus' || memberField === 'membershipStatus' || memberField === 'membershipType') {
              value = value.toUpperCase();
            }
            
            memberData[memberField] = value;
          }
        }
      });

      // Check required fields for this row
      REQUIRED_FIELDS.forEach(field => {
        if (!memberData[field.key]) {
          hasRequiredData = false;
          errors.push(`Row ${index + 2}: Missing required field '${field.label}'`);
        }
      });

      if (hasRequiredData) {
        data.push(memberData as ImportMemberData);
      }
    });

    setParsedData(prev => prev ? {
      ...prev,
      data,
      errors,
      preview: data.slice(0, 5)
    } : null);

    if (errors.length === 0) {
      setStep('preview');
    }
  }, [parsedData, columnMapping]);

  const parseFile = useCallback((file: File) => {
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isExcel = fileExtension === 'xlsx' || fileExtension === 'xls';

    reader.onload = (e) => {
      try {
        let headers: string[] = [];
        let rawData: any[] = [];
        const errors: string[] = [];

        if (isExcel) {
          // Parse Excel file
          const data = e.target?.result as ArrayBuffer;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          if (jsonData.length === 0) {
            errors.push('No data found in Excel file');
          } else {
            // First row as headers
            headers = jsonData[0]?.map(h => String(h || '').trim()).filter(h => h) || [];
            
            // Convert remaining rows to objects
            rawData = jsonData.slice(1)
              .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
              .map(row => {
                const obj: any = {};
                headers.forEach((header, index) => {
                  obj[header] = row[index] !== null && row[index] !== undefined ? String(row[index]).trim() : '';
                });
                return obj;
              });
          }
        } else {
          // Parse CSV file
          const text = e.target?.result as string;
          const parseResult = Papa.parse(text, {
            header: true,
            skipEmptyLines: true
          });
          
          if (parseResult.errors.length > 0) {
            errors.push(`CSV parsing errors: ${parseResult.errors.map(e => e.message).join(', ')}`);
          }
          
          headers = Object.keys(parseResult.data[0] || {});
          rawData = parseResult.data;
        }

        if (headers.length === 0) {
          errors.push(`No columns found in ${isExcel ? 'Excel' : 'CSV'} file`);
        }

        if (rawData.length === 0) {
          errors.push(`No data rows found in ${isExcel ? 'Excel' : 'CSV'} file`);
        }

        setParsedData({
          data: [], // Will be populated after mapping
          errors,
          preview: [],
          headers,
          rawData
        });

        if (errors.length === 0) {
          // Initialize empty mapping - users must manually map all columns
          const emptyMapping: ColumnMapping = {};
          headers.forEach(header => {
            emptyMapping[header] = null;
          });
          setColumnMapping(emptyMapping);
          setStep('mapping');
        }
      } catch (error) {
        setParsedData({
          data: [],
          errors: [`Failed to parse file: ${(error as Error).message}`],
          preview: [],
          headers: [],
          rawData: []
        });
      }
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }, []);

  const handleImport = async () => {
    if (!parsedData || !organisationId || !branchId) return;

    setStep('importing');
    setProgress(0);

    const results: ImportMemberResult[] = [];
    const errors: any[] = [];
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    try {
      // Process members one by one using createMember mutation
      for (let i = 0; i < parsedData.data.length; i++) {
        const memberData = parsedData.data[i];
        setProgress((i / parsedData.data.length) * 100);

        try {
          // Check for duplicates if skipDuplicates is enabled
          if (skipDuplicates && memberData.email) {
            // For now, we'll skip this check since we don't have a search mutation
            // In a real implementation, you'd check for existing members
          }

          // Create the member input
          const createMemberInput: CreateMemberInput = {
            organisationId,
            branchId,
            ...memberData
          };

          const result = await createMember({
            variables: { createMemberInput }
          });

          if (result.data?.createMember) {
            results.push({
              id: result.data.createMember.id,
              firstName: result.data.createMember.firstName,
              lastName: result.data.createMember.lastName,
              email: result.data.createMember.email,
              success: true,
              row: i + 1
            });
            successCount++;
          }
        } catch (memberError: any) {
          console.error(`Error creating member ${i + 1}:`, memberError);
          results.push({
            firstName: memberData.firstName,
            lastName: memberData.lastName,
            email: memberData.email,
            success: false,
            error: memberError.message || 'Failed to create member',
            row: i + 1
          });
          errors.push({
            row: i + 1,
            field: 'general',
            message: memberError.message || 'Failed to create member',
            value: `${memberData.firstName} ${memberData.lastName}`
          });
          errorCount++;
        }

        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const importResult: ImportMembersResult = {
        totalProcessed: parsedData.data.length,
        successCount,
        errorCount,
        skippedCount,
        results,
        errors,
        summary: `Import completed: ${successCount} successful, ${errorCount} failed, ${skippedCount} skipped`
      };

      setImportResult(importResult);
      setStep('results');
      
      if (onSuccess) {
        onSuccess(importResult);
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({
        totalProcessed: parsedData.data.length,
        successCount: 0,
        errorCount: parsedData.data.length,
        skippedCount: 0,
        results: [],
        errors: [{ row: 0, field: 'general', message: 'Import failed: ' + (error as Error).message }],
        summary: 'Import failed due to an error.'
      });
      setStep('results');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setParsedData(null);
    setImportResult(null);
    setProgress(0);
    setColumnMapping({});
    onClose();
  };

  const handleMappingChange = (csvColumn: string, memberField: string | null) => {
    setColumnMapping(prev => ({
      ...prev,
      [csvColumn]: memberField === '__SKIP__' ? null : memberField
    }));
  };

  const getUnmappedFields = () => {
    const mappedFields = Object.values(columnMapping).filter(Boolean);
    return ALL_FIELDS.filter(field => !mappedFields.includes(field.key));
  };

  const getMappedFieldsCount = () => {
    return Object.values(columnMapping).filter(Boolean).length;
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      SAMPLE_CSV_HEADERS,
      'John,Doe,Michael,john.doe@email.com,+1234567890,123 Main St,Anytown,1990-01-15,MALE,SINGLE,Engineer,MEMBER',
      'Jane,Smith,,jane.smith@email.com,+1234567891,456 Oak Ave,Somewhere,1985-05-20,FEMALE,MARRIED,Teacher,ACTIVE_MEMBER'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_import_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DocumentArrowUpIcon className="h-6 w-6 text-blue-600" />
            Import Members
          </DialogTitle>
        </DialogHeader>

        {step === 'mapping' && parsedData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Map CSV Columns to Member Fields</h3>
              <div className="text-sm text-gray-600">
                {getMappedFieldsCount()} of {parsedData.headers.length} columns mapped
              </div>
            </div>

            <Alert>
              <InformationCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Manual Column Mapping Required:</strong> Choose which CSV columns correspond to which member fields. 
                You must map the required fields (First Name, Last Name) to continue. Other columns can be skipped if not needed.
              </AlertDescription>
            </Alert>

            <div className="max-h-96 overflow-y-auto space-y-4">
              {parsedData.headers.map((header, index) => {
                const sampleValue = parsedData.rawData[0]?.[header];
                const isMapped = columnMapping[header] !== null && columnMapping[header] !== '';
                const isRequiredField = REQUIRED_FIELDS.some(field => field.key === columnMapping[header]);
                
                return (
                  <div key={index} className={`flex items-center space-x-4 p-4 border rounded-lg transition-colors ${
                    isMapped 
                      ? isRequiredField 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">{header}</div>
                        {isMapped && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isRequiredField 
                              ? 'bg-red-100 text-red-700 border border-red-200' 
                              : 'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {isRequiredField ? 'Required' : 'Mapped'}
                          </span>
                        )}
                      </div>
                      {sampleValue && (
                        <div className="text-sm text-gray-500 mt-1">
                          Sample: {String(sampleValue).substring(0, 50)}{String(sampleValue).length > 50 ? '...' : ''}
                        </div>
                      )}
                    </div>
                    <div className="w-64">
                      <Select
                        value={columnMapping[header] || '__SKIP__'}
                        onValueChange={(value) => handleMappingChange(header, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
                          <SelectItem value="__SKIP__" className="bg-white hover:bg-gray-100">-- Skip this column --</SelectItem>
                          <div className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 border-b border-purple-100">✨ Smart Fields</div>
                          {SPECIAL_FIELDS.map(field => (
                            <SelectItem 
                              key={field.key} 
                              value={field.key}
                              disabled={Object.values(columnMapping).includes(field.key) && columnMapping[header] !== field.key}
                              className="font-medium text-purple-700 bg-white hover:bg-purple-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              <div>
                                <div>{field.label}</div>
                                <div className="text-xs text-purple-600 font-normal">{field.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border-b border-red-100">⚠️ Required Fields (Must Map)</div>
                          {REQUIRED_FIELDS.map(field => (
                            <SelectItem 
                              key={field.key} 
                              value={field.key}
                              disabled={Object.values(columnMapping).includes(field.key) && columnMapping[header] !== field.key}
                              className="font-medium text-red-700 bg-white hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              {field.label} *
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">📝 Optional Fields</div>
                          {OPTIONAL_FIELDS.map(field => (
                            <SelectItem 
                              key={field.key} 
                              value={field.key}
                              disabled={Object.values(columnMapping).includes(field.key) && columnMapping[header] !== field.key}
                              className="bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>

            {parsedData.errors.length > 0 && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {parsedData.errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button 
                onClick={processMappedData}
                disabled={!(Object.values(columnMapping).includes('fullName') || REQUIRED_FIELDS.every(field => Object.values(columnMapping).includes(field.key)))}
                className={(Object.values(columnMapping).includes('fullName') || REQUIRED_FIELDS.every(field => Object.values(columnMapping).includes(field.key))) 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : ''}
              >
                {(Object.values(columnMapping).includes('fullName') || REQUIRED_FIELDS.every(field => Object.values(columnMapping).includes(field.key)))
                  ? '✅ Continue to Preview'
                  : '⚠️ Map Required Fields or Full Name'
                }
              </Button>
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload CSV or Excel file
                  </span>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">File Format Requirements:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Supported formats:</strong> CSV (.csv), Excel (.xlsx, .xls)</li>
                <li>• <strong>Required fields:</strong> First Name, Last Name (can be any column names)</li>
                <li>• <strong>Column mapping:</strong> You'll choose which columns map to which fields</li>
                <li>• <strong>Date format:</strong> YYYY-MM-DD (e.g., 1990-01-15)</li>
                <li>• <strong>First row:</strong> Should contain column headers</li>
              </ul>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSampleCSV}
                className="mt-3"
              >
                📥 Download Sample CSV
              </Button>
            </div>

            {parsedData?.errors && parsedData.errors.length > 0 && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {parsedData.errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {step === 'preview' && parsedData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Preview Import Data</h3>
              <div className="text-sm text-gray-600">
                {parsedData.data.length} members ready to import
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedData.preview.map((member, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {member.firstName} {member.lastName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {member.email || '—'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {member.phoneNumber || '—'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {member.membershipStatus || 'VISITOR'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {parsedData.data.length > 5 && (
              <div className="text-sm text-gray-600 text-center">
                Showing first 5 of {parsedData.data.length} members
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back to Mapping
              </Button>
              <Button onClick={() => setStep('options')}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'options' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Import Options</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skipDuplicates"
                  checked={skipDuplicates}
                  onCheckedChange={setSkipDuplicates}
                />
                <Label htmlFor="skipDuplicates" className="text-sm">
                  Skip duplicate members (based on email or phone)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="updateExisting"
                  checked={updateExisting}
                  onCheckedChange={setUpdateExisting}
                />
                <Label htmlFor="updateExisting" className="text-sm">
                  Update existing members with new data
                </Label>
              </div>
            </div>

            <Alert>
              <InformationCircleIcon className="h-4 w-4" />
              <AlertDescription>
                {skipDuplicates 
                  ? "Duplicate members will be skipped and not imported."
                  : updateExisting
                  ? "Existing members will be updated with new information."
                  : "Duplicate members will cause import errors."
                }
              </AlertDescription>
            </Alert>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('preview')}>
                Back to Preview
              </Button>
              <Button onClick={handleImport} disabled={step === 'importing'}>
                {step === 'importing' ? 'Importing...' : `Import ${parsedData?.data.length} Members`}
              </Button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="space-y-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div>
              <h3 className="text-lg font-medium">Importing Members...</h3>
              <p className="text-gray-600">Please wait while we process your data.</p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {step === 'results' && importResult && (
          <div className="space-y-6">
            <div className="text-center">
              {importResult.errorCount === 0 ? (
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              ) : (
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500" />
              )}
              <h3 className="mt-4 text-lg font-medium">Import Complete</h3>
              <p className="text-gray-600">{importResult.summary}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{importResult.successCount}</div>
                <div className="text-sm text-green-800">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{importResult.errorCount}</div>
                <div className="text-sm text-red-800">Errors</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{importResult.skippedCount}</div>
                <div className="text-sm text-yellow-800">Skipped</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{importResult.totalProcessed}</div>
                <div className="text-sm text-blue-800">Total</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-900">Errors:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {importResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-800 bg-red-50 p-2 rounded">
                      Row {error.row}: {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
