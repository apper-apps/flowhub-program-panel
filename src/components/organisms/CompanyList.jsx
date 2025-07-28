import React, { useState, useMemo } from "react";
import SearchInput from "@/components/atoms/SearchInput";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const CompanyList = ({ 
  companies = [], 
  loading = false, 
  error = null, 
  onRetry,
  onAddCompany,
  onEditCompany 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return companies;
    
    const query = searchQuery.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(query) ||
      company.industry.toLowerCase().includes(query) ||
      (company.website && company.website.toLowerCase().includes(query)) ||
      (company.phone && company.phone.toLowerCase().includes(query))
    );
  }, [companies, searchQuery]);

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
        
        <Button onClick={onAddCompany} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <div className="w-full max-w-md">
        <SearchInput
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
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