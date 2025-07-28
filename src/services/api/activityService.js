import activitiesData from '@/services/mockData/activities.json';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Copy data to avoid mutations
const activities = [...activitiesData];

const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activityId = parseInt(id);
    const activity = activities.find(a => a.Id === activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  },

  async getByContactId(contactId) {
    await delay(200);
    const id = parseInt(contactId);
    return activities
      .filter(activity => activity.contactId === id)
      .map(activity => ({ ...activity }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

async create(activityData) {
    await delay(500);
    
    if (!activityData.contactId || !activityData.type || !activityData.date || !activityData.description?.trim()) {
      throw new Error('Contact, type, date, and description are required');
    }

    // Additional validation for email activities
    if (activityData.type === 'email') {
      if (!activityData.emailData || !activityData.emailData.to || !activityData.emailData.subject) {
        throw new Error('Email activities require recipient and subject information');
      }
    }

    const maxId = activities.length > 0 ? Math.max(...activities.map(a => a.Id)) : 0;
    const newActivity = {
      Id: maxId + 1,
      contactId: parseInt(activityData.contactId),
      type: activityData.type,
      date: activityData.date,
      description: activityData.description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add email-specific data if this is an email activity
    if (activityData.type === 'email' && activityData.emailData) {
      newActivity.emailData = {
        to: activityData.emailData.to,
        subject: activityData.emailData.subject,
        body: activityData.emailData.body,
        sentAt: activityData.emailData.sentAt || new Date().toISOString()
      };
    }

    activities.push(newActivity);
    
    // Customize success message for email activities
    if (activityData.type === 'email') {
      toast.success('Email activity recorded');
    } else {
      toast.success('Activity created successfully');
    }
    
    return { ...newActivity };
  },

  async update(id, updateData) {
    await delay(500);
    
    const activityId = parseInt(id);
    const index = activities.findIndex(a => a.Id === activityId);
    
    if (index === -1) {
      throw new Error('Activity not found');
    }

    if (updateData.description && !updateData.description.trim()) {
      throw new Error('Description cannot be empty');
    }

    const updatedActivity = {
      ...activities[index],
      ...updateData,
      Id: activityId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    activities[index] = updatedActivity;
    toast.success('Activity updated successfully');
    return { ...updatedActivity };
  },

  async delete(id) {
    await delay(300);
    
    const activityId = parseInt(id);
    const index = activities.findIndex(a => a.Id === activityId);
    
    if (index === -1) {
      throw new Error('Activity not found');
    }

    const deletedActivity = activities.splice(index, 1)[0];
    toast.success('Activity deleted successfully');
    return { ...deletedActivity };
  }
};

export { activityService };