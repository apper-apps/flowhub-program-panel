import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const DealForm = ({ onSubmit, onCancel, companies, contacts, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    stage: 'Prospecting',
    expectedCloseDate: '',
    contactId: '',
    companyId: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stageOptions = [
    { value: 'Prospecting', label: 'Prospecting' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        value: initialData.value?.toString() || '',
        stage: initialData.stage || 'Prospecting',
        expectedCloseDate: initialData.expectedCloseDate || '',
        contactId: initialData.contactId?.toString() || '',
        companyId: initialData.companyId?.toString() || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Deal name is required';
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Deal value is required';
    } else {
      const valueNum = parseFloat(formData.value);
      if (isNaN(valueNum) || valueNum <= 0) {
        newErrors.value = 'Deal value must be a positive number';
      }
    }

    if (!formData.stage) {
      newErrors.stage = 'Stage is required';
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = 'Expected close date is required';
    } else {
      const closeDate = new Date(formData.expectedCloseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (closeDate < today) {
        newErrors.expectedCloseDate = 'Expected close date cannot be in the past';
      }
    }

    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId),
        companyId: formData.companyId ? parseInt(formData.companyId) : null
      };
      
      await onSubmit(submitData);
    } catch (error) {
      toast.error('Failed to save deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get filtered contacts based on selected company
  const getFilteredContacts = () => {
    if (!formData.companyId) return contacts;
    return contacts.filter(contact => 
      contact.companyId?.toString() === formData.companyId
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Deal Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter deal name"
            required
          />
        </div>

        <Input
          label="Deal Value"
          name="value"
          type="number"
          step="0.01"
          min="0"
          value={formData.value}
          onChange={handleChange}
          error={errors.value}
          placeholder="0.00"
          required
        />

        <Select
          label="Stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          options={stageOptions}
          error={errors.stage}
          required
        />

        <Input
          label="Expected Close Date"
          name="expectedCloseDate"
          type="date"
          value={formData.expectedCloseDate}
          onChange={handleChange}
          error={errors.expectedCloseDate}
          required
        />

        <Select
          label="Company"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select Company' },
            ...companies.map(company => ({
              value: company.Id.toString(),
              label: company.name
            }))
          ]}
          error={errors.companyId}
        />

        <Select
          label="Contact"
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select Contact' },
            ...getFilteredContacts().map(contact => ({
              value: contact.Id.toString(),
              label: contact.name
            }))
          ]}
          error={errors.contactId}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
<textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Add any notes about this deal..."
        />
      </div>

<div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200/50">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-h-[44px] order-2 sm:order-1 hover:shadow-md"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-h-[44px] order-1 sm:order-2 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={16} className="mr-2" />
              {initialData ? 'Update Deal' : 'Create Deal'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;