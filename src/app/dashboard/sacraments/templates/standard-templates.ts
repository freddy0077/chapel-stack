// Standard Certificate Templates for All Church Types
// This file defines comprehensive certificate templates for various Christian denominations

export interface StandardCertificateTemplate {
  id: string;
  name: string;
  denomination: ChurchDenomination;
  sacramentType: SacramentType;
  description: string;
  previewUrl: string;
  templateUrl: string;
  isDefault: boolean;
  liturgicalElements: LiturgicalElement[];
  customFields: TemplateField[];
  styling: TemplateStyle;
  language: string;
  region?: string;
}

export type ChurchDenomination = 
  | 'CATHOLIC'
  | 'ORTHODOX'
  | 'ANGLICAN'
  | 'LUTHERAN'
  | 'METHODIST'
  | 'BAPTIST'
  | 'PRESBYTERIAN'
  | 'PENTECOSTAL'
  | 'EVANGELICAL'
  | 'REFORMED'
  | 'EPISCOPAL'
  | 'ADVENTIST'
  | 'CONGREGATIONAL'
  | 'MENNONITE'
  | 'QUAKER'
  | 'NONDENOMINATIONAL'
  | 'INTERDENOMINATIONAL';

export type SacramentType = 
  | 'BAPTISM'
  | 'INFANT_BAPTISM'
  | 'ADULT_BAPTISM'
  | 'IMMERSION_BAPTISM'
  | 'EUCHARIST_FIRST_COMMUNION'
  | 'CONFIRMATION'
  | 'MATRIMONY'
  | 'ORDINATION'
  | 'RECONCILIATION'
  | 'ANOINTING_OF_THE_SICK'
  | 'DEDICATION'
  | 'MEMBERSHIP'
  | 'BLESSING';

export interface LiturgicalElement {
  type: 'SCRIPTURE' | 'PRAYER' | 'BLESSING' | 'CREED' | 'HYMN';
  content: string;
  position: 'HEADER' | 'BODY' | 'FOOTER';
  optional: boolean;
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'TEXT' | 'DATE' | 'SIGNATURE' | 'SEAL' | 'IMAGE';
  required: boolean;
  defaultValue?: string;
  position: { x: number; y: number };
  styling: FieldStyle;
}

export interface TemplateStyle {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  headerFont: string;
  bodyFont: string;
  borderStyle: 'CLASSIC' | 'MODERN' | 'ORNATE' | 'SIMPLE';
  backgroundPattern?: string;
  logoPosition: 'TOP_CENTER' | 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_CENTER';
}

export interface FieldStyle {
  fontSize: number;
  fontWeight: 'NORMAL' | 'BOLD' | 'LIGHT';
  color: string;
  alignment: 'LEFT' | 'CENTER' | 'RIGHT';
}

// Standard Templates Library
export const STANDARD_TEMPLATES: StandardCertificateTemplate[] = [
  
  // ==================== CATHOLIC TEMPLATES ====================
  {
    id: 'catholic-baptism-traditional',
    name: 'Traditional Catholic Baptism',
    denomination: 'CATHOLIC',
    sacramentType: 'BAPTISM',
    description: 'Traditional Catholic baptism certificate with Latin elements and papal seal',
    previewUrl: '/templates/catholic/baptism-traditional-preview.jpg',
    templateUrl: '/templates/catholic/baptism-traditional.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit. - Matthew 28:19',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'PRAYER',
        content: 'Almighty and eternal God, you have regenerated this your servant by water and the Holy Spirit...',
        position: 'FOOTER',
        optional: true
      }
    ],
    customFields: [
      { id: 'godparents', label: 'Godparents', type: 'TEXT', required: true, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'parish', label: 'Parish', type: 'TEXT', required: true, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'diocese', label: 'Diocese', type: 'TEXT', required: false, position: { x: 50, y: 75 }, styling: { fontSize: 10, fontWeight: 'NORMAL', color: '#666666', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#8B0000',
      secondaryColor: '#DAA520',
      accentColor: '#FFFFFF',
      fontFamily: 'Times New Roman',
      headerFont: 'Trajan Pro',
      bodyFont: 'Times New Roman',
      borderStyle: 'ORNATE',
      backgroundPattern: 'cross-pattern',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en',
    region: 'universal'
  },

  {
    id: 'catholic-communion-classic',
    name: 'Classic First Holy Communion',
    denomination: 'CATHOLIC',
    sacramentType: 'EUCHARIST_FIRST_COMMUNION',
    description: 'Classic Catholic First Communion certificate with Eucharistic symbols',
    previewUrl: '/templates/catholic/communion-classic-preview.jpg',
    templateUrl: '/templates/catholic/communion-classic.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'Take and eat, this is my body which is given for you. - Luke 22:19',
        position: 'HEADER',
        optional: false
      }
    ],
    customFields: [
      { id: 'sponsor', label: 'Sponsor', type: 'TEXT', required: false, position: { x: 50, y: 65 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'preparation_program', label: 'Preparation Program', type: 'TEXT', required: false, position: { x: 50, y: 75 }, styling: { fontSize: 10, fontWeight: 'NORMAL', color: '#666666', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#8B0000',
      secondaryColor: '#DAA520',
      accentColor: '#FFFFFF',
      fontFamily: 'Times New Roman',
      headerFont: 'Trajan Pro',
      bodyFont: 'Times New Roman',
      borderStyle: 'CLASSIC',
      backgroundPattern: 'chalice-pattern',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== ORTHODOX TEMPLATES ====================
  {
    id: 'orthodox-baptism-byzantine',
    name: 'Byzantine Orthodox Baptism',
    denomination: 'ORTHODOX',
    sacramentType: 'BAPTISM',
    description: 'Traditional Orthodox baptism certificate with Byzantine iconography',
    previewUrl: '/templates/orthodox/baptism-byzantine-preview.jpg',
    templateUrl: '/templates/orthodox/baptism-byzantine.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'PRAYER',
        content: 'Blessed is the Kingdom of the Father, and of the Son, and of the Holy Spirit...',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'BLESSING',
        content: 'May the Lord bless and keep you in His grace...',
        position: 'FOOTER',
        optional: false
      }
    ],
    customFields: [
      { id: 'godparents', label: 'Godparents', type: 'TEXT', required: true, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'patron_saint', label: 'Patron Saint', type: 'TEXT', required: true, position: { x: 50, y: 65 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'chrismation_date', label: 'Chrismation Date', type: 'DATE', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#000080',
      secondaryColor: '#DAA520',
      accentColor: '#FFFFFF',
      fontFamily: 'Times New Roman',
      headerFont: 'Uncial',
      bodyFont: 'Times New Roman',
      borderStyle: 'ORNATE',
      backgroundPattern: 'byzantine-cross',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== ANGLICAN/EPISCOPAL TEMPLATES ====================
  {
    id: 'anglican-baptism-traditional',
    name: 'Traditional Anglican Baptism',
    denomination: 'ANGLICAN',
    sacramentType: 'BAPTISM',
    description: 'Traditional Anglican baptism certificate following Book of Common Prayer',
    previewUrl: '/templates/anglican/baptism-traditional-preview.jpg',
    templateUrl: '/templates/anglican/baptism-traditional.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'Suffer the little children to come unto me, and forbid them not: for of such is the kingdom of God. - Mark 10:14',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'PRAYER',
        content: 'We receive this child into the congregation of Christ\'s flock...',
        position: 'BODY',
        optional: false
      }
    ],
    customFields: [
      { id: 'godparents', label: 'Godparents', type: 'TEXT', required: true, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'diocese', label: 'Diocese', type: 'TEXT', required: true, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'bishop', label: 'Bishop', type: 'TEXT', required: false, position: { x: 50, y: 75 }, styling: { fontSize: 10, fontWeight: 'NORMAL', color: '#666666', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#800080',
      secondaryColor: '#DAA520',
      accentColor: '#FFFFFF',
      fontFamily: 'Times New Roman',
      headerFont: 'Trajan Pro',
      bodyFont: 'Times New Roman',
      borderStyle: 'CLASSIC',
      backgroundPattern: 'anglican-cross',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== LUTHERAN TEMPLATES ====================
  {
    id: 'lutheran-baptism-reformation',
    name: 'Lutheran Reformation Style',
    denomination: 'LUTHERAN',
    sacramentType: 'BAPTISM',
    description: 'Lutheran baptism certificate with Reformation heritage design',
    previewUrl: '/templates/lutheran/baptism-reformation-preview.jpg',
    templateUrl: '/templates/lutheran/baptism-reformation.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'For by grace you have been saved through faith. - Ephesians 2:8',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'CREED',
        content: 'We believe in one God, the Father Almighty...',
        position: 'FOOTER',
        optional: true
      }
    ],
    customFields: [
      { id: 'sponsors', label: 'Sponsors', type: 'TEXT', required: false, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'synod', label: 'Synod', type: 'TEXT', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#8B4513',
      secondaryColor: '#DAA520',
      accentColor: '#FFFFFF',
      fontFamily: 'Times New Roman',
      headerFont: 'Fraktur',
      bodyFont: 'Times New Roman',
      borderStyle: 'CLASSIC',
      backgroundPattern: 'luther-rose',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== BAPTIST TEMPLATES ====================
  {
    id: 'baptist-baptism-immersion',
    name: 'Baptist Immersion Baptism',
    denomination: 'BAPTIST',
    sacramentType: 'IMMERSION_BAPTISM',
    description: 'Baptist immersion baptism certificate emphasizing believer\'s baptism',
    previewUrl: '/templates/baptist/baptism-immersion-preview.jpg',
    templateUrl: '/templates/baptist/baptism-immersion.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'Therefore we were buried with him through baptism into death. - Romans 6:4',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'PRAYER',
        content: 'Lord Jesus, we celebrate this public declaration of faith...',
        position: 'BODY',
        optional: false
      }
    ],
    customFields: [
      { id: 'testimony_date', label: 'Testimony Date', type: 'DATE', required: false, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'association', label: 'Baptist Association', type: 'TEXT', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#000080',
      secondaryColor: '#4169E1',
      accentColor: '#FFFFFF',
      fontFamily: 'Arial',
      headerFont: 'Arial Bold',
      bodyFont: 'Arial',
      borderStyle: 'SIMPLE',
      backgroundPattern: 'water-waves',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== METHODIST TEMPLATES ====================
  {
    id: 'methodist-baptism-wesleyan',
    name: 'Wesleyan Methodist Baptism',
    denomination: 'METHODIST',
    sacramentType: 'BAPTISM',
    description: 'Methodist baptism certificate with Wesleyan tradition elements',
    previewUrl: '/templates/methodist/baptism-wesleyan-preview.jpg',
    templateUrl: '/templates/methodist/baptism-wesleyan.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'Jesus said, Let the little children come to me. - Matthew 19:14',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'PRAYER',
        content: 'Almighty God, by our baptism into the death and resurrection of your Son Jesus Christ...',
        position: 'FOOTER',
        optional: false
      }
    ],
    customFields: [
      { id: 'sponsors', label: 'Sponsors', type: 'TEXT', required: false, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'conference', label: 'Annual Conference', type: 'TEXT', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#8B0000',
      secondaryColor: '#DAA520',
      accentColor: '#FFFFFF',
      fontFamily: 'Times New Roman',
      headerFont: 'Times New Roman Bold',
      bodyFont: 'Times New Roman',
      borderStyle: 'CLASSIC',
      backgroundPattern: 'methodist-flame',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== PRESBYTERIAN TEMPLATES ====================
  {
    id: 'presbyterian-baptism-reformed',
    name: 'Reformed Presbyterian Baptism',
    denomination: 'PRESBYTERIAN',
    sacramentType: 'BAPTISM',
    description: 'Presbyterian baptism certificate with Reformed theology emphasis',
    previewUrl: '/templates/presbyterian/baptism-reformed-preview.jpg',
    templateUrl: '/templates/presbyterian/baptism-reformed.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'For you are all children of God through faith in Christ Jesus. - Galatians 3:26',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'CREED',
        content: 'We believe in one God, eternally existing in three persons...',
        position: 'FOOTER',
        optional: true
      }
    ],
    customFields: [
      { id: 'session_approval', label: 'Session Approval Date', type: 'DATE', required: false, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'presbytery', label: 'Presbytery', type: 'TEXT', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#000080',
      secondaryColor: '#DAA520',
      accentColor: '#FFFFFF',
      fontFamily: 'Times New Roman',
      headerFont: 'Times New Roman Bold',
      bodyFont: 'Times New Roman',
      borderStyle: 'CLASSIC',
      backgroundPattern: 'calvin-seal',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== PENTECOSTAL TEMPLATES ====================
  {
    id: 'pentecostal-baptism-spirit',
    name: 'Pentecostal Spirit-Filled Baptism',
    denomination: 'PENTECOSTAL',
    sacramentType: 'ADULT_BAPTISM',
    description: 'Pentecostal baptism certificate with Holy Spirit emphasis',
    previewUrl: '/templates/pentecostal/baptism-spirit-preview.jpg',
    templateUrl: '/templates/pentecostal/baptism-spirit.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'And you will receive the gift of the Holy Spirit. - Acts 2:38',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'PRAYER',
        content: 'Holy Spirit, fill this believer with your power and presence...',
        position: 'BODY',
        optional: false
      }
    ],
    customFields: [
      { id: 'spirit_baptism_date', label: 'Spirit Baptism Date', type: 'DATE', required: false, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'fellowship', label: 'Fellowship', type: 'TEXT', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#FF4500',
      secondaryColor: '#FFD700',
      accentColor: '#FFFFFF',
      fontFamily: 'Arial',
      headerFont: 'Arial Bold',
      bodyFont: 'Arial',
      borderStyle: 'MODERN',
      backgroundPattern: 'flame-pattern',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== NONDENOMINATIONAL TEMPLATES ====================
  {
    id: 'nondenominational-baptism-simple',
    name: 'Simple Christian Baptism',
    denomination: 'NONDENOMINATIONAL',
    sacramentType: 'BAPTISM',
    description: 'Clean, simple baptism certificate for nondenominational churches',
    previewUrl: '/templates/nondenominational/baptism-simple-preview.jpg',
    templateUrl: '/templates/nondenominational/baptism-simple.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'Therefore, if anyone is in Christ, the new creation has come. - 2 Corinthians 5:17',
        position: 'HEADER',
        optional: false
      }
    ],
    customFields: [
      { id: 'mentors', label: 'Mentors/Sponsors', type: 'TEXT', required: false, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'ministry_network', label: 'Ministry Network', type: 'TEXT', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#4169E1',
      secondaryColor: '#87CEEB',
      accentColor: '#FFFFFF',
      fontFamily: 'Arial',
      headerFont: 'Arial Bold',
      bodyFont: 'Arial',
      borderStyle: 'SIMPLE',
      backgroundPattern: 'simple-cross',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  // ==================== MARRIAGE TEMPLATES ====================
  {
    id: 'catholic-marriage-traditional',
    name: 'Traditional Catholic Marriage',
    denomination: 'CATHOLIC',
    sacramentType: 'MATRIMONY',
    description: 'Traditional Catholic marriage certificate with nuptial blessing',
    previewUrl: '/templates/catholic/marriage-traditional-preview.jpg',
    templateUrl: '/templates/catholic/marriage-traditional.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'What God has joined together, let no one separate. - Mark 10:9',
        position: 'HEADER',
        optional: false
      },
      {
        type: 'BLESSING',
        content: 'May the Lord bless you and keep you. May the Lord make his face shine upon you...',
        position: 'FOOTER',
        optional: false
      }
    ],
    customFields: [
      { id: 'witnesses', label: 'Witnesses', type: 'TEXT', required: true, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'nuptial_blessing', label: 'Nuptial Blessing', type: 'TEXT', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 10, fontWeight: 'NORMAL', color: '#666666', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#8B0000',
      secondaryColor: '#DAA520',
      accentColor: '#FFFFFF',
      fontFamily: 'Times New Roman',
      headerFont: 'Trajan Pro',
      bodyFont: 'Times New Roman',
      borderStyle: 'ORNATE',
      backgroundPattern: 'wedding-rings',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  },

  {
    id: 'protestant-marriage-modern',
    name: 'Modern Protestant Wedding',
    denomination: 'NONDENOMINATIONAL',
    sacramentType: 'MATRIMONY',
    description: 'Modern Protestant wedding certificate with contemporary design',
    previewUrl: '/templates/protestant/marriage-modern-preview.jpg',
    templateUrl: '/templates/protestant/marriage-modern.pdf',
    isDefault: true,
    liturgicalElements: [
      {
        type: 'SCRIPTURE',
        content: 'Love is patient, love is kind... - 1 Corinthians 13:4-7',
        position: 'HEADER',
        optional: false
      }
    ],
    customFields: [
      { id: 'witnesses', label: 'Witnesses', type: 'TEXT', required: true, position: { x: 50, y: 60 }, styling: { fontSize: 12, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' } },
      { id: 'vows_type', label: 'Vows Type', type: 'TEXT', required: false, position: { x: 50, y: 70 }, styling: { fontSize: 10, fontWeight: 'NORMAL', color: '#666666', alignment: 'CENTER' } }
    ],
    styling: {
      primaryColor: '#4169E1',
      secondaryColor: '#87CEEB',
      accentColor: '#FFFFFF',
      fontFamily: 'Arial',
      headerFont: 'Arial Bold',
      bodyFont: 'Arial',
      borderStyle: 'MODERN',
      backgroundPattern: 'love-hearts',
      logoPosition: 'TOP_CENTER'
    },
    language: 'en'
  }
];

// Helper functions for template management
export const getTemplatesByDenomination = (denomination: ChurchDenomination): StandardCertificateTemplate[] => {
  return STANDARD_TEMPLATES.filter(template => template.denomination === denomination);
};

export const getTemplatesBySacrament = (sacramentType: SacramentType): StandardCertificateTemplate[] => {
  return STANDARD_TEMPLATES.filter(template => template.sacramentType === sacramentType);
};

export const getDefaultTemplate = (denomination: ChurchDenomination, sacramentType: SacramentType): StandardCertificateTemplate | null => {
  return STANDARD_TEMPLATES.find(template => 
    template.denomination === denomination && 
    template.sacramentType === sacramentType && 
    template.isDefault
  ) || null;
};

export const getAllDenominations = (): ChurchDenomination[] => {
  return Array.from(new Set(STANDARD_TEMPLATES.map(template => template.denomination)));
};

export const getAllSacramentTypes = (): SacramentType[] => {
  return Array.from(new Set(STANDARD_TEMPLATES.map(template => template.sacramentType)));
};

// Template customization utilities
export const customizeTemplateForBranch = (
  template: StandardCertificateTemplate,
  branchInfo: {
    name: string;
    denomination: ChurchDenomination;
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
  }
): StandardCertificateTemplate => {
  return {
    ...template,
    id: `${template.id}-${branchInfo.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: `${template.name} - ${branchInfo.name}`,
    denomination: branchInfo.denomination,
    styling: {
      ...template.styling,
      primaryColor: branchInfo.primaryColor || template.styling.primaryColor,
      secondaryColor: branchInfo.secondaryColor || template.styling.secondaryColor,
    },
    customFields: [
      ...template.customFields,
      {
        id: 'branch_logo',
        label: 'Branch Logo',
        type: 'IMAGE',
        required: false,
        position: { x: 50, y: 10 },
        styling: { fontSize: 0, fontWeight: 'NORMAL', color: '#000000', alignment: 'CENTER' }
      }
    ]
  };
};
