// Death Register Types
export enum BurialType {
  BURIAL = 'BURIAL',
  CREMATION = 'CREMATION',
}

export interface DeathRegister {
  id: string;
  memberId: string;
  dateOfDeath: Date;
  timeOfDeath?: string;
  placeOfDeath: string;
  causeOfDeath?: string;
  circumstances?: string;
  
  // Funeral Information
  funeralDate?: Date;
  funeralLocation?: string;
  funeralOfficiant?: string;
  burialCremation: BurialType;
  cemeteryLocation?: string;
  
  // Family & Contacts
  nextOfKin: string;
  nextOfKinPhone?: string;
  nextOfKinEmail?: string;
  familyNotified: boolean;
  notificationDate?: Date;
  
  // Documentation
  deathCertificateUrl?: string;
  obituaryUrl?: string;
  photoUrls: string[];
  additionalDocuments: string[];
  
  // Administrative
  recordedBy: string;
  recordedDate: Date;
  lastUpdatedBy?: string;
  lastUpdatedDate?: Date;
  
  // Foreign Keys
  branchId?: string;
  organisationId: string;
  funeralEventId?: string;
  
  // Relations
  member: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth?: Date;
    profileImageUrl?: string;
    gender: string;
    membershipDate?: Date;
    phoneNumber?: string;
    email?: string;
    address?: string;
  };
  branch?: {
    id: string;
    name: string;
  };
  organisation: {
    id: string;
    name: string;
  };
  funeralEvent?: {
    id: string;
    title: string;
    startDate: Date;
    endDate?: Date;
    location?: string;
    description?: string;
  };
}

export interface DeathRegisterStats {
  total: number;
  thisYear: number;
  thisMonth: number;
  burialCount: number;
  cremationCount: number;
  averageAge: number;
  familyNotifiedCount: number;
  funeralServicesHeld: number;
}

export interface MemorialDate {
  memberId: string;
  memberName: string;
  dateOfDeath: Date;
  yearsAgo: number;
  photoUrl?: string;
}

// Input Types
export interface CreateDeathRegisterInput {
  memberId: string;
  dateOfDeath: Date;
  timeOfDeath?: string;
  placeOfDeath: string;
  causeOfDeath?: string;
  circumstances?: string;
  
  // Funeral Information
  funeralDate?: Date;
  funeralLocation?: string;
  funeralOfficiant?: string;
  burialCremation: BurialType;
  cemeteryLocation?: string;
  
  // Family & Contacts
  nextOfKin: string;
  nextOfKinPhone?: string;
  nextOfKinEmail?: string;
  familyNotified?: boolean;
  notificationDate?: Date;
  
  // Documentation
  deathCertificateUrl?: string;
  obituaryUrl?: string;
  photoUrls?: string[];
  additionalDocuments?: string[];
  
  // Foreign Keys
  branchId?: string;
  organisationId: string;
  funeralEventId?: string;
}

export interface UpdateDeathRegisterInput extends Partial<CreateDeathRegisterInput> {
  id: string;
}

export interface DeathRegisterFilterInput {
  organisationId?: string;
  branchId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
  burialType?: BurialType;
  familyNotified?: boolean;
  hasFuneralEvent?: boolean;
  recordedBy?: string;
  skip?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UploadDeathDocumentInput {
  deathRegisterId: string;
  documentUrl: string;
  documentType: 'DEATH_CERTIFICATE' | 'OBITUARY' | 'PHOTO' | 'OTHER';
  description?: string;
}

// UI State Types
export interface DeathRegisterFormData {
  // Member Selection
  selectedMember?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  
  // Death Information
  dateOfDeath: string;
  timeOfDeath: string;
  placeOfDeath: string;
  causeOfDeath: string;
  circumstances: string;
  
  // Funeral Information
  funeralDate: string;
  funeralLocation: string;
  funeralOfficiant: string;
  burialCremation: BurialType;
  cemeteryLocation: string;
  
  // Family & Contacts
  nextOfKin: string;
  nextOfKinPhone: string;
  nextOfKinEmail: string;
  familyNotified: boolean;
  notificationDate: string;
  
  // Documentation
  deathCertificateUrl: string;
  obituaryUrl: string;
  photoUrls: string[];
  additionalDocuments: string[];
  
  // Administrative
  branchId: string;
  organisationId: string;
  funeralEventId: string;
}

export interface DeathRegisterViewMode {
  mode: 'LIST' | 'CARD' | 'TABLE';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: DeathRegisterFilterInput;
  searchTerm: string;
}

// Component Props Types
export interface DeathRegisterListProps {
  deathRegisters: DeathRegister[];
  loading: boolean;
  onEdit: (deathRegister: DeathRegister) => void;
  onDelete: (id: string) => void;
  onView: (deathRegister: DeathRegister) => void;
  onMarkFamilyNotified: (id: string) => void;
}

export interface DeathRegisterFormProps {
  deathRegister?: DeathRegister;
  onSubmit: (data: CreateDeathRegisterInput | UpdateDeathRegisterInput) => void;
  onCancel: () => void;
  loading: boolean;
}

export interface DeathRegisterStatsProps {
  stats: DeathRegisterStats;
  loading: boolean;
  organisationId?: string;
  branchId?: string;
}

export interface MemorialCalendarProps {
  year: number;
  memorialDates: MemorialDate[];
  loading: boolean;
  onYearChange: (year: number) => void;
  organisationId?: string;
  branchId?: string;
}

export interface DocumentUploadProps {
  deathRegisterId: string;
  onUpload: (input: UploadDeathDocumentInput) => void;
  loading: boolean;
}

// Hook Return Types
export interface UseDeathRegistersResult {
  deathRegisters: DeathRegister[];
  loading: boolean;
  error?: Error;
  refetch: () => void;
  fetchMore: () => void;
  hasMore: boolean;
}

export interface UseDeathRegisterResult {
  deathRegister?: DeathRegister;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseDeathRegisterStatsResult {
  stats?: DeathRegisterStats;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseMemorialCalendarResult {
  memorialDates: MemorialDate[];
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export interface UseDeathRegisterMutationsResult {
  createDeathRegister: (input: CreateDeathRegisterInput) => Promise<DeathRegister>;
  updateDeathRegister: (input: UpdateDeathRegisterInput) => Promise<DeathRegister>;
  deleteDeathRegister: (id: string) => Promise<boolean>;
  uploadDocument: (input: UploadDeathDocumentInput) => Promise<DeathRegister>;
  markFamilyNotified: (id: string) => Promise<DeathRegister>;
  loading: boolean;
  error?: Error;
}
