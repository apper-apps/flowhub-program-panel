import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  className = "",
  ...props 
}, ref) => {
const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 font-body shadow-sm";
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-xl hover:shadow-primary/30 focus:ring-primary/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-primary/20",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] bg-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] bg-white hover:shadow-md transition-all duration-300",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl hover:shadow-red-500/30 focus:ring-red-500/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-red-400/20"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2 text-sm min-h-[40px]",
    lg: "px-6 py-3 text-base min-h-[44px]",
    xl: "px-8 py-4 text-lg min-h-[48px]"
  };
  
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;