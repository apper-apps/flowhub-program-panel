import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to convert array of objects to CSV
const arrayToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return headers.join(',') + '\n';
  }

  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  return csvHeaders + '\n' + csvRows.join('\n');
};

// Helper function to trigger file download
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportService = {
  // Export contacts to CSV
  async exportContacts(contacts, companies = []) {
    try {
      await delay(200); // Simulate processing time
      
      const headers = ['Id', 'name', 'email', 'phone', 'jobTitle', 'status', 'company', 'notes', 'createdAt'];
      
      const exportData = contacts.map(contact => ({
        Id: contact.Id,
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        jobTitle: contact.jobTitle || '',
        status: contact.status || '',
        company: contact.companyId ? 
          (companies.find(c => c.Id === contact.companyId)?.name || 'Unknown Company') : 
          'No Company',
        notes: contact.notes || '',
        createdAt: contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : ''
      }));

      const csvContent = arrayToCSV(exportData, headers);
      const filename = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success(`${contacts.length} contacts exported successfully!`);
      
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export contacts');
    }
  },

  // Export companies to CSV
  async exportCompanies(companies, contacts = []) {
    try {
      await delay(200);
      
      const headers = ['Id', 'name', 'industry', 'website', 'phone', 'address', 'contactCount', 'createdAt'];
      
      const exportData = companies.map(company => ({
        Id: company.Id,
        name: company.name || '',
        industry: company.industry || '',
        website: company.website || '',
        phone: company.phone || '',
        address: company.address || '',
        contactCount: contacts.filter(c => c.companyId === company.Id).length,
        createdAt: company.createdAt ? new Date(company.createdAt).toLocaleDateString() : ''
      }));

      const csvContent = arrayToCSV(exportData, headers);
      const filename = `companies_export_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success(`${companies.length} companies exported successfully!`);
      
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export companies');
    }
  },

  // Export deals to CSV
  async exportDeals(deals, contacts = [], companies = []) {
    try {
      await delay(200);
      
      const headers = ['Id', 'name', 'value', 'stage', 'contact', 'company', 'description', 'createdAt', 'expectedCloseDate'];
      
      const exportData = deals.map(deal => ({
        Id: deal.Id,
        name: deal.name || '',
        value: deal.value || 0,
        stage: deal.stage || '',
        contact: deal.contactId ? 
          (contacts.find(c => c.Id === deal.contactId)?.name || 'Unknown Contact') : 
          'No Contact',
        company: deal.companyId ? 
          (companies.find(c => c.Id === deal.companyId)?.name || 'Unknown Company') : 
          'No Company',
        description: deal.description || '',
        createdAt: deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : '',
        expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : ''
      }));

      const csvContent = arrayToCSV(exportData, headers);
      const filename = `deals_export_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadCSV(csvContent, filename);
      toast.success(`${deals.length} deals exported successfully!`);
      
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export deals');
    }
  }
};