import React from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const DateRangeFilter = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onClear,
  className = "",
  label = "Date Range"
}) => {
  const hasValues = startDate || endDate;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="date"
            placeholder="From date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="flex-1">
          <Input
            type="date"
            placeholder="To date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="text-sm"
          />
        </div>
        {hasValues && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="px-3 py-2 border-gray-300 hover:border-gray-400"
          >
            <ApperIcon name="X" size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;