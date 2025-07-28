import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchInput = forwardRef(({ 
  placeholder = "Search...",
  className = "",
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={16} className="text-gray-400" />
      </div>
      
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={cn(
          "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500",
          "focus:ring-2 focus:ring-primary/50 focus:border-primary",
          "transition-colors duration-200",
          className
        )}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;