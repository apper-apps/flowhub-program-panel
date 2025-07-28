import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CompanyForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    industry: initialData?.industry || "",
    website: initialData?.website || "",
    phone: initialData?.phone || "",
    address: initialData?.address || ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Real Estate",
    "Media & Entertainment",
    "Transportation",
    "Food & Beverage",
    "Other"
  ];

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
      newErrors.name = "Company name is required";
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      newErrors.website = "Website must be a valid URL (starting with http:// or https://)";
    }

if (formData.phone && !formData.phone.match(/^[+]?[1-9][\d]{0,15}$/)) {
      newErrors.phone = "Please enter a valid phone number";
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
      await onSubmit(formData);
      
      toast.success("Company added successfully!");
      
// Reset form
      setFormData({
        name: "",
        industry: "",
        website: "",
        phone: "",
        address: ""
      });
      
    } catch (error) {
      toast.error("Failed to add company. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Company Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter company name"
        required
      />
      
      <Select
        label="Industry"
        name="industry"
        value={formData.industry}
        onChange={handleChange}
        error={errors.industry}
        required
      >
        <option value="">Select an industry</option>
        {industries.map((industry) => (
          <option key={industry} value={industry}>
            {industry}
          </option>
        ))}
      </Select>

      <Input
        label="Website"
        name="website"
        value={formData.website}
        onChange={handleChange}
        error={errors.website}
        placeholder="https://www.company.com"
      />

      <Input
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
error={errors.phone}
        placeholder="Enter phone number"
      />

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        placeholder="Enter company address"
      />
      
<div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-200/50">
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
          variant="primary"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[120px] min-h-[44px] order-1 sm:order-2 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              {initialData ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            <>
              <ApperIcon name={initialData ? "Save" : "Plus"} size={16} className="mr-2" />
              {initialData ? 'Update Company' : 'Add Company'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;