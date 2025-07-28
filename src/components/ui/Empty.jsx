import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Inbox",
  title = "No data found", 
  message = "Get started by adding your first item.", 
  actionText,
  onAction,
  className = "" 
}) => {
  return (
<div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center ${className}`}>
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-gray-500/10 ring-4 ring-gray-50/50">
        <ApperIcon name={icon} size={24} sm:size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 font-display px-4">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-sm sm:max-w-md leading-relaxed px-4">{message}</p>
      
      {actionText && onAction && (
        <Button 
          onClick={onAction} 
          variant="primary" 
          size="lg" 
          className="shadow-lg hover:shadow-xl touch-target w-full max-w-xs sm:w-auto"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;