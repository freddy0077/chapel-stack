// Sacrament Type Constants and Enums
export const SACRAMENT_TYPES = {
  BAPTISM: "BAPTISM",
  COMMUNION: "EUCHARIST_FIRST_COMMUNION",
  CONFIRMATION: "CONFIRMATION",
  MARRIAGE: "MATRIMONY",
  RECONCILIATION: "RECONCILIATION_FIRST",
  ANOINTING: "ANOINTING_OF_THE_SICK",
  DIACONATE: "HOLY_ORDERS_DIACONATE",
  PRIESTHOOD: "HOLY_ORDERS_PRIESTHOOD",
  RCIA: "RCIA_INITIATION",
} as const;

export type SacramentType =
  (typeof SACRAMENT_TYPES)[keyof typeof SACRAMENT_TYPES];

// Display name mappings for UI
export const SACRAMENT_DISPLAY_NAMES: Record<SacramentType, string> = {
  [SACRAMENT_TYPES.BAPTISM]: "Baptism",
  [SACRAMENT_TYPES.COMMUNION]: "First Communion",
  [SACRAMENT_TYPES.CONFIRMATION]: "Confirmation",
  [SACRAMENT_TYPES.MARRIAGE]: "Marriage",
  [SACRAMENT_TYPES.RECONCILIATION]: "First Reconciliation",
  [SACRAMENT_TYPES.ANOINTING]: "Anointing of the Sick",
  [SACRAMENT_TYPES.DIACONATE]: "Diaconate Ordination",
  [SACRAMENT_TYPES.PRIESTHOOD]: "Priesthood Ordination",
  [SACRAMENT_TYPES.RCIA]: "RCIA Initiation",
};

// Color schemes for each sacrament type
export const SACRAMENT_COLORS: Record<SacramentType, string> = {
  [SACRAMENT_TYPES.BAPTISM]: "blue",
  [SACRAMENT_TYPES.COMMUNION]: "amber",
  [SACRAMENT_TYPES.CONFIRMATION]: "purple",
  [SACRAMENT_TYPES.MARRIAGE]: "rose",
  [SACRAMENT_TYPES.RECONCILIATION]: "green",
  [SACRAMENT_TYPES.ANOINTING]: "indigo",
  [SACRAMENT_TYPES.DIACONATE]: "violet",
  [SACRAMENT_TYPES.PRIESTHOOD]: "violet",
  [SACRAMENT_TYPES.RCIA]: "teal",
};

// Gradient color schemes for enhanced UI
export const SACRAMENT_GRADIENTS: Record<SacramentType, string> = {
  [SACRAMENT_TYPES.BAPTISM]: "from-blue-50 to-indigo-50",
  [SACRAMENT_TYPES.COMMUNION]: "from-amber-50 to-yellow-50",
  [SACRAMENT_TYPES.CONFIRMATION]: "from-purple-50 to-violet-50",
  [SACRAMENT_TYPES.MARRIAGE]: "from-rose-50 to-pink-50",
  [SACRAMENT_TYPES.RECONCILIATION]: "from-green-50 to-emerald-50",
  [SACRAMENT_TYPES.ANOINTING]: "from-indigo-50 to-blue-50",
  [SACRAMENT_TYPES.DIACONATE]: "from-violet-50 to-purple-50",
  [SACRAMENT_TYPES.PRIESTHOOD]: "from-violet-50 to-purple-50",
  [SACRAMENT_TYPES.RCIA]: "from-teal-50 to-cyan-50",
};

// Icon mappings (using Heroicons)
export const SACRAMENT_ICONS = {
  [SACRAMENT_TYPES.BAPTISM]: "SparklesIcon",
  [SACRAMENT_TYPES.COMMUNION]: "GiftIcon",
  [SACRAMENT_TYPES.CONFIRMATION]: "HeartIcon",
  [SACRAMENT_TYPES.MARRIAGE]: "UserGroupIcon",
  [SACRAMENT_TYPES.RECONCILIATION]: "HandRaisedIcon",
  [SACRAMENT_TYPES.ANOINTING]: "HandIcon",
  [SACRAMENT_TYPES.DIACONATE]: "AcademicCapIcon",
  [SACRAMENT_TYPES.PRIESTHOOD]: "AcademicCapIcon",
  [SACRAMENT_TYPES.RCIA]: "BookOpenIcon",
} as const;

// Required fields for each sacrament type
export const SACRAMENT_REQUIRED_FIELDS: Record<SacramentType, string[]> = {
  [SACRAMENT_TYPES.BAPTISM]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
  ],
  [SACRAMENT_TYPES.COMMUNION]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
  ],
  [SACRAMENT_TYPES.CONFIRMATION]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
  ],
  [SACRAMENT_TYPES.MARRIAGE]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
    "groomName",
    "brideName",
  ],
  [SACRAMENT_TYPES.RECONCILIATION]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
  ],
  [SACRAMENT_TYPES.ANOINTING]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
  ],
  [SACRAMENT_TYPES.DIACONATE]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
    "sponsorName",
  ],
  [SACRAMENT_TYPES.PRIESTHOOD]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
    "sponsorName",
  ],
  [SACRAMENT_TYPES.RCIA]: [
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
  ],
};

// Field configurations for form rendering
export const SACRAMENT_FIELD_CONFIGS: Record<
  SacramentType,
  {
    showGodparents: boolean;
    showSponsor: boolean;
    showMarriageFields: boolean;
    showWitnesses: boolean;
    showOrdinationFields: boolean;
  }
> = {
  [SACRAMENT_TYPES.BAPTISM]: {
    showGodparents: true,
    showSponsor: false,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: false,
  },
  [SACRAMENT_TYPES.COMMUNION]: {
    showGodparents: false,
    showSponsor: true,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: false,
  },
  [SACRAMENT_TYPES.CONFIRMATION]: {
    showGodparents: false,
    showSponsor: true,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: false,
  },
  [SACRAMENT_TYPES.MARRIAGE]: {
    showGodparents: false,
    showSponsor: false,
    showMarriageFields: true,
    showWitnesses: true,
    showOrdinationFields: false,
  },
  [SACRAMENT_TYPES.RECONCILIATION]: {
    showGodparents: false,
    showSponsor: false,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: false,
  },
  [SACRAMENT_TYPES.ANOINTING]: {
    showGodparents: false,
    showSponsor: false,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: false,
  },
  [SACRAMENT_TYPES.DIACONATE]: {
    showGodparents: false,
    showSponsor: true,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: true,
  },
  [SACRAMENT_TYPES.PRIESTHOOD]: {
    showGodparents: false,
    showSponsor: true,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: true,
  },
  [SACRAMENT_TYPES.RCIA]: {
    showGodparents: false,
    showSponsor: false,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: false,
  },
};

// Sacrament descriptions for UI
export const SACRAMENT_DESCRIPTIONS: Record<SacramentType, string> = {
  [SACRAMENT_TYPES.BAPTISM]: "Sacred water baptisms and initiations",
  [SACRAMENT_TYPES.COMMUNION]: "First reception of the Eucharist",
  [SACRAMENT_TYPES.CONFIRMATION]:
    "Strengthening of faith through the Holy Spirit",
  [SACRAMENT_TYPES.MARRIAGE]: "Sacred union ceremonies and celebrations",
  [SACRAMENT_TYPES.RECONCILIATION]: "First confession and reconciliation",
  [SACRAMENT_TYPES.ANOINTING]: "Healing and comfort for the sick",
  [SACRAMENT_TYPES.DIACONATE]: "Ordination to the diaconate",
  [SACRAMENT_TYPES.PRIESTHOOD]: "Ordination to the priesthood",
  [SACRAMENT_TYPES.RCIA]: "Rite of Christian Initiation for Adults",
};

// Tab configurations for the sacraments page
export const SACRAMENT_TABS = [
  {
    id: SACRAMENT_TYPES.BAPTISM,
    name: "Baptism",
    icon: "SparklesIcon",
    color: SACRAMENT_COLORS[SACRAMENT_TYPES.BAPTISM],
  },
  {
    id: SACRAMENT_TYPES.COMMUNION,
    name: "Communion",
    icon: "GiftIcon",
    color: SACRAMENT_COLORS[SACRAMENT_TYPES.COMMUNION],
  },
  {
    id: SACRAMENT_TYPES.CONFIRMATION,
    name: "Confirmation",
    icon: "HeartIcon",
    color: SACRAMENT_COLORS[SACRAMENT_TYPES.CONFIRMATION],
  },
  {
    id: SACRAMENT_TYPES.MARRIAGE,
    name: "Marriage",
    icon: "UserGroupIcon",
    color: SACRAMENT_COLORS[SACRAMENT_TYPES.MARRIAGE],
  },
  {
    id: "anniversaries",
    name: "Anniversaries",
    icon: "CalendarIcon",
    color: "green",
  },
] as const;
