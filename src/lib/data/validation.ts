// Auto-Save & Validation Module
// Requirements: RM_MR_22, RM_MR_23, RM_MR_24, RM_MR_25

// RM_MR_24: Mandatory Field Configuration
export interface MandatoryFieldConfig {
  entityType: 'Risk' | 'Control' | 'Treatment Plan' | 'Assessment' | 'Category' | 'Matrix';
  fields: {
    fieldName: string;
    displayName: string;
    isMandatory: boolean;
    validationType: 'required' | 'email' | 'number' | 'date' | 'min-length' | 'max-length' | 'regex';
    validationRule?: string | number;
    errorMessage: string;
  }[];
}

// RM_MR_22: Auto-Save Record
export interface AutoSaveRecord {
  id: string;
  entityType: string;
  entityId: string;
  userId: string;
  
  // Save data
  savedData: any; // The actual form data
  
  // Timestamps
  lastSaved: string;
  autoSaveInterval: number; // seconds
  saveCount: number;
  
  // Status
  isComplete: boolean;
  hasUnsavedChanges: boolean;
}

// RM_MR_23: Unsaved Changes Warning
export interface UnsavedChangesState {
  hasChanges: boolean;
  formId: string;
  lastModified: string;
  fieldCount: number;
}

// RM_MR_25: Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: {
    fieldName: string;
    errorMessage: string;
  }[];
  missingMandatoryFields: string[];
}

// Mandatory Field Configurations (RM_MR_24)
export const mandatoryFieldConfigs: MandatoryFieldConfig[] = [
  {
    entityType: 'Risk',
    fields: [
      { fieldName: 'title', displayName: 'Risk Title', isMandatory: true, validationType: 'required', errorMessage: 'Risk title is required' },
      { fieldName: 'description', displayName: 'Description', isMandatory: true, validationType: 'required', errorMessage: 'Risk description is required' },
      { fieldName: 'category', displayName: 'Category', isMandatory: true, validationType: 'required', errorMessage: 'Risk category is required' },
      { fieldName: 'owner', displayName: 'Risk Owner', isMandatory: true, validationType: 'required', errorMessage: 'Risk owner is required' },
      { fieldName: 'inherentLikelihood', displayName: 'Inherent Likelihood', isMandatory: true, validationType: 'number', errorMessage: 'Inherent likelihood is required' },
      { fieldName: 'inherentConsequence', displayName: 'Inherent Consequence', isMandatory: true, validationType: 'number', errorMessage: 'Inherent consequence is required' },
      { fieldName: 'status', displayName: 'Status', isMandatory: false, validationType: 'required', errorMessage: '' }
    ]
  },
  {
    entityType: 'Control',
    fields: [
      { fieldName: 'title', displayName: 'Control Title', isMandatory: true, validationType: 'required', errorMessage: 'Control title is required' },
      { fieldName: 'description', displayName: 'Description', isMandatory: true, validationType: 'required', errorMessage: 'Control description is required' },
      { fieldName: 'type', displayName: 'Control Type', isMandatory: true, validationType: 'required', errorMessage: 'Control type is required' },
      { fieldName: 'effectiveness', displayName: 'Effectiveness', isMandatory: true, validationType: 'number', validationRule: 0, errorMessage: 'Effectiveness must be between 0-100' },
      { fieldName: 'owner', displayName: 'Control Owner', isMandatory: true, validationType: 'required', errorMessage: 'Control owner is required' }
    ]
  },
  {
    entityType: 'Treatment Plan',
    fields: [
      { fieldName: 'name', displayName: 'Plan Name', isMandatory: true, validationType: 'required', errorMessage: 'Plan name is required' },
      { fieldName: 'riskId', displayName: 'Associated Risk', isMandatory: true, validationType: 'required', errorMessage: 'Associated risk is required' },
      { fieldName: 'owner', displayName: 'Plan Owner', isMandatory: true, validationType: 'required', errorMessage: 'Plan owner is required' },
      { fieldName: 'startDate', displayName: 'Start Date', isMandatory: true, validationType: 'date', errorMessage: 'Start date is required' },
      { fieldName: 'targetDate', displayName: 'Target Completion Date', isMandatory: true, validationType: 'date', errorMessage: 'Target date is required' }
    ]
  },
  {
    entityType: 'Assessment',
    fields: [
      { fieldName: 'name', displayName: 'Assessment Name', isMandatory: true, validationType: 'required', errorMessage: 'Assessment name is required' },
      { fieldName: 'assessmentDate', displayName: 'Assessment Date', isMandatory: true, validationType: 'date', errorMessage: 'Assessment date is required' },
      { fieldName: 'assessor', displayName: 'Assessor', isMandatory: true, validationType: 'required', errorMessage: 'Assessor is required' }
    ]
  },
  {
    entityType: 'Category',
    fields: [
      { fieldName: 'name', displayName: 'Category Name', isMandatory: true, validationType: 'required', errorMessage: 'Category name is required' },
      { fieldName: 'description', displayName: 'Description', isMandatory: true, validationType: 'required', errorMessage: 'Category description is required' },
      { fieldName: 'level', displayName: 'Category Level', isMandatory: true, validationType: 'required', errorMessage: 'Category level is required' }
    ]
  },
  {
    entityType: 'Matrix',
    fields: [
      { fieldName: 'name', displayName: 'Matrix Name', isMandatory: true, validationType: 'required', errorMessage: 'Matrix name is required' },
      { fieldName: 'dimensions', displayName: 'Matrix Dimensions', isMandatory: true, validationType: 'required', errorMessage: 'Matrix dimensions are required' },
      { fieldName: 'level', displayName: 'Organization Level', isMandatory: true, validationType: 'required', errorMessage: 'Organization level is required' }
    ]
  }
];

// Helper: Get Mandatory Fields for Entity Type
export function getMandatoryFields(entityType: MandatoryFieldConfig['entityType']): string[] {
  const config = mandatoryFieldConfigs.find(c => c.entityType === entityType);
  if (!config) return [];
  return config.fields.filter(f => f.isMandatory).map(f => f.fieldName);
}

// Helper: Validate Form Data (RM_MR_25)
export function validateFormData(
  entityType: MandatoryFieldConfig['entityType'],
  formData: any
): ValidationResult {
  const config = mandatoryFieldConfigs.find(c => c.entityType === entityType);
  if (!config) {
    return { isValid: true, errors: [], missingMandatoryFields: [] };
  }

  const errors: ValidationResult['errors'] = [];
  const missingMandatoryFields: string[] = [];

  config.fields.forEach(field => {
    const value = formData[field.fieldName];
    
    // Check mandatory fields
    if (field.isMandatory) {
      if (value === undefined || value === null || value === '') {
        errors.push({
          fieldName: field.fieldName,
          errorMessage: field.errorMessage
        });
        missingMandatoryFields.push(field.displayName);
      }
    }

    // Additional validation types
    if (value !== undefined && value !== null && value !== '') {
      switch (field.validationType) {
        case 'number':
          if (isNaN(Number(value))) {
            errors.push({
              fieldName: field.fieldName,
              errorMessage: `${field.displayName} must be a number`
            });
          }
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push({
              fieldName: field.fieldName,
              errorMessage: `${field.displayName} must be a valid email`
            });
          }
          break;
        // Add more validation types as needed
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    missingMandatoryFields
  };
}

// Auto-Save Configuration
export const AUTO_SAVE_CONFIG = {
  interval: 30, // seconds
  enabled: true,
  showNotification: true,
  maxRetries: 3
};
