import udyamSchemaRaw from '../../../docs/udyam-schema.json';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  maxLength: number;
  validationRegex: string;
  errorText: string;
  component: 'text' | 'checkbox' | 'select' | 'date' | 'radio';
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface UdyamSchemaType {
  step1: FormField[];
  step2: FormField[];
}

export const udyamSchema = udyamSchemaRaw as UdyamSchemaType;
