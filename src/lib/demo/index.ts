/**
 * [DEMO] Demo Module Index
 *
 * Central export point for all demo features
 * Import from this file to use demo data in the application
 */

export * from './config';
// export * from './payme-program';
// export * from './payme-obligations';
// export * from './payme-requirements';
// export * from './payme-controls';
export * from './playbooks';

// Re-export commonly used items
export { DEMO_MODE, isDemoEnabled, isDemoFeatureEnabled } from './config';
// export { paymePrograms } from './payme-program';
// export { paymeObligations } from './payme-obligations';
// export { paymeRequirements } from './payme-requirements';
// export { paymeControls } from './payme-controls';
export { demoPlaybooks } from './playbooks';

