import { toast } from "react-toastify";

export const dealService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "expectedCloseDate" } },
{ 
            field: { Name: "contactId" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "companyId" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "notes" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.fetchRecords('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "expectedCloseDate" } },
{ 
            field: { Name: "contactId" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "companyId" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "notes" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.getRecordById('deal', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: dealData.name || "",
          value: parseFloat(dealData.value) || 0,
          stage: dealData.stage || "Prospecting",
          expectedCloseDate: dealData.expectedCloseDate || null,
          contactId: dealData.contactId ? parseInt(dealData.contactId) : null,
          companyId: dealData.companyId ? parseInt(dealData.companyId) : null,
          notes: dealData.notes || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create deal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdDeal = successfulRecords[0].data;
          toast.success(`Deal "${createdDeal.Name}" created successfully!`);
          return createdDeal;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: dealData.name,
          value: parseFloat(dealData.value),
          stage: dealData.stage,
          expectedCloseDate: dealData.expectedCloseDate,
          contactId: dealData.contactId ? parseInt(dealData.contactId) : null,
          companyId: dealData.companyId ? parseInt(dealData.companyId) : null,
          notes: dealData.notes,
          updatedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update deal ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedDeal = successfulUpdates[0].data;
          toast.success(`Deal "${updatedDeal.Name}" updated successfully!`);
          return updatedDeal;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async deleteDeal(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First get the deal name for success message
      const dealToDelete = await this.getById(id);

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete deal ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success(`Deal "${dealToDelete?.Name || 'Unknown'}" deleted successfully!`);
          return dealToDelete;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByStage(stage) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "expectedCloseDate" } },
{ 
            field: { Name: "contactId" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "companyId" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "notes" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "stage",
            Operator: "EqualTo",
            Values: [stage]
          }
        ]
      };

      const response = await apperClient.fetchRecords('deal', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals by stage:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByCompany(companyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "expectedCloseDate" } },
{ 
            field: { Name: "contactId" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "companyId" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "notes" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "companyId",
            Operator: "EqualTo",
            Values: [parseInt(companyId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('deal', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals by company:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByContact(contactId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
{ field: { Name: "expectedCloseDate" } },
          { 
            field: { Name: "contactId" },
            referenceField: { field: { Name: "Name" } }
          },
          { field: { Name: "companyId" } },
          { field: { Name: "notes" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "contactId",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('deal', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals by contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getStats() {
    try {
      const deals = await this.getAll();
      
      return {
        total: deals.length,
        prospecting: deals.filter(d => d.stage === 'Prospecting').length,
        proposal: deals.filter(d => d.stage === 'Proposal').length,
        negotiation: deals.filter(d => d.stage === 'Negotiation').length,
        closedWon: deals.filter(d => d.stage === 'Closed Won').length,
        closedLost: deals.filter(d => d.stage === 'Closed Lost').length,
        totalValue: deals.reduce((sum, d) => sum + (d.value || 0), 0),
        avgValue: deals.length > 0 ? deals.reduce((sum, d) => sum + (d.value || 0), 0) / deals.length : 0
      };
    } catch (error) {
      console.error("Error calculating deal stats:", error.message);
      return {
        total: 0,
        prospecting: 0,
        proposal: 0,
        negotiation: 0,
        closedWon: 0,
        closedLost: 0,
        totalValue: 0,
        avgValue: 0
      };
    }
  },

  async updateStage(id, newStage) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          stage: newStage,
          updatedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('deal', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update deal stage ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal stage:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};

// Export individual functions for backward compatibility
export const getAll = () => dealService.getAll();
export const getById = (id) => dealService.getById(id);
export const create = (dealData) => dealService.create(dealData);
export const update = (id, dealData) => dealService.update(id, dealData);
export const deleteDeal = (id) => dealService.deleteDeal(id);
export const getByStage = (stage) => dealService.getByStage(stage);
export const getByCompany = (companyId) => dealService.getByCompany(companyId);
export const getByContact = (contactId) => dealService.getByContact(contactId);
export const getStats = () => dealService.getStats();
export const updateStage = (id, newStage) => dealService.updateStage(id, newStage);