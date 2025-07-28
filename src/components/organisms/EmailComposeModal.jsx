import React, { useState } from 'react';
import Modal from '@/components/molecules/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const EmailComposeModal = ({ 
  isOpen, 
  onClose, 
  contact, 
  onSend,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    to: contact?.email || '',
    subject: '',
    body: ''
  });

  const [errors, setErrors] = useState({});

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
    
    if (!formData.to.trim()) {
      newErrors.to = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.to.trim())) {
      newErrors.to = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Message body is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSend({
        to: formData.to.trim(),
        subject: formData.subject.trim(),
        body: formData.body.trim()
      });
      
      // Reset form
      setFormData({
        to: contact?.email || '',
        subject: '',
        body: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const handleCancel = () => {
    setFormData({
      to: contact?.email || '',
      subject: '',
      body: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Compose Email"
      size="lg"
    >
      <form onSubmit={handleSend} className="space-y-4">
        {/* To Field */}
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <Input
            id="to"
            name="to"
            type="email"
            value={formData.to}
            onChange={handleChange}
            placeholder="recipient@example.com"
            error={errors.to}
            disabled={isLoading}
          />
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter email subject"
            error={errors.subject}
            disabled={isLoading}
          />
        </div>

        {/* Body Field */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="body"
            name="body"
            rows={8}
            value={formData.body}
            onChange={handleChange}
            placeholder="Compose your email message..."
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
              errors.body
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <ApperIcon name="Mail" size={16} className="mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmailComposeModal;