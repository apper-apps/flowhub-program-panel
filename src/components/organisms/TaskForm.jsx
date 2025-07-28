import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const TaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending',
    linkedTo: 'contact',
    linkedId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [linkedRecords, setLinkedRecords] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        linkedTo: task.linkedTo || 'contact',
        linkedId: task.linkedId || ''
      });
    }
  }, [task]);

  useEffect(() => {
    loadLinkedRecords();
  }, [formData.linkedTo]);

  const loadLinkedRecords = async () => {
    setIsLoadingRecords(true);
    try {
      let records = [];
      
      switch (formData.linkedTo) {
        case 'contact':
          const { contactService } = await import('@/services/api/contactService');
          records = await contactService.getAll();
          break;
        case 'company':
          const { companyService } = await import('@/services/api/companyService');
          records = await companyService.getAll();
          break;
        case 'deal':
          const { dealService } = await import('@/services/api/dealService');
          records = await dealService.getAll();
          break;
      }
      
      setLinkedRecords(records);
    } catch (error) {
      toast.error(`Failed to load ${formData.linkedTo}s`);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRecordDisplayName = (record) => {
    switch (formData.linkedTo) {
      case 'contact':
        return `${record.firstName} ${record.lastName}`;
      case 'company':
        return record.companyName || record.name;
      case 'deal':
        return record.title || record.name;
      default:
        return 'Unknown';
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.dueDate) {
      toast.error('Due date is required');
      return false;
    }
    if (!formData.linkedId) {
      toast.error('Please select a linked record');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSave({
        ...formData,
        linkedId: parseInt(formData.linkedId, 10)
      });
    } catch (error) {
      toast.error(error.message || 'Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title *
          </label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter task description"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Due Date and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <Select
              value={formData.priority}
              onChange={(value) => handleChange('priority', value)}
              options={[
                { value: 'Low', label: 'Low Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'High', label: 'High Priority' }
              ]}
            />
          </div>
        </div>

        {/* Status (only show for editing) */}
        {task && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={formData.status}
              onChange={(value) => handleChange('status', value)}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Completed', label: 'Completed' }
              ]}
            />
          </div>
        )}

        {/* Linked Record */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link to Record Type
            </label>
            <Select
              value={formData.linkedTo}
              onChange={(value) => handleChange('linkedTo', value)}
              options={[
                { value: 'contact', label: 'Contact' },
                { value: 'company', label: 'Company' },
                { value: 'deal', label: 'Deal' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select {formData.linkedTo.charAt(0).toUpperCase() + formData.linkedTo.slice(1)} *
            </label>
            {isLoadingRecords ? (
              <div className="flex items-center justify-center py-3">
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                Loading {formData.linkedTo}s...
              </div>
            ) : (
              <Select
                value={formData.linkedId}
                onChange={(value) => handleChange('linkedId', value)}
                options={[
                  { value: '', label: `Select ${formData.linkedTo}` },
                  ...linkedRecords.map(record => ({
                    value: record.Id.toString(),
                    label: getRecordDisplayName(record)
                  }))
                ]}
                required
              />
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
<div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:w-auto min-h-[44px] order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 order-1 sm:order-2"
        >
          {isLoading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;