import React, { useMemo, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchInput from "@/components/atoms/SearchInput";
import DateRangeFilter from "@/components/atoms/DateRangeFilter";
import Companies from "@/pages/Companies";
import Contacts from "@/pages/Contacts";
const CompanyList = ({ 
  companies = [], 
  contacts = [],
  loading = false, 
  error = null, 
  onRetry,
  onAddCompany,
  onEditCompany,
  onExportCompanies
}) => {
const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Prospect", label: "Prospect" }
  ];

  const filteredCompanies = useMemo(() => {
    let filtered = companies;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        (company.website && company.website.toLowerCase().includes(query)) ||
        (company.phone && company.phone.toLowerCase().includes(query))
      );
    }
    
    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(company => 
        (company.status || 'Active') === statusFilter
      );
    }
    
    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter(company => {
        const companyDate = new Date(company.createdAt || company.foundedDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate + 'T23:59:59') : null;
        
        if (start && companyDate < start) return false;
        if (end && companyDate > end) return false;
        return true;
      });
    }
    
    return filtered;
  }, [companies, searchQuery, statusFilter, startDate, endDate]);

  const getContactCount = (companyId) => {
    return contacts.filter(contact => contact.companyId === companyId).length;
  };
  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load companies"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (companies.length === 0) {
    return (
      <Empty
        icon="Building2"
        title="No companies yet"
        message="Start building your company database by adding your first company."
        actionText="Add First Company"
        onAction={onAddCompany}
      />
    );
  }

  return (
<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
          <p className="text-gray-600">Manage your business relationships</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onExportCompanies && onExportCompanies(filteredCompanies)} 
            variant="outline"
            className="sm:w-auto"
          >
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button onClick={onAddCompany} variant="primary">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Company
          </Button>
        </div>
      </div>

{/* Search and Filters */}
      <div className="space-y-4 w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search companies..."
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
        {filteredCompanies.length === companies.length 
          ? `${companies.length} total companies`
          : `${filteredCompanies.length} of ${companies.length} companies`
        }
      </div>

      {/* Company list */}
      {filteredCompanies.length === 0 ? (
        <Empty
          icon="Search"
          title="No companies found"
          message={`No companies match "${searchQuery}". Try adjusting your search.`}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
<thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contacts
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Added
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
{filteredCompanies.map((company, index) => (
                  <tr 
                    key={company.Id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                          <ApperIcon name="Building2" size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {company.name}
                          </div>
                          {company.address && (
                            <div className="text-xs text-gray-500 mt-1">
                              {company.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {company.industry}
                      </span>
                    </td>
<td className="px-6 py-4">
                      <div className="flex items-center">
                        <ApperIcon name="Users" size={14} className="mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {getContactCount(company.Id)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          {getContactCount(company.Id) === 1 ? 'contact' : 'contacts'}
                        </span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="space-y-1">
                        {company.website && (
                          <div className="flex items-center text-sm text-gray-600">
                            <ApperIcon name="Globe" size={12} className="mr-2" />
                            <a 
                              href={company.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 truncate max-w-[120px]"
                            >
                              {company.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <ApperIcon name="Phone" size={12} className="mr-2" />
                            <span>{company.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditCompany && onEditCompany(company)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ApperIcon name="Edit2" size={14} className="mr-1" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;