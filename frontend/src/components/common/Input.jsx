import React from 'react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  className = '',
  rows,
  as = 'input',
  ...props
}) => {
  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <Component
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows || 3}
          className={`
            w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
            transition-colors duration-150 text-sm focus:outline-none focus:ring-2
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5
            ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-950/50'
                : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-100 dark:focus:ring-brand-950/50'
            }
            ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800' : ''}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
