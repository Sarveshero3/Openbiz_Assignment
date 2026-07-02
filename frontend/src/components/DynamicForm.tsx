import React from 'react';
import type { FormField } from '../constants/schema';

interface DynamicFormProps {
  fields: FormField[];
  formData: Record<string, any>;
  errors: Record<string, string>;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonLabel: string;
  isSubmitting: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  formData,
  errors,
  onChange,
  onSubmit,
  submitButtonLabel,
  isSubmitting,
  successMessage,
  errorMessage,
}) => {
  // Format Aadhaar: XXXX-XXXX-XXXX
  const handleAadhaarChange = (name: string, rawValue: string) => {
    const numbersOnly = rawValue.replace(/\D/g, '').substring(0, 12);
    let formatted = '';
    for (let i = 0; i < numbersOnly.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      formatted += numbersOnly[i];
    }
    onChange(name, formatted);
  };

  const handleInputChange = (field: FormField, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (field.name === 'aadhaarNumber') {
      handleAadhaarChange(name, value);
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      onChange(name, checked);
    } else {
      onChange(name, value);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-semibold rounded">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {fields.map((field) => {
          const value = formData[field.name] ?? '';
          const hasError = !!errors[field.name];

          return (
            <div key={field.id} className="flex flex-col space-y-2">
              {/* Field Label (skip for standalone checkbox if label is empty/decl) */}
              {field.component !== 'checkbox' && (
                <label className="text-sm font-bold text-gray-700 flex items-center">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}

              {/* Dynamic Input Rendering */}
              {field.component === 'text' && (
                <input
                  id={field.id}
                  name={field.name}
                  type="text"
                  placeholder={field.placeholder}
                  maxLength={field.maxLength || undefined}
                  value={value}
                  onChange={(e) => handleInputChange(field, e)}
                  disabled={isSubmitting}
                  className={`w-full p-2.5 text-sm bg-white border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasError ? 'border-red-500 focus:ring-red-300' : 'border-gray-300'
                  }`}
                />
              )}

              {field.component === 'date' && (
                <input
                  id={field.id}
                  name={field.name}
                  type="date"
                  value={value}
                  onChange={(e) => handleInputChange(field, e)}
                  disabled={isSubmitting}
                  className={`w-full p-2.5 text-sm bg-white border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasError ? 'border-red-500 focus:ring-red-300' : 'border-gray-300'
                  }`}
                />
              )}

              {field.component === 'select' && (
                <select
                  id={field.id}
                  name={field.name}
                  value={value}
                  onChange={(e) => handleInputChange(field, e)}
                  disabled={isSubmitting}
                  className={`w-full p-2.5 text-sm bg-white border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    hasError ? 'border-red-500 focus:ring-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">-- {field.placeholder} --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.component === 'checkbox' && (
                <div className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded">
                  <input
                    id={field.id}
                    name={field.name}
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => handleInputChange(field, e)}
                    disabled={isSubmitting}
                    className="mt-1 h-4.5 w-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={field.id} className="text-xs font-medium text-gray-600 leading-relaxed cursor-pointer selection:bg-blue-100">
                    {field.label}
                  </label>
                </div>
              )}

              {field.component === 'radio' && (
                <div className="flex gap-6 mt-1">
                  {field.options?.map((opt) => (
                    <label key={opt.value} className="flex items-center space-x-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={(e) => handleInputChange(field, e)}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Validation error message */}
              {hasError && (
                <span className="text-xs font-bold text-red-600 animate-fadeIn">
                  {errors[field.name]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto px-6 py-3 font-bold text-sm text-white rounded transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
          }`}
        >
          {isSubmitting ? 'Processing...' : submitButtonLabel}
        </button>
      </div>
    </form>
  );
};
