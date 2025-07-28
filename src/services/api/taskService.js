import mockTasks from '@/services/mockData/tasks.json';

let tasks = [...mockTasks];
let nextId = Math.max(...tasks.map(task => task.Id)) + 1;

export const taskService = {
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...tasks];
  },

  getById: async (id) => {
    if (typeof id !== 'number') {
      throw new Error('Task ID must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
    const task = tasks.find(t => t.Id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    return { ...task };
  },

  getByContactId: async (contactId) => {
    if (typeof contactId !== 'number') {
      throw new Error('Contact ID must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return tasks.filter(task => task.linkedTo === 'contact' && task.linkedId === contactId);
  },

  getByCompanyId: async (companyId) => {
    if (typeof companyId !== 'number') {
      throw new Error('Company ID must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return tasks.filter(task => task.linkedTo === 'company' && task.linkedId === companyId);
  },

  getByDealId: async (dealId) => {
    if (typeof dealId !== 'number') {
      throw new Error('Deal ID must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return tasks.filter(task => task.linkedTo === 'deal' && task.linkedId === dealId);
  },

  create: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const now = new Date().toISOString();
    const newTask = {
      ...taskData,
      Id: nextId++,
      createdAt: now,
      updatedAt: now
    };
    
    tasks.push(newTask);
    return { ...newTask };
  },

  update: async (id, taskData) => {
    if (typeof id !== 'number') {
      throw new Error('Task ID must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      Id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  delete: async (id) => {
    if (typeof id !== 'number') {
      throw new Error('Task ID must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const index = tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    tasks.splice(index, 1);
    return true;
  },

  toggleStatus: async (id) => {
    if (typeof id !== 'number') {
      throw new Error('Task ID must be a number');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const task = tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    return await taskService.update(id, { status: newStatus });
  }
};