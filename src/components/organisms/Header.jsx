import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title }) => {
  return (
<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="p-1.5 sm:p-2 bg-gradient-primary rounded-lg shadow-lg shadow-primary/25 flex-shrink-0">
            <ApperIcon name="Users" size={16} sm:size={20} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-primary font-display tracking-tight truncate">
              FlowHub CRM
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Customer Relationship Management</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Clock" size={16} />
            <span className="hidden xl:inline">{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-110 touch-target">
            <ApperIcon name="User" size={14} sm:size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;