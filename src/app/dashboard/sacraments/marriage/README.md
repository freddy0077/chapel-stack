# Marriage Sacrament Management - Best Practices & Improvement Guide

## 📋 Table of Contents

- [Current Implementation](#current-implementation)
- [Best Practices](#best-practices)
- [Backend Improvements](#backend-improvements)
- [Frontend Enhancements](#frontend-enhancements)
- [Data Model Recommendations](#data-model-recommendations)
- [Implementation Roadmap](#implementation-roadmap)
- [Technical Considerations](#technical-considerations)

## 🎯 Current Implementation

### Frontend Features ✅

- **Dual Member Linking**: Both groom and bride can be linked to member records
- **Flexible Input**: SearchableMemberOrTextInput supports member search + manual entry
- **Smart Validation**: Ensures both groom and bride information is provided
- **Visual Feedback**: Clear distinction between member-linked vs manual entries
- **Gender-Aware Logic**: Auto-populates appropriate fields based on member gender
- **Backend Compatible**: Works with current text-based schema

### Current Backend Schema

```prisma
model SacramentalRecord {
  id                    String        @id @default(cuid())
  memberId              String        // Primary member (required)
  sacramentType         SacramentType // MATRIMONY
  dateOfSacrament       DateTime
  locationOfSacrament   String
  officiantName         String
  officiantId           String?       // Optional officiant reference

  // Marriage-specific fields (current)
  groomName             String?       // Text only
  brideName             String?       // Text only
  witness1Name          String?
  witness2Name          String?

  // Certificate & metadata
  certificateNumber     String?
  certificateUrl        String?
  notes                 String?

  branchId              String
  organisationId        String?
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
}
```

## 🏆 Best Practices

### 1. **Member Relationship Management**

```typescript
// ✅ GOOD: Link both partners when possible
const marriageRecord = {
  memberId: primaryMember.id, // One spouse (required)
  groomMemberId: groomMember?.id, // Link if member
  brideMemberId: brideMember?.id, // Link if member
  groomName: groomMember?.fullName || manualGroomName,
  brideName: brideMember?.fullName || manualBrideName,
};

// ❌ AVOID: Only linking one partner
const marriageRecord = {
  memberId: oneMember.id,
  groomName: "Manual text only", // Lost relationship data
  brideName: "Manual text only",
};
```

### 2. **Data Validation Hierarchy**

```typescript
// Priority order for marriage record validation:
1. Both partners are church members → Link both
2. One partner is member → Link member, manual entry for other
3. Neither are members → Manual entry for both (rare case)
4. Validate all required fields regardless of member status
```

### 3. **User Experience Flow**

```
1. Select primary member (groom or bride)
2. Auto-populate their field based on gender
3. Search/select or manually enter other partner
4. Validate witness information
5. Complete officiant and ceremony details
6. Generate certificate with proper member references
```

## 🔧 Backend Improvements

### Priority 1: Enhanced Schema Design

#### Recommended Schema Enhancement

```prisma
model SacramentalRecord {
  id                    String        @id @default(cuid())

  // Core sacrament info
  sacramentType         SacramentType
  dateOfSacrament       DateTime
  locationOfSacrament   String

  // Primary member (required - one of the spouses)
  memberId              String
  member                Member        @relation("PrimarySacramentMember", fields: [memberId], references: [id])

  // Marriage-specific member relationships
  groomMemberId         String?       // NEW: Optional groom member reference
  groomMember           Member?       @relation("GroomSacraments", fields: [groomMemberId], references: [id])
  groomName             String        // Fallback/display name

  brideMemberId         String?       // NEW: Optional bride member reference
  brideMember           Member?       @relation("BrideSacraments", fields: [brideMemberId], references: [id])
  brideName             String        // Fallback/display name

  // Officiant information
  officiantId           String?       // Optional officiant member reference
  officiant             Member?       @relation("OfficiantSacraments", fields: [officiantId], references: [id])
  officiantName         String

  // Witness information
  witness1MemberId      String?       // NEW: Optional witness member reference
  witness1Member        Member?       @relation("Witness1Sacraments", fields: [witness1MemberId], references: [id])
  witness1Name          String?

  witness2MemberId      String?       // NEW: Optional witness member reference
  witness2Member        Member?       @relation("Witness2Sacraments", fields: [witness2MemberId], references: [id])
  witness2Name          String?

  // Certificate & metadata
  certificateNumber     String?
  certificateUrl        String?
  notes                 String?

  // System fields
  branchId              String
  branch                Branch        @relation(fields: [branchId], references: [id])
  organisationId        String?
  organisation          Organisation? @relation(fields: [organisationId], references: [id])

  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  @@index([groomMemberId])
  @@index([brideMemberId])
  @@index([dateOfSacrament])
  @@index([sacramentType, branchId])
}

// Update Member model to include marriage relationships
model Member {
  // ... existing fields ...

  // Sacrament relationships
  primarySacraments     SacramentalRecord[] @relation("PrimarySacramentMember")
  groomSacraments       SacramentalRecord[] @relation("GroomSacraments")
  brideSacraments       SacramentalRecord[] @relation("BrideSacraments")
  officiantSacraments   SacramentalRecord[] @relation("OfficiantSacraments")
  witness1Sacraments    SacramentalRecord[] @relation("Witness1Sacraments")
  witness2Sacraments    SacramentalRecord[] @relation("Witness2Sacraments")
}
```

### Priority 2: Enhanced GraphQL Schema

#### Input Types

```graphql
input CreateMarriageRecordInput {
  # Core fields
  dateOfSacrament: DateTime!
  locationOfSacrament: String!

  # Member relationships
  memberId: ID! # Primary member (required)
  groomMemberId: ID # Optional groom member reference
  groomName: String! # Required display name
  brideMemberId: ID # Optional bride member reference
  brideName: String! # Required display name
  # Officiant
  officiantId: ID # Optional officiant member reference
  officiantName: String!

  # Witnesses
  witness1MemberId: ID # Optional witness member reference
  witness1Name: String
  witness2MemberId: ID # Optional witness member reference
  witness2Name: String

  # Certificate & metadata
  certificateNumber: String
  notes: String

  # System
  branchId: ID!
  organisationId: ID
}
```

#### Query Types

```graphql
type MarriageRecord {
  id: ID!
  dateOfSacrament: DateTime!
  locationOfSacrament: String!

  # Member relationships with full data
  member: Member! # Primary member
  groomMember: Member # Groom if member
  groomName: String! # Display name
  brideMember: Member # Bride if member
  brideName: String! # Display name
  # Officiant with full data
  officiant: Member # Officiant if member
  officiantName: String!

  # Witnesses with full data
  witness1Member: Member # Witness 1 if member
  witness1Name: String
  witness2Member: Member # Witness 2 if member
  witness2Name: String

  # Certificate & metadata
  certificateNumber: String
  certificateUrl: String
  notes: String

  # System fields
  branch: Branch!
  organisation: Organisation
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Enhanced queries for marriage analytics
type Query {
  marriageRecords(
    branchId: ID!
    dateRange: DateRangeInput
    memberIds: [ID!]
    pagination: PaginationInput
  ): PaginatedMarriageRecords!

  marriageAnalytics(
    branchId: ID!
    dateRange: DateRangeInput
  ): MarriageAnalytics!

  memberMarriageHistory(memberId: ID!): [MarriageRecord!]!
}

type MarriageAnalytics {
  totalMarriages: Int!
  memberMarriages: Int! # Both spouses are members
  mixedMarriages: Int! # One spouse is member
  externalMarriages: Int! # Neither spouse is member
  monthlyTrends: [MonthlyMarriageData!]!
  topOfficiants: [OfficiantStats!]!
}
```

### Priority 3: Backend Service Enhancements

#### Marriage Service Methods

```typescript
class MarriageService {
  // Enhanced creation with member relationship logic
  async createMarriageRecord(
    input: CreateMarriageRecordInput,
  ): Promise<MarriageRecord> {
    // 1. Validate member relationships
    // 2. Auto-detect groom/bride member IDs if not provided
    // 3. Validate business rules (no duplicate marriages, etc.)
    // 4. Create record with proper relationships
    // 5. Generate certificate
    // 6. Send notifications
  }

  // Member relationship queries
  async getMarriagesByMember(memberId: string): Promise<MarriageRecord[]>;
  async getMemberSpouse(memberId: string): Promise<Member | null>;
  async getMarriageAnalytics(
    branchId: string,
    dateRange: DateRange,
  ): Promise<MarriageAnalytics>;

  // Certificate management
  async generateMarriageCertificate(marriageId: string): Promise<string>;
  async updateCertificateUrl(marriageId: string, url: string): Promise<void>;
}
```

## 🎨 Frontend Enhancements

### Priority 1: Enhanced Marriage Form Component

#### Recommended Component Structure

```typescript
// MarriageRecordForm.tsx - Specialized marriage form
interface MarriageFormData {
  // Member relationships
  primaryMember: Member | null;
  groomMember: Member | null;
  groomName: string;
  brideMember: Member | null;
  brideName: string;

  // Ceremony details
  dateOfSacrament: string;
  locationOfSacrament: string;

  // Officiant
  officiantMember: Member | null;
  officiantName: string;

  // Witnesses
  witness1Member: Member | null;
  witness1Name: string;
  witness2Member: Member | null;
  witness2Name: string;

  // Certificate & notes
  certificateNumber: string;
  notes: string;
}

// Smart validation logic
const validateMarriageForm = (data: MarriageFormData): ValidationResult => {
  // 1. Ensure both groom and bride information is provided
  // 2. Validate date is not in future (unless pre-marriage counseling)
  // 3. Check for duplicate marriage records
  // 4. Validate officiant authorization
  // 5. Ensure witness requirements are met
};
```

### Priority 2: Marriage Analytics Dashboard

#### Marriage Statistics Component

```typescript
// MarriageAnalytics.tsx
interface MarriageStats {
  totalMarriages: number;
  memberMarriages: number; // Both spouses are members
  mixedMarriages: number; // One spouse is member
  externalMarriages: number; // Neither spouse is member
  averageAge: number;
  monthlyTrends: MonthlyData[];
  topOfficiants: OfficiantData[];
}

// Marriage relationship visualization
const MarriageNetworkView = () => {
  // Visual representation of member marriage relationships
  // Useful for genealogy and family tree features
};
```

### Priority 3: Certificate Management

#### Digital Certificate System

```typescript
// MarriageCertificate.tsx
interface CertificateData {
  marriageRecord: MarriageRecord;
  template: CertificateTemplate;
  signatures: DigitalSignature[];
  qrCode: string; // For verification
  watermark: string; // For authenticity
}

// Certificate generation and management
const CertificateManager = {
  generateCertificate: (marriageId: string) => Promise<string>,
  downloadCertificate: (marriageId: string, format: "PDF" | "PNG") =>
    Promise<Blob>,
  verifyCertificate: (qrCode: string) => Promise<VerificationResult>,
  emailCertificate: (marriageId: string, recipients: string[]) => Promise<void>,
};
```

## 📊 Data Model Recommendations

### 1. **Member Relationship Tracking**

```typescript
// Enhanced member relationships for marriage context
interface MemberMarriageProfile {
  memberId: string;
  currentSpouse?: Member;
  marriageHistory: MarriageRecord[];
  marriageStatus: "SINGLE" | "MARRIED" | "WIDOWED" | "DIVORCED";
  marriageDate?: Date;
  anniversaryDate?: Date;
}
```

### 2. **Marriage Business Rules**

```typescript
// Business logic validation
const MarriageBusinessRules = {
  // Prevent duplicate active marriages
  validateUniqueMarriage: (groomId: string, brideId: string) => boolean,

  // Age validation (configurable by organization)
  validateMarriageAge: (member: Member, marriageDate: Date) => boolean,

  // Officiant authorization validation
  validateOfficiantAuthorization: (officiantId: string, branchId: string) =>
    boolean,

  // Pre-marriage requirements (counseling, etc.)
  validatePreMarriageRequirements: (groomId: string, brideId: string) =>
    boolean,
};
```

### 3. **Certificate Template System**

```typescript
// Configurable certificate templates
interface CertificateTemplate {
  id: string;
  name: string;
  organizationId: string;
  template: string; // HTML template
  fields: TemplateField[]; // Dynamic field mapping
  signatures: SignatureField[]; // Required signatures
  watermark?: string;
  isDefault: boolean;
}
```

## 🚀 Implementation Roadmap

### Phase 1: Backend Schema Enhancement (2-3 weeks)

1. **Week 1**: Update Prisma schema with member relationships
2. **Week 2**: Implement enhanced GraphQL schema and resolvers
3. **Week 3**: Create migration scripts and data validation

### Phase 2: Frontend Integration (2-3 weeks)

1. **Week 1**: Update marriage form with enhanced member linking
2. **Week 2**: Implement marriage analytics dashboard
3. **Week 3**: Add certificate management system

### Phase 3: Advanced Features (3-4 weeks)

1. **Week 1-2**: Marriage relationship analytics and reporting
2. **Week 3**: Digital certificate system with QR verification
3. **Week 4**: Member marriage history and anniversary tracking

### Phase 4: Business Logic & Validation (1-2 weeks)

1. **Week 1**: Implement marriage business rules and validation
2. **Week 2**: Add pre-marriage requirement tracking

## ⚡ Technical Considerations

### Performance Optimization

```typescript
// Efficient queries for marriage data
const optimizedMarriageQueries = {
  // Use proper indexing
  marriagesByDateRange: `SELECT * FROM SacramentalRecord 
                        WHERE sacramentType = 'MATRIMONY' 
                        AND dateOfSacrament BETWEEN ? AND ?
                        INDEX(dateOfSacrament_sacramentType)`,

  // Batch member relationship loading
  memberMarriageData: `SELECT sr.*, gm.*, bm.* 
                      FROM SacramentalRecord sr
                      LEFT JOIN Member gm ON sr.groomMemberId = gm.id
                      LEFT JOIN Member bm ON sr.brideMemberId = bm.id
                      WHERE sr.id IN (?)`,
};
```

### Data Migration Strategy

```sql
-- Migration script for existing marriage records
-- Step 1: Add new columns
ALTER TABLE SacramentalRecord
ADD COLUMN groomMemberId VARCHAR(255),
ADD COLUMN brideMemberId VARCHAR(255);

-- Step 2: Attempt to match existing names to members
UPDATE SacramentalRecord sr
SET groomMemberId = (
  SELECT m.id FROM Member m
  WHERE CONCAT(m.firstName, ' ', m.lastName) = sr.groomName
  LIMIT 1
)
WHERE sr.sacramentType = 'MATRIMONY' AND sr.groomName IS NOT NULL;

-- Step 3: Add indexes for performance
CREATE INDEX idx_sacramental_groom_member ON SacramentalRecord(groomMemberId);
CREATE INDEX idx_sacramental_bride_member ON SacramentalRecord(brideMemberId);
```

### Security Considerations

```typescript
// Marriage record access control
const MarriageSecurityRules = {
  // Only authorized personnel can create marriage records
  canCreateMarriage: (user: User) =>
    user.hasRole(["PASTOR", "MARRIAGE_OFFICIANT", "ADMIN"]),

  // Members can view their own marriage records
  canViewMarriage: (user: User, marriageRecord: MarriageRecord) =>
    user.hasRole(["ADMIN"]) ||
    marriageRecord.groomMemberId === user.memberId ||
    marriageRecord.brideMemberId === user.memberId,

  // Certificate access control
  canAccessCertificate: (user: User, marriageRecord: MarriageRecord) =>
    MarriageSecurityRules.canViewMarriage(user, marriageRecord),
};
```

## 📈 Success Metrics

### Key Performance Indicators

- **Data Quality**: % of marriage records with member relationships linked
- **User Experience**: Time to create marriage record (target: <3 minutes)
- **Certificate Generation**: Automated certificate generation rate (target: 100%)
- **Data Accuracy**: Reduction in duplicate/incorrect marriage records
- **Member Satisfaction**: User feedback on marriage record management

### Analytics & Reporting

- Marriage trends and statistics
- Member relationship mapping
- Anniversary tracking and notifications
- Certificate verification and authenticity
- Officiant performance metrics

---

## 🎯 Conclusion

This comprehensive approach to marriage sacrament management provides:

1. **Enhanced Data Relationships**: Proper linking between spouses, officiants, and witnesses
2. **Flexible Data Entry**: Accommodates both member and non-member marriages
3. **Robust Validation**: Business rules ensure data integrity
4. **Professional Certificates**: Digital certificate system with verification
5. **Advanced Analytics**: Marriage trends and relationship insights
6. **Future-Proof Architecture**: Extensible design for additional features

The implementation prioritizes backward compatibility while providing a clear path for enhanced functionality and better member relationship management.
