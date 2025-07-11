import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  error,
  disabled = false,
  icon
}) => {
  const inputClasses = `
    w-full px-4 py-3 border rounded-lg text-sm
    ${error 
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-200'
    }
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
    ${icon ? 'pl-12' : ''}
    focus:ring-2 focus:outline-none transition-colors duration-200
  `.trim();

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            disabled={disabled}
            className={inputClasses}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
          />
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
