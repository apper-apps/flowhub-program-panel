import React, { useMemo, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchInput from "@/components/atoms/SearchInput";
import DateRangeFilter from "@/components/atoms/DateRangeFilter";
import Contacts from "@/pages/Contacts";
import { cn } from "@/utils/cn";
const ContactList = ({ 
  contacts = [], 
  companies = [],
  loading = false, 
  error = null, 
  onRetry,
  onAddContact,
  onContactSelect,
  onExportContacts
}) => {
const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

const filteredContacts = useMemo(() => {
    let filtered = contacts;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => {
        const companyName = getCompanyName(contact.companyId).toLowerCase();
        return contact.name.toLowerCase().includes(query) ||
               contact.email.toLowerCase().includes(query) ||
               contact.phone.includes(query) ||
               companyName.includes(query);
      });
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }
    
    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter(contact => {
        const contactDate = new Date(contact.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate + 'T23:59:59') : null;
        
        if (start && contactDate < start) return false;
        if (end && contactDate > end) return false;
        return true;
      });
    }
    
    return filtered;
  }, [contacts, searchQuery, statusFilter, startDate, endDate, companies]);

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Lead", label: "Lead" },
    { value: "Prospect", label: "Prospect" },
    { value: "Customer", label: "Customer" },
    { value: "Lost", label: "Lost" }
  ];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Lead":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Prospect":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Customer":
        return "bg-green-100 text-green-800 border-green-200";
      case "Lost":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

const getCompanyName = (companyId) => {
    // Handle null/undefined values first
    if (!companyId) {
      return "—";
    }
    
    // With referenceField configured, companyId should now be the company name directly
    if (typeof companyId === 'string') {
      return companyId;
    }
    
    // Handle legacy lookup objects during transition
    if (typeof companyId === 'object' && companyId !== null && companyId.Name) {
      return String(companyId.Name);
    }
    
    // Handle numeric ID by finding in companies array (fallback)
    if (typeof companyId === 'number') {
      const company = companies.find(c => c.Id === companyId);
      return company ? String(company.Name) : "—";
    }
    
    // Ensure we always return a string
    return "—";
  };
  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load contacts"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (contacts.length === 0) {
    return (
      <Empty
        icon="Users"
        title="No contacts yet"
        message="Start building your contact list by adding your first contact."
        actionText="Add First Contact"
        onAction={onAddContact}
      />
    );
  }

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contacts</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage your customer contacts</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <Button 
            onClick={() => onExportContacts && onExportContacts(filteredContacts)} 
            variant="outline"
            className="w-full sm:w-auto min-h-[44px]"
          >
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button onClick={onAddContact} variant="primary" className="w-full sm:w-auto min-h-[44px]">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              placeholder="Filter by status..."
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={() => {
            setStartDate("");
            setEndDate("");
          }}
          label="Filter by creation date"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {filteredContacts.length === contacts.length 
          ? `${contacts.length} total contacts`
          : `${filteredContacts.length} of ${contacts.length} contacts`
        }
      </div>

      {/* Contact list */}
      {filteredContacts.length === 0 ? (
        <Empty
          icon="Search"
          title="No contacts found"
          message={`No contacts match "${searchQuery}". Try adjusting your search.`}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact, index) => (
                    <tr 
                      key={contact.Id} 
                      onClick={() => onContactSelect && onContactSelect(contact)}
                      className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {contact.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{contact.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{contact.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {getCompanyName(contact.companyId)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          getStatusBadgeColor(contact.status)
                        )}>
                          {contact.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.Id}
                onClick={() => onContactSelect && onContactSelect(contact)}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-150 cursor-pointer active:scale-95"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ml-2 flex-shrink-0",
                        getStatusBadgeColor(contact.status)
                      )}>
                        {contact.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Mail" size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Phone" size={14} className="mr-2 flex-shrink-0" />
                        <span>{contact.phone}</span>
                      </div>
                      
{(() => {
                        const companyName = getCompanyName(contact.companyId);
                        const companyNameStr = String(companyName || '');
                        return companyNameStr && companyNameStr !== "—" && (
                          <div className="flex items-center text-sm text-gray-600">
                            <ApperIcon name="Building2" size={14} className="mr-2 flex-shrink-0" />
                            <span className="truncate">{companyNameStr}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ContactList;