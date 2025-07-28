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
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 focus:ring-primary/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]",
    secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500/50 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
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