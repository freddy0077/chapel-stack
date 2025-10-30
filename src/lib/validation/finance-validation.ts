/**
 * Finance Module - Client-Side Validation
 * Matches backend validation rules
 */

// ===== CONSTANTS =====
export const VALIDATION_LIMITS = {
  // Amounts
  MAX_JOURNAL_AMOUNT: 999999999.99,
  MAX_OFFERING_AMOUNT: 10000000.00,
  MAX_BANK_BALANCE: 1000000000.00,
  MIN_BANK_BALANCE: -10000000.00,
  MAX_DISCREPANCY: 10000.00,
  
  // Dates
  MAX_YEARS_OLD_JOURNAL: 5,
  MAX_YEARS_OLD_OFFERING: 1,
  MAX_YEARS_OLD_RECONCILIATION: 2,
  MAX_DAYS_DEPOSIT_DELAY: 30,
  
  // Counts
  MAX_JOURNAL_LINES: 100,
  MIN_JOURNAL_LINES: 1,
  MAX_COUNTERS: 10,
  MIN_COUNTERS: 1,
  
  // Text Lengths
  MAX_ACCOUNT_CODE: 20,
  MAX_ACCOUNT_NAME: 200,
  MAX_SERVICE_NAME: 200,
  MAX_DESCRIPTION: 500,
  MAX_NOTES: 1000,
  MAX_DISCREPANCY_NOTES: 1000,
  MAX_RECONCILIATION_NOTES: 2000,
  MAX_ACCOUNT_NUMBER: 50,
  MAX_DEPOSIT_SLIP: 50,
  
  // Precision
  DECIMAL_PLACES: 2,
  BALANCE_TOLERANCE: 0.01,
};

export const VALID_ACCOUNT_TYPES = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];
export const VALID_BALANCE_TYPES = ['DEBIT', 'CREDIT'];
export const VALID_BANK_ACCOUNT_TYPES = ['CHECKING', 'SAVINGS', 'MONEY_MARKET', 'CREDIT_CARD'];
export const VALID_CURRENCIES = ['GHS', 'USD', 'EUR', 'GBP'];
export const VALID_RECONCILIATION_STATUSES = ['RECONCILED', 'PENDING', 'VOIDED'];

// ===== VALIDATION ERRORS =====
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ===== DATE VALIDATION =====
export const validateDate = (
  date: Date | string,
  fieldName: string,
  maxYearsOld?: number
): ValidationError | null => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    return { field: fieldName, message: `${fieldName} is not a valid date` };
  }

  // Check if future date
  if (dateObj > now) {
    return { field: fieldName, message: `${fieldName} cannot be in the future` };
  }

  // Check if too old
  if (maxYearsOld) {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - maxYearsOld);
    if (dateObj < maxDate) {
      return {
        field: fieldName,
        message: `${fieldName} cannot be more than ${maxYearsOld} years in the past`,
      };
    }
  }

  return null;
};

// ===== AMOUNT VALIDATION =====
export const validateAmount = (
  amount: number,
  fieldName: string,
  options: {
    min?: number;
    max?: number;
    allowNegative?: boolean;
    required?: boolean;
  } = {}
): ValidationError | null => {
  const { min = 0, max, allowNegative = false, required = false } = options;

  // Check if required
  if (required && (amount === null || amount === undefined)) {
    return { field: fieldName, message: `${fieldName} is required` };
  }

  // Check if valid number
  if (isNaN(amount)) {
    return { field: fieldName, message: `${fieldName} must be a valid number` };
  }

  // Check if negative (when not allowed)
  if (!allowNegative && amount < 0) {
    return { field: fieldName, message: `${fieldName} cannot be negative` };
  }

  // Check minimum
  if (amount < min) {
    return { field: fieldName, message: `${fieldName} must be at least ${min}` };
  }

  // Check maximum
  if (max !== undefined && amount > max) {
    return { field: fieldName, message: `${fieldName} cannot exceed ${max.toLocaleString()}` };
  }

  // Check decimal places
  const decimals = (amount.toString().split('.')[1] || '').length;
  if (decimals > VALIDATION_LIMITS.DECIMAL_PLACES) {
    return {
      field: fieldName,
      message: `${fieldName} cannot have more than ${VALIDATION_LIMITS.DECIMAL_PLACES} decimal places`,
    };
  }

  return null;
};

// ===== TEXT VALIDATION =====
export const validateText = (
  text: string,
  fieldName: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    patternMessage?: string;
  } = {}
): ValidationError | null => {
  const { required = false, minLength, maxLength, pattern, patternMessage } = options;

  // Check if required
  if (required && (!text || text.trim().length === 0)) {
    return { field: fieldName, message: `${fieldName} is required` };
  }

  // Skip further validation if empty and not required
  if (!text || text.trim().length === 0) {
    return null;
  }

  // Check minimum length
  if (minLength && text.length < minLength) {
    return { field: fieldName, message: `${fieldName} must be at least ${minLength} characters` };
  }

  // Check maximum length
  if (maxLength && text.length > maxLength) {
    return { field: fieldName, message: `${fieldName} cannot exceed ${maxLength} characters` };
  }

  // Check pattern
  if (pattern && !pattern.test(text)) {
    return {
      field: fieldName,
      message: patternMessage || `${fieldName} has invalid format`,
    };
  }

  return null;
};

// ===== JOURNAL ENTRY VALIDATION =====
export interface JournalEntryLine {
  accountId: string;
  description?: string;
  debit: number;
  credit: number;
}

export const validateJournalEntry = (
  entryDate: Date | string,
  description: string,
  lines: JournalEntryLine[]
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate date
  const dateError = validateDate(entryDate, 'Entry date', VALIDATION_LIMITS.MAX_YEARS_OLD_JOURNAL);
  if (dateError) errors.push(dateError);

  // Validate description
  const descError = validateText(description, 'Description', {
    required: true,
    maxLength: VALIDATION_LIMITS.MAX_DESCRIPTION,
  });
  if (descError) errors.push(descError);

  // Validate line count
  if (!lines || lines.length < VALIDATION_LIMITS.MIN_JOURNAL_LINES) {
    errors.push({
      field: 'lines',
      message: `Journal entry must have at least ${VALIDATION_LIMITS.MIN_JOURNAL_LINES} line`,
    });
  }

  if (lines && lines.length > VALIDATION_LIMITS.MAX_JOURNAL_LINES) {
    errors.push({
      field: 'lines',
      message: `Journal entry cannot have more than ${VALIDATION_LIMITS.MAX_JOURNAL_LINES} lines`,
    });
  }

  // Validate each line
  let totalDebits = 0;
  let totalCredits = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Validate account selected
    if (!line.accountId) {
      errors.push({
        field: `line${lineNum}.account`,
        message: `Line ${lineNum}: Account is required`,
      });
    }

    // Validate amounts
    const debitError = validateAmount(line.debit, `Line ${lineNum} debit`, {
      max: VALIDATION_LIMITS.MAX_JOURNAL_AMOUNT,
    });
    if (debitError) errors.push(debitError);

    const creditError = validateAmount(line.credit, `Line ${lineNum} credit`, {
      max: VALIDATION_LIMITS.MAX_JOURNAL_AMOUNT,
    });
    if (creditError) errors.push(creditError);

    // Validate not both debit and credit
    if (line.debit > 0 && line.credit > 0) {
      errors.push({
        field: `line${lineNum}.amounts`,
        message: `Line ${lineNum}: Cannot have both debit and credit amounts`,
      });
    }

    // Validate at least one amount
    if (line.debit === 0 && line.credit === 0) {
      errors.push({
        field: `line${lineNum}.amounts`,
        message: `Line ${lineNum}: Must have either debit or credit amount`,
      });
    }

    // Validate description length
    if (line.description) {
      const lineDescError = validateText(line.description, `Line ${lineNum} description`, {
        maxLength: VALIDATION_LIMITS.MAX_DESCRIPTION,
      });
      if (lineDescError) errors.push(lineDescError);
    }

    totalDebits += line.debit || 0;
    totalCredits += line.credit || 0;
  });

  // Validate balance
  const difference = Math.abs(totalDebits - totalCredits);
  if (difference > VALIDATION_LIMITS.BALANCE_TOLERANCE) {
    errors.push({
      field: 'balance',
      message: `Journal entry not balanced. Debits: ${totalDebits.toFixed(2)}, Credits: ${totalCredits.toFixed(2)}, Difference: ${difference.toFixed(2)}`,
    });
  }

  // Validate total not zero
  if (totalDebits === 0) {
    errors.push({
      field: 'total',
      message: 'Journal entry total cannot be zero',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===== OFFERING VALIDATION =====
export const validateOffering = (
  batchDate: Date | string,
  serviceName: string,
  cashAmount: number,
  mobileMoneyAmount: number,
  chequeAmount: number,
  counters: string[]
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate date
  const dateError = validateDate(batchDate, 'Batch date', VALIDATION_LIMITS.MAX_YEARS_OLD_OFFERING);
  if (dateError) errors.push(dateError);

  // Validate service name
  const nameError = validateText(serviceName, 'Service name', {
    required: true,
    maxLength: VALIDATION_LIMITS.MAX_SERVICE_NAME,
  });
  if (nameError) errors.push(nameError);

  // Validate counters
  if (!counters || counters.length < VALIDATION_LIMITS.MIN_COUNTERS) {
    errors.push({
      field: 'counters',
      message: `At least ${VALIDATION_LIMITS.MIN_COUNTERS} counter is required`,
    });
  }

  if (counters && counters.length > VALIDATION_LIMITS.MAX_COUNTERS) {
    errors.push({
      field: 'counters',
      message: `Cannot have more than ${VALIDATION_LIMITS.MAX_COUNTERS} counters`,
    });
  }

  // Validate amounts
  const cashError = validateAmount(cashAmount, 'Cash amount', {
    max: VALIDATION_LIMITS.MAX_OFFERING_AMOUNT,
  });
  if (cashError) errors.push(cashError);

  const mobileError = validateAmount(mobileMoneyAmount, 'Mobile money amount', {
    max: VALIDATION_LIMITS.MAX_OFFERING_AMOUNT,
  });
  if (mobileError) errors.push(mobileError);

  const chequeError = validateAmount(chequeAmount, 'Cheque amount', {
    max: VALIDATION_LIMITS.MAX_OFFERING_AMOUNT,
  });
  if (chequeError) errors.push(chequeError);

  // Validate total
  const total = cashAmount + mobileMoneyAmount + chequeAmount;
  if (total === 0) {
    errors.push({
      field: 'total',
      message: 'Offering total cannot be zero',
    });
  }

  if (total > VALIDATION_LIMITS.MAX_OFFERING_AMOUNT) {
    errors.push({
      field: 'total',
      message: `Total offering amount cannot exceed ${VALIDATION_LIMITS.MAX_OFFERING_AMOUNT.toLocaleString()}`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===== ACCOUNT VALIDATION =====
export const validateAccount = (
  accountCode: string,
  accountName: string,
  accountType: string,
  normalBalance: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate account code
  const codeError = validateText(accountCode, 'Account code', {
    required: true,
    maxLength: VALIDATION_LIMITS.MAX_ACCOUNT_CODE,
    pattern: /^[A-Za-z0-9\-_]+$/,
    patternMessage: 'Account code can only contain letters, numbers, hyphens, and underscores',
  });
  if (codeError) errors.push(codeError);

  // Validate account name
  const nameError = validateText(accountName, 'Account name', {
    required: true,
    maxLength: VALIDATION_LIMITS.MAX_ACCOUNT_NAME,
  });
  if (nameError) errors.push(nameError);

  // Validate account type
  if (!VALID_ACCOUNT_TYPES.includes(accountType)) {
    errors.push({
      field: 'accountType',
      message: `Account type must be one of: ${VALID_ACCOUNT_TYPES.join(', ')}`,
    });
  }

  // Validate normal balance
  if (!VALID_BALANCE_TYPES.includes(normalBalance)) {
    errors.push({
      field: 'normalBalance',
      message: `Normal balance must be either DEBIT or CREDIT`,
    });
  }

  // Validate normal balance matches account type
  const debitAccounts = ['ASSET', 'EXPENSE'];
  const creditAccounts = ['LIABILITY', 'EQUITY', 'REVENUE'];

  if (debitAccounts.includes(accountType) && normalBalance !== 'DEBIT') {
    errors.push({
      field: 'normalBalance',
      message: `${accountType} accounts must have DEBIT normal balance`,
    });
  }

  if (creditAccounts.includes(accountType) && normalBalance !== 'CREDIT') {
    errors.push({
      field: 'normalBalance',
      message: `${accountType} accounts must have CREDIT normal balance`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===== BANK RECONCILIATION VALIDATION =====
export const validateBankReconciliation = (
  reconciliationDate: Date | string,
  bankStatementBalance: number,
  bookBalance: number,
  difference: number
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate date
  const dateError = validateDate(
    reconciliationDate,
    'Reconciliation date',
    VALIDATION_LIMITS.MAX_YEARS_OLD_RECONCILIATION
  );
  if (dateError) errors.push(dateError);

  // Validate amounts
  const bankError = validateAmount(bankStatementBalance, 'Bank statement balance', {
    min: VALIDATION_LIMITS.MIN_BANK_BALANCE,
    max: VALIDATION_LIMITS.MAX_BANK_BALANCE,
    allowNegative: true,
  });
  if (bankError) errors.push(bankError);

  const bookError = validateAmount(bookBalance, 'Book balance', {
    min: VALIDATION_LIMITS.MIN_BANK_BALANCE,
    max: VALIDATION_LIMITS.MAX_BANK_BALANCE,
    allowNegative: true,
  });
  if (bookError) errors.push(bookError);

  // Validate difference calculation
  const calculatedDifference = bankStatementBalance - bookBalance;
  if (Math.abs(calculatedDifference - difference) > VALIDATION_LIMITS.BALANCE_TOLERANCE) {
    errors.push({
      field: 'difference',
      message: `Difference calculation incorrect. Expected: ${calculatedDifference.toFixed(2)}, Got: ${difference.toFixed(2)}`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===== HELPER FUNCTIONS =====
export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map((error) => error.message).join('\n');
};

export const getFirstError = (errors: ValidationError[]): string | null => {
  return errors.length > 0 ? errors[0].message : null;
};

export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some((error) => error.field === fieldName || error.field.startsWith(fieldName));
};

export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find(
    (error) => error.field === fieldName || error.field.startsWith(fieldName)
  );
  return error ? error.message : null;
};
