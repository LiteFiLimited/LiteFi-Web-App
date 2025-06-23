import { useState, useEffect } from "react";

export type ValidationRule<T> = (value: any) => boolean;

export type ValidationRules<T> = {
  [K in keyof T]: ValidationRule<T[K]>;
};

export type FieldTouched<T> = {
  [K in keyof T]: boolean;
};

export type ValidationErrors<T> = {
  [K in keyof T]: boolean;
};

export function useFormValidator<T extends Record<string, any>>(
  initialData: T,
  initialValidationRules: Partial<ValidationRules<T>>
) {
  // Form data state
  const [formData, setFormData] = useState<T>(initialData);
  
  // Validation rules state
  const [validationRules, setValidationRules] = useState<Partial<ValidationRules<T>>>(initialValidationRules);
  
  // Track which fields have been touched/interacted with
  const initialTouchedState = Object.keys(initialData).reduce(
    (acc, key) => ({ ...acc, [key]: false }),
    {} as FieldTouched<T>
  );
  const [fieldTouched, setFieldTouched] = useState<FieldTouched<T>>(initialTouchedState);

  // Calculate validations based on the current form data
  const [validations, setValidations] = useState<{ [K in keyof T]: boolean }>({} as { [K in keyof T]: boolean });
  
  // Update validations when form data or validation rules change
  useEffect(() => {
    const newValidations = Object.keys(validationRules).reduce(
      (acc, key) => {
        const rule = validationRules[key as keyof T];
        return {
          ...acc,
          [key]: rule ? rule(formData[key as keyof T]) : true,
        };
      },
      {} as { [K in keyof T]: boolean }
    );
    setValidations(newValidations);
  }, [formData, validationRules]);

  // Show errors only for fields that have been touched
  const showErrors = Object.keys(validationRules).reduce(
    (acc, key) => ({
      ...acc,
      [key]: fieldTouched[key as keyof T] && validationRules[key as keyof T] && !validations[key as keyof T],
    }),
    {} as ValidationErrors<T>
  );

  // Check if the entire form is valid
  const isFormValid = () => {
    return Object.keys(validationRules).every(
      (key) => !validationRules[key as keyof T] || validations[key as keyof T]
    );
  };

  // Handle field changes
  const handleChange = (field: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Mark field as touched when it loses focus
  const handleBlur = (field: keyof T) => {
    setFieldTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  // Mark all fields as touched (useful for form submission)
  const touchAllFields = () => {
    const touchedState = Object.keys(initialData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as FieldTouched<T>
    );
    setFieldTouched(touchedState);
  };

  return {
    formData,
    setFormData,
    fieldTouched,
    validations,
    showErrors,
    isFormValid,
    handleChange,
    handleBlur,
    touchAllFields,
    setValidationRules,
  };
}

// Common validation rules that can be reused across forms
export const validationRules = {
  required: (value: any) => {
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== undefined && value !== null;
  },
  minLength: (length: number) => (value: string) => value.trim().length >= length,
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value: string) => {
    // Remove all non-digit characters except +
    const cleanPhone = value.replace(/[^\d+]/g, '');
    
    // Check if it's a valid international format (starts with + and has 9-15 digits)
    if (cleanPhone.startsWith('+')) {
      const digits = cleanPhone.slice(1); // Remove the +
      return /^\d{9,15}$/.test(digits);
    }
    
    // Check if it's a valid Nigerian format (starts with 0 and has 11 digits)
    if (cleanPhone.startsWith('0')) {
      return /^0\d{10}$/.test(cleanPhone);
    }
    
    // For other formats, just check if it has 9-15 digits
    return /^\d{9,15}$/.test(cleanPhone);
  },
  bvn: (value: string) => /^\d{11}$/.test(value), 
  nin: (value: string) => value.trim() === "" || /^\d{11}$/.test(value),
  optionalEmail: (value: string) => value.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  notEmpty: (value: string) => value !== "",
  hasValue: (value: any) => !!value,
  date: (value: string) => {
    // Check if the date is in dd/mm/yyyy format
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(value)) return false;
    
    // Parse the date to check if it's valid
    const [day, month, year] = value.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year;
  }
};
