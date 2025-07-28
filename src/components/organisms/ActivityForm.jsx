import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const ActivityForm = ({ activity, contactId, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const activityTypes = [
    { value: 'Call', label: 'Call' },
    { value: 'Email', label: 'Email' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Note', label: 'Note' }
  ];

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || '',
        date: activity.date ? activity.date.substring(0, 16) : '',
        description: activity.description || ''
      });
    } else {
      // Default to current date/time for new activities
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setFormData({
        type: '',
        date: now.toISOString().substring(0, 16),
        description: ''
      });
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type) {
      newErrors.type = 'Activity type is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const activityData = {
        ...formData,
        contactId: contactId,
        date: new Date(formData.date).toISOString(),
        description: formData.description.trim()
      };

      await onSave(activityData);
    } catch (error) {
      toast.error(error.message || 'Failed to save activity');
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      Call: 'Phone',
      Email: 'Mail',
      Meeting: 'Calendar',
      Note: 'FileText'
    };
    return icons[type] || 'FileText';
  };

  return (
    <div className="p-6">
<div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
          <ApperIcon name={activity ? getActivityIcon(activity.type) : 'Plus'} size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {activity ? 'Edit Activity' : 'Add New Activity'}
          </h2>
          <p className="text-sm text-gray-500">
            {activity ? 'Update activity details' : 'Record a new interaction'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Select
            label="Activity Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={activityTypes}
            placeholder="Select activity type"
            error={errors.type}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-sm transition-all duration-300 ${
              errors.date ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 hover:border-gray-400'
            }`}
            required
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-sm transition-all duration-300 resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe the activity details..."
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

<div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/50">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full sm:flex-1 min-h-[44px] order-1 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {activity ? 'Update Activity' : 'Create Activity'}
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto min-h-[44px] order-2 hover:shadow-md"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;