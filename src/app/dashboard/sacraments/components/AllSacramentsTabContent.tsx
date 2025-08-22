"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { 
  GET_FILTERED_BAPTISM_RECORDS,
  GET_FILTERED_COMMUNION_RECORDS,
  GET_FILTERED_CONFIRMATION_RECORDS,
  GET_FILTERED_MARRIAGE_RECORDS
} from "@/graphql/queries/sacramentalRecordsQueries";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { SacramentRecord } from "../page";
import SacramentRecordsTable from "./SacramentRecordsTable";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

interface AllSacramentsTabContentProps {
  // Refetch refs for all sacrament types
  baptismRefetchRef: React.MutableRefObject<(() => void) | null>;
  communionRefetchRef: React.MutableRefObject<(() => void) | null>;
  confirmationRefetchRef: React.MutableRefObject<(() => void) | null>;
  marriageRefetchRef: React.MutableRefObject<(() => void) | null>;
  reconciliationRefetchRef: React.MutableRefObject<(() => void) | null>;
  anointingRefetchRef: React.MutableRefObject<(() => void) | null>;
  diaconateRefetchRef: React.MutableRefObject<(() => void) | null>;
  priesthoodRefetchRef: React.MutableRefObject<(() => void) | null>;
  rciaRefetchRef: React.MutableRefObject<(() => void) | null>;
  
  // Event handlers
  onViewRecord: (record: SacramentRecord) => void;
  onEditRecord: (record: SacramentRecord) => void;
  onDeleteRecord: (id: string) => void;
  
  // Modal handlers for creating new records
  onBaptismClick: () => void;
  onCommunionClick: () => void;
  onConfirmationClick: () => void;
  onMarriageClick: () => void;
  onReconciliationClick: () => void;
  onAnointingClick: () => void;
  onDiaconateClick: () => void;
  onPriesthoodClick: () => void;
  onRciaClick: () => void;
}

// Sacrament type configuration
const SACRAMENT_TYPES = [
  {
    key: 'BAPTISM',
    name: 'Baptism',
    color: 'blue',
    icon: '💧',
    query: GET_FILTERED_BAPTISM_RECORDS,
    onClick: 'onBaptismClick',
    refetchRef: 'baptismRefetchRef'
  },
  {
    key: 'EUCHARIST_FIRST_COMMUNION',
    name: 'First Communion',
    color: 'amber',
    icon: '🍞',
    query: GET_FILTERED_COMMUNION_RECORDS,
    onClick: 'onCommunionClick',
    refetchRef: 'communionRefetchRef'
  },
  {
    key: 'CONFIRMATION',
    name: 'Confirmation',
    color: 'purple',
    icon: '🕊️',
    query: GET_FILTERED_CONFIRMATION_RECORDS,
    onClick: 'onConfirmationClick',
    refetchRef: 'confirmationRefetchRef'
  },
  {
    key: 'MATRIMONY',
    name: 'Marriage',
    color: 'rose',
    icon: '💒',
    query: GET_FILTERED_MARRIAGE_RECORDS,
    onClick: 'onMarriageClick',
    refetchRef: 'marriageRefetchRef'
  },
  {
    key: 'RECONCILIATION_FIRST',
    name: 'First Reconciliation',
    color: 'green',
    icon: '🙏',
    query: null, // No specific query yet, will use generic
    onClick: 'onReconciliationClick',
    refetchRef: 'reconciliationRefetchRef'
  },
  {
    key: 'ANOINTING_OF_THE_SICK',
    name: 'Anointing of the Sick',
    color: 'indigo',
    icon: '🛡️',
    query: null,
    onClick: 'onAnointingClick',
    refetchRef: 'anointingRefetchRef'
  },
  {
    key: 'HOLY_ORDERS_DIACONATE',
    name: 'Diaconate Ordination',
    color: 'violet',
    icon: '⛪',
    query: null,
    onClick: 'onDiaconateClick',
    refetchRef: 'diaconateRefetchRef'
  },
  {
    key: 'HOLY_ORDERS_PRIESTHOOD',
    name: 'Priesthood Ordination',
    color: 'violet',
    icon: '✝️',
    query: null,
    onClick: 'onPriesthoodClick',
    refetchRef: 'priesthoodRefetchRef'
  },
  {
    key: 'RCIA_INITIATION',
    name: 'RCIA Initiation',
    color: 'teal',
    icon: '🌟',
    query: null,
    onClick: 'onRciaClick',
    refetchRef: 'rciaRefetchRef'
  }
];

export default function AllSacramentsTabContent({
  baptismRefetchRef,
  communionRefetchRef,
  confirmationRefetchRef,
  marriageRefetchRef,
  reconciliationRefetchRef,
  anointingRefetchRef,
  diaconateRefetchRef,
  priesthoodRefetchRef,
  rciaRefetchRef,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onBaptismClick,
  onCommunionClick,
  onConfirmationClick,
  onMarriageClick,
  onReconciliationClick,
  onAnointingClick,
  onDiaconateClick,
  onPriesthoodClick,
  onRciaClick,
}: AllSacramentsTabContentProps) {
  const [selectedSacramentType, setSelectedSacramentType] = useState('BAPTISM');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const orgBranchFilter = useOrganizationBranchFilter();

  // Get current sacrament type config
  const currentSacrament = SACRAMENT_TYPES.find(s => s.key === selectedSacramentType);

  // Query for current sacrament type (only for types with specific queries)
  const { data, loading, error, refetch } = useQuery(
    currentSacrament?.query || GET_FILTERED_BAPTISM_RECORDS,
    {
      variables: {
        branchId: orgBranchFilter.branchId,
        organisationId: orgBranchFilter.organisationId,
        searchTerm,
        page: currentPage,
        pageSize,
      },
      skip: !orgBranchFilter.branchId || !currentSacrament?.query,
      fetchPolicy: 'cache-and-network',
    }
  );

  // Set up refetch function for current sacrament type
  useEffect(() => {
    if (refetch && currentSacrament) {
      const refetchRefMap = {
        baptismRefetchRef,
        communionRefetchRef,
        confirmationRefetchRef,
        marriageRefetchRef,
        reconciliationRefetchRef,
        anointingRefetchRef,
        diaconateRefetchRef,
        priesthoodRefetchRef,
        rciaRefetchRef,
      };
      
      const refetchRef = refetchRefMap[currentSacrament.refetchRef as keyof typeof refetchRefMap];
      if (refetchRef) {
        refetchRef.current = refetch;
      }
    }
  }, [refetch, currentSacrament, baptismRefetchRef, communionRefetchRef, confirmationRefetchRef, marriageRefetchRef, reconciliationRefetchRef, anointingRefetchRef, diaconateRefetchRef, priesthoodRefetchRef, rciaRefetchRef]);

  // Handle sacrament type change
  const handleSacramentTypeChange = (sacramentType: string) => {
    setSelectedSacramentType(sacramentType);
    setCurrentPage(1);
    setSearchTerm('');
  };

  // Handle create new record
  const handleCreateRecord = () => {
    if (!currentSacrament) return;
    
    const handlerMap = {
      onBaptismClick,
      onCommunionClick,
      onConfirmationClick,
      onMarriageClick,
      onReconciliationClick,
      onAnointingClick,
      onDiaconateClick,
      onPriesthoodClick,
      onRciaClick,
    };
    
    const handler = handlerMap[currentSacrament.onClick as keyof typeof handlerMap];
    if (handler) {
      handler();
    }
  };

  // Get records based on current sacrament type
  const getRecords = () => {
    if (!data) return [];
    
    // Map different query response structures
    if (data.getFilteredBaptismRecords) return data.getFilteredBaptismRecords.records || [];
    if (data.getFilteredCommunionRecords) return data.getFilteredCommunionRecords.records || [];
    if (data.getFilteredConfirmationRecords) return data.getFilteredConfirmationRecords.records || [];
    if (data.getFilteredMarriageRecords) return data.getFilteredMarriageRecords.records || [];
    
    return [];
  };

  const records = getRecords();
  const totalCount = data?.getFilteredBaptismRecords?.totalCount || 
                   data?.getFilteredCommunionRecords?.totalCount || 
                   data?.getFilteredConfirmationRecords?.totalCount || 
                   data?.getFilteredMarriageRecords?.totalCount || 0;

  if (!currentSacrament) return null;

  return (
    <div className="space-y-6">
      {/* Header with sacrament type selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Sacramental Records</h2>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all sacramental records across different types
          </p>
        </div>
        
        <button
          onClick={handleCreateRecord}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${currentSacrament.color}-600 hover:bg-${currentSacrament.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentSacrament.color}-500`}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add {currentSacrament.name}
        </button>
      </div>

      {/* Sacrament Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {SACRAMENT_TYPES.map((sacrament) => (
            <button
              key={sacrament.key}
              onClick={() => handleSacramentTypeChange(sacrament.key)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                selectedSacramentType === sacrament.key
                  ? `border-${sacrament.color}-500 text-${sacrament.color}-600`
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{sacrament.icon}</span>
              {sacrament.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Search ${currentSacrament.name.toLowerCase()} records...`}
            />
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading {currentSacrament.name.toLowerCase()} records...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading records: {error.message}</p>
          </div>
        ) : !currentSacrament.query ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">{currentSacrament.icon}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentSacrament.name} Records
            </h3>
            <p className="text-gray-600 mb-4">
              Records for {currentSacrament.name.toLowerCase()} are not yet available in this view.
            </p>
            <button
              onClick={handleCreateRecord}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${currentSacrament.color}-600 hover:bg-${currentSacrament.color}-700`}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create {currentSacrament.name} Record
            </button>
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">{currentSacrament.icon}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {currentSacrament.name} Records
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No ${currentSacrament.name.toLowerCase()} records match your search.`
                : `No ${currentSacrament.name.toLowerCase()} records have been created yet.`
              }
            </p>
            <button
              onClick={handleCreateRecord}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${currentSacrament.color}-600 hover:bg-${currentSacrament.color}-700`}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create {currentSacrament.name} Record
            </button>
          </div>
        ) : (
          <SacramentRecordsTable
            records={records}
            onView={onViewRecord}
            onEdit={onEditRecord}
            onDelete={onDeleteRecord}
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            sacramentType={selectedSacramentType}
          />
        )}
      </div>
    </div>
  );
}
