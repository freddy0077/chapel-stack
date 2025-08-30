import {
  SACRAMENT_TYPES,
  SACRAMENT_DISPLAY_NAMES,
  SACRAMENT_COLORS,
  SACRAMENT_GRADIENTS,
  SACRAMENT_DESCRIPTIONS,
  SACRAMENT_REQUIRED_FIELDS,
  SACRAMENT_FIELD_CONFIGS,
  type SacramentType,
} from '@/constants/sacramentTypes';

/**
 * Get the display name for a sacrament type
 */
export function getSacramentDisplayName(sacramentType: SacramentType): string {
  return SACRAMENT_DISPLAY_NAMES[sacramentType] || sacramentType;
}

/**
 * Get the color scheme for a sacrament type
 */
export function getSacramentColor(sacramentType: SacramentType): string {
  return SACRAMENT_COLORS[sacramentType] || 'blue';
}

/**
 * Get the gradient color scheme for a sacrament type
 */
export function getSacramentGradient(sacramentType: SacramentType): string {
  return SACRAMENT_GRADIENTS[sacramentType] || 'from-blue-50 to-indigo-50';
}

/**
 * Get the description for a sacrament type
 */
export function getSacramentDescription(sacramentType: SacramentType): string {
  return SACRAMENT_DESCRIPTIONS[sacramentType] || '';
}

/**
 * Get the required fields for a sacrament type
 */
export function getSacramentRequiredFields(sacramentType: SacramentType): string[] {
  return SACRAMENT_REQUIRED_FIELDS[sacramentType] || [];
}

/**
 * Get the field configuration for a sacrament type
 */
export function getSacramentFieldConfig(sacramentType: SacramentType) {
  return SACRAMENT_FIELD_CONFIGS[sacramentType] || {
    showGodparents: false,
    showSponsor: false,
    showMarriageFields: false,
    showWitnesses: false,
    showOrdinationFields: false,
  };
}

/**
 * Format sacrament type string for display (converts enum to readable format)
 */
export function formatSacramentType(sacramentType: string): string {
  // Handle the mapping from backend enum to frontend display
  const typeMapping: Record<string, string> = {
    'BAPTISM': 'Baptism',
    'EUCHARIST_FIRST_COMMUNION': 'First Communion',
    'CONFIRMATION': 'Confirmation',
    'MATRIMONY': 'Marriage',
    'RECONCILIATION_FIRST': 'First Reconciliation',
    'ANOINTING_OF_THE_SICK': 'Anointing of the Sick',
    'HOLY_ORDERS_DIACONATE': 'Diaconate Ordination',
    'HOLY_ORDERS_PRIESTHOOD': 'Priesthood Ordination',
    'RCIA_INITIATION': 'RCIA Initiation',
  };

  return typeMapping[sacramentType] || sacramentType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get all sacrament types as an array
 */
export function getAllSacramentTypes(): SacramentType[] {
  return Object.values(SACRAMENT_TYPES);
}

/**
 * Check if a string is a valid sacrament type
 */
export function isValidSacramentType(type: string): type is SacramentType {
  return Object.values(SACRAMENT_TYPES).includes(type as SacramentType);
}

/**
 * Get sacrament type from frontend key (e.g., 'baptism' -> 'BAPTISM')
 */
export function getSacramentTypeFromKey(key: string): SacramentType | null {
  const keyMapping: Record<string, SacramentType> = {
    'baptism': SACRAMENT_TYPES.BAPTISM,
    'communion': SACRAMENT_TYPES.COMMUNION,
    'confirmation': SACRAMENT_TYPES.CONFIRMATION,
    'marriage': SACRAMENT_TYPES.MARRIAGE,
    'matrimony': SACRAMENT_TYPES.MARRIAGE,
    'reconciliation': SACRAMENT_TYPES.RECONCILIATION,
    'anointing': SACRAMENT_TYPES.ANOINTING,
    'diaconate': SACRAMENT_TYPES.DIACONATE,
    'priesthood': SACRAMENT_TYPES.PRIESTHOOD,
    'rcia': SACRAMENT_TYPES.RCIA,
  };

  return keyMapping[key.toLowerCase()] || null;
}

/**
 * Generate CSS classes for sacrament type styling
 */
export function getSacramentTypeClasses(sacramentType: SacramentType, variant: 'button' | 'badge' | 'card' = 'button'): string {
  const color = getSacramentColor(sacramentType);
  
  switch (variant) {
    case 'button':
      return `bg-${color}-600 hover:bg-${color}-700 text-white border-${color}-600 hover:border-${color}-700`;
    case 'badge':
      return `bg-${color}-100 text-${color}-800 border-${color}-200`;
    case 'card':
      return `bg-gradient-to-br ${getSacramentGradient(sacramentType)} border-${color}-200`;
    default:
      return `text-${color}-600`;
  }
}

/**
 * Validate sacrament record data based on type
 */
export function validateSacramentRecord(sacramentType: SacramentType, data: Record<string, any>): {
  isValid: boolean;
  missingFields: string[];
  errors: string[];
} {
  const requiredFields = getSacramentRequiredFields(sacramentType);
  const missingFields: string[] = [];
  const errors: string[] = [];

  // Check required fields
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field);
    }
  });

  // Special validation for marriage records
  if (sacramentType === SACRAMENT_TYPES.MARRIAGE) {
    if (!data.groomName && !data.groomMemberId) {
      errors.push('Groom information is required for marriage records');
    }
    if (!data.brideName && !data.brideMemberId) {
      errors.push('Bride information is required for marriage records');
    }
  }

  // Date validation
  if (data.dateOfSacrament) {
    const sacramentDate = new Date(data.dateOfSacrament);
    const today = new Date();
    if (sacramentDate > today) {
      errors.push('Sacrament date cannot be in the future');
    }
  }

  return {
    isValid: missingFields.length === 0 && errors.length === 0,
    missingFields,
    errors,
  };
}

/**
 * Generate a human-readable summary of a sacrament record
 */
export function generateSacramentSummary(record: any): string {
  const sacramentName = formatSacramentType(record.sacramentType);
  const date = new Date(record.dateOfSacrament).toLocaleDateString();
  const memberName = record.memberName || `Member ID: ${record.memberId}`;
  
  let summary = `${sacramentName} for ${memberName} on ${date}`;
  
  if (record.locationOfSacrament) {
    summary += ` at ${record.locationOfSacrament}`;
  }
  
  if (record.officiantName) {
    summary += `, officiated by ${record.officiantName}`;
  }

  // Add specific details for marriage records
  if (record.sacramentType === SACRAMENT_TYPES.MARRIAGE) {
    if (record.groomName && record.brideName) {
      summary = `Marriage between ${record.groomName} and ${record.brideName} on ${date}`;
    }
  }

  return summary;
}
