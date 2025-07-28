import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import * as dealService from "@/services/api/dealService";
import { exportService } from "@/services/exportService";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import DealForm from "@/components/organisms/DealForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchInput from "@/components/atoms/SearchInput";
import DateRangeFilter from "@/components/atoms/DateRangeFilter";
import { cn } from "@/utils/cn";
const Deals = () => {
const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('kanban');
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
      
      // Date range filter
      let matchesDateRange = true;
      if (startDate || endDate) {
        const dealDate = new Date(deal.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate + 'T23:59:59') : null;
        
        if (start && dealDate < start) matchesDateRange = false;
        if (end && dealDate > end) matchesDateRange = false;
      }
      
      return matchesSearch && matchesStage && matchesCompany && matchesDateRange;
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
  }, [deals, searchQuery, stageFilter, companyFilter, startDate, endDate, sortBy, sortOrder]);

  const dealsByStage = useMemo(() => {
    const stages = ['Prospecting', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const stageGroups = {};
    
    stages.forEach(stage => {
      stageGroups[stage] = filteredAndSortedDeals.filter(deal => deal.stage === stage);
    });
    
    return stageGroups;
  }, [filteredAndSortedDeals]);

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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;
    
    const dealId = parseInt(draggableId);
    const newStage = destination.droppableId;
    
    try {
      const updatedDeal = await dealService.updateStage(dealId, newStage);
      setDeals(deals.map(d => d.Id === dealId ? updatedDeal : d));
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error('Failed to update deal stage');
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

  const handleExportDeals = () => {
    exportService.exportDeals(filteredAndSortedDeals, contacts, companies);
  };

const getStageColor = (stage) => {
    const colors = {
      'Prospecting': 'bg-blue-100 text-blue-800 border-blue-200',
      'Proposal': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Negotiation': 'bg-orange-100 text-orange-800 border-orange-200',
      'Closed Won': 'bg-green-100 text-green-800 border-green-200',
      'Closed Lost': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  const getStageHeaderColor = (stage) => {
    const colors = {
      'Prospecting': 'bg-blue-50 border-blue-200',
      'Proposal': 'bg-yellow-50 border-yellow-200',
      'Negotiation': 'bg-orange-50 border-orange-200',
      'Closed Won': 'bg-green-50 border-green-200',
      'Closed Lost': 'bg-red-50 border-red-200'
    };
    return colors[stage] || 'bg-gray-50 border-gray-200';
  };

  const DealCard = ({ deal, index }) => (
    <Draggable draggableId={deal.Id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white rounded-lg border border-gray-200 p-4 mb-3 cursor-grab transition-all duration-200 hover:shadow-md",
            snapshot.isDragging && "shadow-lg rotate-2 scale-105"
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 text-sm leading-tight">{deal.name}</h3>
            <div className="flex space-x-1 ml-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditDeal(deal);
                }}
                className="p-1 h-6 w-6"
              >
                <ApperIcon name="Edit2" size={12} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDeal(deal);
                }}
                className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
              >
                <ApperIcon name="Trash2" size={12} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(deal.value)}
              </span>
            </div>
            
            {deal.contactId && (
              <div className="flex items-center text-xs text-gray-600">
                <ApperIcon name="User" size={12} className="mr-1" />
                {getContactName(deal.contactId)}
              </div>
            )}
            
            {deal.companyId && (
              <div className="flex items-center text-xs text-gray-600">
                <ApperIcon name="Building2" size={12} className="mr-1" />
                {getCompanyName(deal.companyId)}
              </div>
            )}
            
            {deal.expectedCloseDate && (
              <div className="flex items-center text-xs text-gray-600">
                <ApperIcon name="Calendar" size={12} className="mr-1" />
                {formatDate(deal.expectedCloseDate)}
              </div>
            )}
            
            {deal.notes && (
              <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                {deal.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );

  const KanbanColumn = ({ stage, deals: stageDeals }) => (
    <div className="flex-shrink-0 w-80">
      <div className={cn("rounded-lg border-2 h-full", getStageHeaderColor(stage))}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{stage}</h2>
            <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
              {stageDeals.length}
            </span>
          </div>
        </div>
        
        <Droppable droppableId={stage}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "p-4 min-h-96 transition-colors duration-200",
                snapshot.isDraggingOver && "bg-blue-50"
              )}
            >
              {stageDeals.map((deal, index) => (
                <DealCard key={deal.Id} deal={deal} index={index} />
              ))}
              {provided.placeholder}
              
              {stageDeals.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="Package" size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No deals in {stage.toLowerCase()}</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-600">Manage your sales pipeline and track opportunities</p>
        </div>
<div className="flex gap-2">
          <Button 
            onClick={handleExportDeals} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ApperIcon name="Download" size={16} />
            Export CSV
          </Button>
          <Button onClick={handleCreateDeal} className="w-full sm:w-auto">
            <ApperIcon name="Plus" size={20} />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Filters */}
<div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </div>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={() => {
              setStartDate('');
              setEndDate('');
            }}
            label="Filter by creation date"
          />
        </div>
      </div>

      {/* Kanban Board */}
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {['Prospecting', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'].map(stage => (
                <KanbanColumn
                  key={stage}
                  stage={stage}
                  deals={dealsByStage[stage] || []}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
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