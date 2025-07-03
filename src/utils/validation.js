// Validation utility functions for WasteWise application

// Regular expressions for ID formats
export const ID_PATTERNS = {
  WORKER: /^W\d{3}$/,
  ZONE: /^Z\d{3}$/,
  VEHICLE_PICKUP: /^PT\d{3}$/,
  VEHICLE_ROUTE: /^RT\d{3}$/,
  ROUTE: /^R\d{3}$/,
  PICKUP: /^P\d{3}$/,
  ASSIGNMENT: /^AS\d{3}$/
};

// Email validation
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number validation (supports various formats)
export const PHONE_PATTERN = /^[\+]?[1-9][\d]{0,15}$/;

// Name validation (letters, spaces, hyphens, apostrophes)
export const NAME_PATTERN = /^[a-zA-Z\s\-']+$/;

// Registration number validation (alphanumeric with possible spaces/hyphens)
export const REGISTRATION_PATTERN = /^[A-Z0-9\s\-]+$/;

// Validation functions
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_PATTERN.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (!PHONE_PATTERN.test(cleanPhone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (!NAME_PATTERN.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  return null;
};

export const validateId = (id, type, fieldName) => {
  if (!id) return `${fieldName} is required`;
  const pattern = ID_PATTERNS[type];
  if (!pattern.test(id)) {
    const format = getIdFormat(type);
    return `${fieldName} must be in format ${format}`;
  }
  return null;
};

export const validateRegistrationNumber = (regNo) => {
  if (!regNo) return 'Registration number is required';
  if (!REGISTRATION_PATTERN.test(regNo)) {
    return 'Registration number can only contain letters, numbers, spaces, and hyphens';
  }
  if (regNo.length < 4) {
    return 'Registration number must be at least 4 characters long';
  }
  return null;
};

export const validatePositiveNumber = (value, fieldName) => {
  if (!value) return `${fieldName} is required`;
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

export const validateDateRange = (startDate, endDate) => {
  if (!startDate) return 'Start date is required';
  if (!endDate) return 'End date is required';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start >= end) {
    return 'Start date must be before end date';
  }
  return null;
};

export const validateTimeRange = (startTime, endTime) => {
  if (!startTime) return 'Start time is required';
  if (!endTime) return 'End time is required';
  
  if (startTime >= endTime) {
    return 'Start time must be before end time';
  }
  return null;
};

export const validateSelect = (value, fieldName) => {
  if (!value || value === '') {
    return `Please select a ${fieldName}`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (!value) return `${fieldName} is required`;
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

// Helper function to get ID format description
const getIdFormat = (type) => {
  switch (type) {
    case 'WORKER': return 'W001';
    case 'ZONE': return 'Z001';
    case 'VEHICLE_PICKUP': return 'PT001';
    case 'VEHICLE_ROUTE': return 'RT001';
    case 'ROUTE': return 'R001';
    case 'PICKUP': return 'P001';
    case 'ASSIGNMENT': return 'AS001';
    default: return 'XXX001';
  }
};

// Utility to trim whitespace from user input
export const trimInput = (value) => {
  return value ? value.toString().trim() : '';
};

// Utility to validate form data
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Success message formatter
export const formatSuccessMessage = (action, entity) => {
  const actionMap = {
    create: 'created',
    update: 'updated',
    delete: 'deleted',
    assign: 'assigned',
    complete: 'completed'
  };
  
  const actionText = actionMap[action.toLowerCase()] || action.toLowerCase();
  return `${entity} ${actionText} successfully`;
};

// Error message formatter for API responses
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Handle different error response formats
    if (typeof data === 'string') {
      return data;
    }
    
    if (data.message) {
      return data.message;
    }
    
    if (data.error) {
      return data.error;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

