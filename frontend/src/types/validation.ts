export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationRule<T> {
  field: keyof T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate: (value: any, formData: T) => string | null;
}
