import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ContactForm = ({ onSubmit, onCancel, companies = [], contact = null }) => {
const [formData, setFormData] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    jobTitle: contact?.jobTitle || "",
    notes: contact?.notes || "",
    companyId: contact?.companyId || ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
await onSubmit({
        ...formData,
        companyId: formData.companyId || null
      });
      
      toast.success(contact ? "Contact updated successfully!" : "Contact added successfully!");
      
      // Reset form only if adding new contact
      if (!contact) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          jobTitle: "",
          notes: "",
          companyId: ""
        });
      }
      
    } catch (error) {
      toast.error(contact ? "Failed to update contact. Please try again." : "Failed to add contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter contact's full name"
        required
      />
      
      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter email address"
        required
      />
      
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="Enter phone number"
        required
      />
      
<Input
        label="Job Title (Optional)"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
        placeholder="e.g. Software Engineer, Marketing Manager"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this contact..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      {companies.length > 0 && (
        <Select
          label="Company (Optional)"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.Id} value={company.Id}>
              {company.name}
            </option>
          ))}
        </Select>
      )}
      
      <div className="flex items-center justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              {contact ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <ApperIcon name={contact ? "Save" : "Plus"} size={16} className="mr-2" />
              {contact ? "Update Contact" : "Add Contact"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
export default ContactForm;