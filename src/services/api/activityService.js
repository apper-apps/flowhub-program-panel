import { toast } from 'react-toastify';

const activityService = {
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
          { field: { Name: "contactId" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { field: { Name: "emailData" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.fetchRecords('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message);
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
          { field: { Name: "contactId" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { field: { Name: "emailData" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.getRecordById('app_Activity', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "contactId" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "description" } },
          { field: { Name: "emailData" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        where: [
          {
            FieldName: "contactId",
            Operator: "EqualTo",
            Values: [parseInt(contactId)]
          }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities by contact ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(activityData) {
    try {
      if (!activityData.contactId || !activityData.type || !activityData.date || !activityData.description?.trim()) {
        throw new Error('Contact, type, date, and description are required');
      }

      // Additional validation for email activities
      if (activityData.type === 'Email' && activityData.emailData) {
        if (!activityData.emailData.to || !activityData.emailData.subject) {
          throw new Error('Email activities require recipient and subject information');
        }
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {
        Name: `${activityData.type} - ${new Date(activityData.date).toLocaleDateString()}`,
        contactId: parseInt(activityData.contactId),
        type: activityData.type,
        date: activityData.date,
        description: activityData.description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add email-specific data if this is an email activity
      if (activityData.type === 'Email' && activityData.emailData) {
        recordData.emailData = JSON.stringify({
          to: activityData.emailData.to,
          subject: activityData.emailData.subject,
          body: activityData.emailData.body,
          sentAt: activityData.emailData.sentAt || new Date().toISOString()
        });
      }

      const params = {
        records: [recordData]
      };

      const response = await apperClient.createRecord('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          // Customize success message for email activities
          if (activityData.type === 'Email') {
            toast.success('Email activity recorded');
          } else {
            toast.success('Activity created successfully');
          }
          return successfulRecords[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      if (updateData.description && !updateData.description.trim()) {
        throw new Error('Description cannot be empty');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const recordData = {
        Id: parseInt(id),
        updatedAt: new Date().toISOString()
      };

      // Add fields that are being updated
      if (updateData.Name) recordData.Name = updateData.Name;
      if (updateData.contactId) recordData.contactId = parseInt(updateData.contactId);
      if (updateData.type) recordData.type = updateData.type;
      if (updateData.date) recordData.date = updateData.date;
      if (updateData.description) recordData.description = updateData.description.trim();
      if (updateData.emailData) recordData.emailData = JSON.stringify(updateData.emailData);

      const params = {
        records: [recordData]
      };

      const response = await apperClient.updateRecord('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update activity ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          toast.success('Activity updated successfully');
          return successfulUpdates[0].data;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
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

      const response = await apperClient.deleteRecord('app_Activity', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete activity ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('Activity deleted successfully');
          return true;
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export { activityService };