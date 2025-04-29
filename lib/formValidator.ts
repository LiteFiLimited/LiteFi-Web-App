import { useState } from "react";

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
  validationRules: ValidationRules<T>
) {
  // Form data state
  const [formData, setFormData] = useState<T>(initialData);
  
  // Track which fields have been touched/interacted with
  const initialTouchedState = Object.keys(initialData).reduce(
    (acc, key) => ({ ...acc, [key]: false }),
    {} as FieldTouched<T>
  );
  const [fieldTouched, setFieldTouched] = useState<FieldTouched<T>>(initialTouchedState);

  // Calculate validations based on the current form data
  const validations = Object.keys(validationRules).reduce(
    (acc, key) => ({
      ...acc,
      [key]: validationRules[key as keyof T](formData[key as keyof T]),
    }),
    {} as { [K in keyof T]: boolean }
  );

  // Show errors only for fields that have been touched
  const showErrors = Object.keys(validationRules).reduce(
    (acc, key) => ({
      ...acc,
      [key]: fieldTouched[key as keyof T] && !validations[key as keyof T],
    }),
    {} as ValidationErrors<T>
  );

  // Check if the entire form is valid
  const isFormValid = () => {
    return Object.keys(validationRules).every(
      (key) => validations[key as keyof T]
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
  phone: (value: string) => /^\d{10,11}$/.test(value),
  bvn: (value: string) => /^\d{10,11}$/.test(value), 
  nin: (value: string) => value.trim() === "" || /^\d{10,11}$/.test(value),
  optionalEmail: (value: string) => value.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  notEmpty: (value: string) => value !== "",
  hasValue: (value: any) => !!value,
};
