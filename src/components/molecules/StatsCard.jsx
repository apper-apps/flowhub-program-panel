import React from "react";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ title, value, icon, trend, className = "" }) => {
  return (
<div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:border-primary/20 group ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
<div className="p-3 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
<h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary group-hover:scale-105 transition-transform duration-300">
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