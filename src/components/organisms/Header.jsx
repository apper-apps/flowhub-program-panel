import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <ApperIcon name="Users" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-primary">
              FlowHub CRM
            </h1>
            <p className="text-sm text-gray-600">Customer Relationship Management</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Clock" size={16} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;