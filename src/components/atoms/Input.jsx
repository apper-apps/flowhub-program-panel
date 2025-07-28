import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text",
  label,
  error,
  className = "",
  ...props 
}, ref) => {
  return (
<div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500",
          "focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/10",
          "transition-all duration-300 hover:border-gray-400 hover:bg-white hover:shadow-sm",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          error && "border-red-500 focus:ring-red-500/50 focus:border-red-500 focus:shadow-red-500/10",
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;