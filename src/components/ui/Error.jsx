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
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
<div className="w-16 h-16 bg-gradient-to-br from-red-100 via-red-50 to-red-200 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-red-500/20 ring-4 ring-red-50/50">
        <ApperIcon name="AlertTriangle" size={24} className="text-red-600 animate-pulse" />
      </div>
      
<h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">{message}</p>
      
      {onRetry && (
<Button onClick={onRetry} variant="primary" className="shadow-lg hover:shadow-xl">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;