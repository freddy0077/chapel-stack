'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Title, Text, Button, Card, Badge } from '@tremor/react';
import { 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  DocumentArrowDownIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

interface MemberDataImportScreenProps {
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
  memberFile: File | null;
  setMemberFile: (file: File | null) => void;
  memberImportError: string | null;
  onDownloadTemplate: () => void;
  isTemplateLoading?: boolean;
}

/**
 * Member data import screen component for the onboarding flow
 * Allows users to download a template and upload member data
 */
const MemberDataImportScreen = ({ 
  onNext, 
  onBack,
  isLoading,
  memberFile,
  setMemberFile,
  memberImportError,
  onDownloadTemplate,
  isTemplateLoading
}: MemberDataImportScreenProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMemberFile(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="max-w-2xl mx-auto py-8"
    >
      <Title className="text-2xl font-bold text-gray-900 mb-6">
        Import Member Data
      </Title>
      
      <Card className="mb-6 p-6">
        <div className="space-y-6">
          <div>
            <Text className="text-gray-600 mb-4">
              Import your existing member data to quickly set up your church management system.
              This step is optional - you can always import member data later.
            </Text>
            
            <div className="mt-4">
              <Button
                color="indigo"
                variant="secondary"
                icon={DocumentArrowDownIcon}
                onClick={onDownloadTemplate}
                className="mb-4"
                loading={isTemplateLoading}
                disabled={isTemplateLoading}
              >
                Download Template
              </Button>
              
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                {memberFile ? (
                  <div>
                    <Badge color="green" className="mb-2">File Selected</Badge>
                    <p className="text-sm text-gray-600">{memberFile.name}</p>
                    <Button 
                      size="xs" 
                      color="gray" 
                      variant="light" 
                      onClick={() => setMemberFile(null)}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="member-file-upload" className="cursor-pointer">
                      <div className="text-center">
                        <DocumentArrowDownIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-indigo-600 hover:text-indigo-500">
                            Click to upload
                          </span>
                          {' '}or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">
                          CSV, XLS, or XLSX up to 10MB
                        </p>
                      </div>
                      <input
                        id="member-file-upload"
                        name="member-file-upload"
                        type="file"
                        className="sr-only"
                        accept=".csv,.xls,.xlsx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              {memberImportError && (
                <div className="mt-2 text-sm text-red-600">
                  <ExclamationCircleIcon className="inline-block h-4 w-4 mr-1" />
                  {memberImportError}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          color="gray"
          icon={ArrowLeftIcon}
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          color="indigo"
          icon={ArrowRightIcon}
          iconPosition="right"
          onClick={onNext}
          loading={isLoading}
          disabled={isLoading}
        >
          {memberFile ? "Import and Continue" : "Skip for Now"}
        </Button>
      </div>
    </motion.div>
  );
};

export default MemberDataImportScreen;
