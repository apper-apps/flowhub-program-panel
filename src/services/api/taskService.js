import { toast } from 'react-toastify';

export const taskService = {
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "linkedTo" } },
          { field: { Name: "linkedId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "linkedTo" } },
          { field: { Name: "linkedId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.getRecordById('task', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByContactId(contactId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "linkedTo" } },
          { field: { Name: "linkedId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "linkedTo",
            Operator: "EqualTo",
            Values: ["contact"]
          },
          {
            FieldName: "linkedId",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by contact ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByCompanyId(companyId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "linkedTo" } },
          { field: { Name: "linkedId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "linkedTo",
            Operator: "EqualTo",
            Values: ["company"]
          },
          {
            FieldName: "linkedId",
            Operator: "EqualTo",
            Values: [parseInt(companyId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by company ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "linkedTo" } },
          { field: { Name: "linkedId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "linkedTo",
            Operator: "EqualTo",
            Values: ["deal"]
          },
          {
            FieldName: "linkedId",
            Operator: "EqualTo",
            Values: [parseInt(dealId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks by deal ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.title || taskData.Name || "",
          title: taskData.title || "",
          description: taskData.description || "",
          dueDate: taskData.dueDate || null,
          priority: taskData.priority || "Medium",
          status: taskData.status || "Pending",
          linkedTo: taskData.linkedTo || null,
          linkedId: taskData.linkedId ? parseInt(taskData.linkedId) : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, taskData) {
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
          Name: taskData.title || taskData.Name,
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          priority: taskData.priority,
          status: taskData.status,
          linkedTo: taskData.linkedTo,
          linkedId: taskData.linkedId ? parseInt(taskData.linkedId) : null,
          updatedAt: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
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
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async toggleStatus(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      const newStatus = currentTask.status === 'Pending' ? 'Completed' : 'Pending';
      return await this.update(id, { status: newStatus });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling task status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};