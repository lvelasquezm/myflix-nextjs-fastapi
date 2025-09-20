/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ValidationError, ValidationRule } from '@/types/validation';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class FormValidator<T extends Record<string, any>> {
  private rules: ValidationRule<T>[] = [];

  addRule(field: keyof T, validate: (value: any, formData: T) => string | null): this {
    this.rules.push({ field, validate });
    return this;
  }

  required(field: keyof T, message = `${String(field)} is required`): this {
    return this.addRule(field, (value) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return message;
      }

      return null;
    });
  }

  email(field: keyof T, message = 'Please enter a valid email address'): this {
    return this.addRule(field, (value) => {
      // Let `required` handle empty values.
      if (!value) return null;
      return !EMAIL_REGEX.test(value) ? message : null;
    });
  }

  minLength(field: keyof T, min: number, message?: string): this {
    return this.addRule(field, (value) => {
      // Let `required` handle empty values.
      if (!value) return null;

      if (value.length < min) {
        return message || `${String(field)} must be at least ${min} characters`;
      }

      return null;
    });
  }

  maxLength(field: keyof T, max: number, message?: string): this {
    return this.addRule(field, (value) => {
      // Let `required` handle empty values.
      if (!value) return null;

      if (value.length > max) {
        return message || `${String(field)} must be no more than ${max} characters`;
      }

      return null;
    });
  }

  custom(field: keyof T, validate: (value: any, formData: T) => string | null): this {
    return this.addRule(field, validate);
  }

  validate(formData: T): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const rule of this.rules) {
      const value = formData[rule.field];
      const error = rule.validate(value, formData);
      
      if (error) {
        errors.push({
          field: String(rule.field),
          message: error,
        });
      }
    }

    return errors;
  }

  isValid(formData: T): boolean {
    return this.validate(formData).length === 0;
  }
}

// Custom login validator.
export const loginValidator = new FormValidator<{ email: string; password: string }>()
  .required('email', 'Email address is required')
  .email('email')
  .required('password', 'Password is required')
  .minLength('password', 6, 'Password must be at least 6 characters');

export const generationValidator = new FormValidator<{ prompt: string; numImages: number }>()
  .required('prompt', 'Prompt is required')
  .minLength('prompt', 3, 'Prompt must be at least 3 characters')
  .maxLength('prompt', 500, 'Prompt must be no more than 500 characters')
  .custom('numImages', (value) => {
    return value < 1 ? 'Number of images must be at least 1' : null;
  });
