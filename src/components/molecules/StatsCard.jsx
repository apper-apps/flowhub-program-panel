import React from "react";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ title, value, icon, trend, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-lg">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary">
              {value}
            </h3>
          </div>
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${trend.type === 'up' ? 'text-green-600' : trend.type === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
            <ApperIcon 
              name={trend.type === 'up' ? 'TrendingUp' : trend.type === 'down' ? 'TrendingDown' : 'Minus'} 
              size={16} 
            />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;