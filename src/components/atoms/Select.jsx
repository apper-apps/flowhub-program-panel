import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Select = forwardRef(({
  className,
  options = [],
  placeholder = "Select option...",
  value,
  onChange,
  disabled = false,
  error = false,
  ...props
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full px-3 py-2 pr-10 text-sm border rounded-lg bg-white appearance-none transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
            : "border-gray-300 hover:border-gray-400",
          className
        )}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;