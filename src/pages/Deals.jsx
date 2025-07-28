import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import * as dealService from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import { companyService } from '@/services/api/companyService';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import SearchInput from '@/components/atoms/SearchInput';
import Select from '@/components/atoms/Select';
import Modal from '@/components/molecules/Modal';
import DealForm from '@/components/organisms/DealForm';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const stageOptions = [
    { value: '', label: 'All Stages' },
    { value: 'Prospecting', label: 'Prospecting' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'name', label: 'Deal Name' },
    { value: 'value', label: 'Deal Value' },
    { value: 'expectedCloseDate', label: 'Close Date' },
    { value: 'stage', label: 'Stage' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
const [dealsData, contactsData, companiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load deals data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedDeals = useMemo(() => {
    let filtered = deals.filter(deal => {
      const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (deal.notes && deal.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStage = !stageFilter || deal.stage === stageFilter;
      const matchesCompany = !companyFilter || deal.companyId?.toString() === companyFilter;
      
      return matchesSearch && matchesStage && matchesCompany;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'value') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'expectedCloseDate' || sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [deals, searchQuery, stageFilter, companyFilter, sortBy, sortOrder]);

  const handleCreateDeal = () => {
    setEditingDeal(null);
    setShowModal(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowModal(true);
  };

  const handleDeleteDeal = (deal) => {
    setDeleteConfirm(deal);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await dealService.deleteDeal(deleteConfirm.Id);
      setDeals(deals.filter(d => d.Id !== deleteConfirm.Id));
      setDeleteConfirm(null);
    } catch (err) {
      toast.error('Failed to delete deal');
    }
  };

  const handleSubmit = async (dealData) => {
    try {
      if (editingDeal) {
        const updatedDeal = await dealService.update(editingDeal.Id, dealData);
        setDeals(deals.map(d => d.Id === editingDeal.Id ? updatedDeal : d));
      } else {
        const newDeal = await dealService.create(dealData);
        setDeals([newDeal, ...deals]);
      }
      setShowModal(false);
      setEditingDeal(null);
    } catch (err) {
      toast.error(`Failed to ${editingDeal ? 'update' : 'create'} deal`);
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : 'No Company';
  };

  const getStageColor = (stage) => {
    const colors = {
      'Prospecting': 'bg-blue-100 text-blue-800',
      'Proposal': 'bg-yellow-100 text-yellow-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Closed Won': 'bg-green-100 text-green-800',
      'Closed Lost': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600">Manage your sales pipeline and track opportunities</p>
        </div>
        <Button onClick={handleCreateDeal} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={20} />
          Add Deal
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <SearchInput
              placeholder="Search deals..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <Select
            value={stageFilter}
            onChange={setStageFilter}
            options={stageOptions}
            placeholder="Filter by stage"
          />
          <Select
            value={companyFilter}
            onChange={setCompanyFilter}
            options={[
              { value: '', label: 'All Companies' },
              ...companies.map(company => ({
                value: company.Id.toString(),
                label: company.name
              }))
            ]}
            placeholder="Filter by company"
          />
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              placeholder="Sort by"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3"
            >
              <ApperIcon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Deals List */}
      {filteredAndSortedDeals.length === 0 ? (
        <Empty
          icon="Handshake"
          title="No deals found"
          description={deals.length === 0 ? "Get started by creating your first deal" : "Try adjusting your search criteria"}
          action={deals.length === 0 ? {
            label: "Add Deal",
            onClick: handleCreateDeal
          } : undefined}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Close Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedDeals.map((deal) => (
                  <tr key={deal.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{deal.name}</div>
                        {deal.notes && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {deal.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(deal.value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        getStageColor(deal.stage)
                      )}>
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getContactName(deal.contactId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCompanyName(deal.companyId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(deal.expectedCloseDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDeal(deal)}
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDeal(deal)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deal Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingDeal(null);
        }}
        title={editingDeal ? 'Edit Deal' : 'Create New Deal'}
      >
        <DealForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingDeal(null);
          }}
          companies={companies}
          contacts={contacts}
          initialData={editingDeal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Deal"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Deal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Deals;