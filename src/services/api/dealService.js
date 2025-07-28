import mockDeals from '@/services/mockData/deals.json';
import { toast } from 'react-toastify';

let deals = [...mockDeals];
let nextId = Math.max(...deals.map(d => d.Id)) + 1;

// Get all deals
export const getAll = () => {
  return [...deals];
};

// Get deal by ID
export const getById = (id) => {
  const dealId = parseInt(id);
  if (isNaN(dealId)) {
    throw new Error('Invalid deal ID');
  }
  
  const deal = deals.find(d => d.Id === dealId);
  if (!deal) {
    throw new Error('Deal not found');
  }
  
  return { ...deal };
};

// Create new deal
export const create = (dealData) => {
  const newDeal = {
    ...dealData,
    Id: nextId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  deals.push(newDeal);
  toast.success(`Deal "${newDeal.name}" created successfully!`);
  return { ...newDeal };
};

// Update existing deal
export const update = (id, dealData) => {
  const dealId = parseInt(id);
  if (isNaN(dealId)) {
    throw new Error('Invalid deal ID');
  }
  
  const index = deals.findIndex(d => d.Id === dealId);
  if (index === -1) {
    throw new Error('Deal not found');
  }
  
  const updatedDeal = {
    ...deals[index],
    ...dealData,
    Id: dealId, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  deals[index] = updatedDeal;
  toast.success(`Deal "${updatedDeal.name}" updated successfully!`);
  return { ...updatedDeal };
};

// Delete deal
export const deleteDeal = (id) => {
  const dealId = parseInt(id);
  if (isNaN(dealId)) {
    throw new Error('Invalid deal ID');
  }
  
  const index = deals.findIndex(d => d.Id === dealId);
  if (index === -1) {
    throw new Error('Deal not found');
  }
  
  const deletedDeal = deals[index];
  deals.splice(index, 1);
  toast.success(`Deal "${deletedDeal.name}" deleted successfully!`);
  return { ...deletedDeal };
};

// Get deals by stage
export const getByStage = (stage) => {
  return deals.filter(d => d.stage === stage).map(d => ({ ...d }));
};

// Get deals by company
export const getByCompany = (companyId) => {
  const compId = parseInt(companyId);
  return deals.filter(d => d.companyId === compId).map(d => ({ ...d }));
};

// Get deals by contact
export const getByContact = (contactId) => {
  const contId = parseInt(contactId);
  return deals.filter(d => d.contactId === contId).map(d => ({ ...d }));
};

// Get deal statistics
export const getStats = () => {
  return {
    total: deals.length,
    prospecting: deals.filter(d => d.stage === 'Prospecting').length,
    proposal: deals.filter(d => d.stage === 'Proposal').length,
    negotiation: deals.filter(d => d.stage === 'Negotiation').length,
    closedWon: deals.filter(d => d.stage === 'Closed Won').length,
    closedLost: deals.filter(d => d.stage === 'Closed Lost').length,
    totalValue: deals.reduce((sum, d) => sum + d.value, 0),
    avgValue: deals.length > 0 ? deals.reduce((sum, d) => sum + d.value, 0) / deals.length : 0
  };
};