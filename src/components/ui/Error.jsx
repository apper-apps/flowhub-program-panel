import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
<div className={`flex flex-col items-center justify-center p-6 sm:p-8 text-center ${className}`}>
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-100 via-red-50 to-red-200 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-red-500/20 ring-4 ring-red-50/50">
        <ApperIcon name="AlertTriangle" size={20} sm:size={24} className="text-red-600 animate-pulse" />
      </div>
      
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-display px-4">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-sm sm:max-w-md leading-relaxed px-4">{message}</p>
      
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="primary" 
          size="lg"
          className="shadow-lg hover:shadow-xl touch-target w-full max-w-xs sm:w-auto"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;