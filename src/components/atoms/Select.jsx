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
          "w-full px-3 py-2 pr-10 text-sm border rounded-lg bg-white/80 backdrop-blur-sm appearance-none transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10",
          "hover:border-gray-400 hover:bg-white hover:shadow-sm",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50",
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/50 focus:shadow-red-500/10" 
            : "border-gray-300",
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