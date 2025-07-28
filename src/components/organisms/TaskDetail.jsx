import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskDetail = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const [linkedRecord, setLinkedRecord] = useState(null);
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);

  useEffect(() => {
    loadLinkedRecord();
  }, [task]);

  const loadLinkedRecord = async () => {
    if (!task.linkedId) return;
    
    setIsLoadingRecord(true);
    try {
      let record = null;
      
      switch (task.linkedTo) {
        case 'contact':
          const { contactService } = await import('@/services/api/contactService');
          record = await contactService.getById(task.linkedId);
          break;
        case 'company':
          const { companyService } = await import('@/services/api/companyService');
          record = await companyService.getById(task.linkedId);
          break;
        case 'deal':
          const { dealService } = await import('@/services/api/dealService');
          record = await dealService.getById(task.linkedId);
          break;
      }
      
      setLinkedRecord(record);
    } catch (error) {
      console.error('Failed to load linked record:', error);
    } finally {
      setIsLoadingRecord(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Completed' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const isOverdue = (dueDate, status) => {
    return status === 'Pending' && new Date(dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLinkedRecordName = () => {
    if (!linkedRecord) return 'Loading...';
    
    switch (task.linkedTo) {
      case 'contact':
        return `${linkedRecord.firstName} ${linkedRecord.lastName}`;
      case 'company':
        return linkedRecord.companyName || linkedRecord.name;
      case 'deal':
        return linkedRecord.title || linkedRecord.name;
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onToggleStatus}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                task.status === 'Completed'
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {task.status === 'Completed' && (
                <ApperIcon name="Check" size={14} />
              )}
            </button>
            <h1 className={`text-2xl font-bold ${
              task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority} Priority
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            {isOverdue(task.dueDate, task.status) && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                Overdue
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Description */}
        {task.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-900 leading-relaxed">{task.description}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Due Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Due Date</h3>
            <div className="flex items-center gap-2">
              <ApperIcon 
                name="Calendar" 
                size={16} 
                className={isOverdue(task.dueDate, task.status) ? 'text-red-500' : 'text-gray-400'} 
              />
              <span className={`font-medium ${
                isOverdue(task.dueDate, task.status) ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>

          {/* Linked Record */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Linked {task.linkedTo.charAt(0).toUpperCase() + task.linkedTo.slice(1)}
            </h3>
            <div className="flex items-center gap-2">
              <ApperIcon name="Link" size={16} className="text-gray-400" />
              {isLoadingRecord ? (
                <span className="text-gray-500">Loading...</span>
              ) : (
                <span className="font-medium text-gray-900">{getLinkedRecordName()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span> {formatDateTime(task.createdAt)}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {formatDateTime(task.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <Button
          variant={task.status === 'Completed' ? 'secondary' : 'primary'}
          onClick={onToggleStatus}
          className="flex items-center gap-2"
        >
          <ApperIcon 
            name={task.status === 'Completed' ? 'RotateCcw' : 'Check'} 
            size={16} 
          />
          {task.status === 'Completed' ? 'Mark Pending' : 'Mark Complete'}
        </Button>
        <Button variant="secondary" onClick={onEdit}>
          <ApperIcon name="Edit" size={16} className="mr-2" />
          Edit Task
        </Button>
      </div>
    </div>
  );
};

export default TaskDetail;