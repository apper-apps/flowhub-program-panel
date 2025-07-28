import React, { useState, useMemo } from "react";
import SearchInput from "@/components/atoms/SearchInput";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ContactList = ({ 
  contacts = [], 
  companies = [],
  loading = false, 
  error = null, 
  onRetry,
  onAddContact,
  onContactSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    );
  }, [contacts, searchQuery]);

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : "—";
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
          <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
          <p className="text-gray-600">Manage your customer contacts</p>
        </div>
        
        <Button onClick={onAddContact} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="w-full max-w-md">
        <SearchInput
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
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

export default ContactList;