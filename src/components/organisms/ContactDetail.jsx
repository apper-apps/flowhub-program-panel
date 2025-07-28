import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import EmailComposeModal from "@/components/organisms/EmailComposeModal";
import { toast } from "react-toastify";

const ContactDetail = ({ contact, companies = [], onUpdate, onDelete, onClose }) => {
const [isEditing, setIsEditing] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isActivitySaving, setIsActivitySaving] = useState(false);
  const [isTaskSaving, setIsTaskSaving] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [formData, setFormData] = useState({
    name: contact.name || "",
    email: contact.email || "",
    phone: contact.phone || "",
    jobTitle: contact.jobTitle || "",
    notes: contact.notes || "",
    companyId: contact.companyId || ""
  });

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : "No company assigned";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await onUpdate(contact.Id, {
        ...formData,
        companyId: formData.companyId || null
      });
      setIsEditing(false);
      toast.success("Contact updated successfully!");
    } catch (error) {
      toast.error("Failed to update contact. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(contact.Id);
      toast.success("Contact deleted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to delete contact. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

const handleCancel = () => {
    setFormData({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      jobTitle: contact.jobTitle || "",
      notes: contact.notes || "",
      companyId: contact.companyId || ""
    });
    setIsEditing(false);
  };

  // Activity management functions
const loadActivities = async () => {
    setIsActivitiesLoading(true);
    try {
      const { activityService } = await import('@/services/api/activityService');
      const contactActivities = await activityService.getByContactId(contact.Id);
      setActivities(contactActivities);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setIsActivitiesLoading(false);
    }
  };

  const loadTasks = async () => {
    setIsTasksLoading(true);
    try {
      const { taskService } = await import('@/services/api/taskService');
      const contactTasks = await taskService.getByContactId(contact.Id);
      setTasks(contactTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsTasksLoading(false);
    }
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setIsActivityFormOpen(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsActivityFormOpen(true);
  };

  const handleSaveActivity = async (activityData) => {
    setIsActivitySaving(true);
    try {
      const { activityService } = await import('@/services/api/activityService');
      
      if (editingActivity) {
        await activityService.update(editingActivity.Id, activityData);
      } else {
        await activityService.create(activityData);
      }
      
      await loadActivities();
      setIsActivityFormOpen(false);
      setEditingActivity(null);
    } catch (error) {
      throw error;
    } finally {
      setIsActivitySaving(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      const { activityService } = await import('@/services/api/activityService');
      await activityService.delete(activityId);
      await loadActivities();
    } catch (error) {
      throw error;
    }
  };

const handleSendEmail = async (emailData) => {
    setIsEmailSending(true);
    
    try {
      const { activityService } = await import('@/services/api/activityService');
      
      // Create activity for the sent email
      await activityService.create({
        contactId: contact.Id,
        type: 'email',
        date: new Date().toISOString().split('T')[0],
        description: `Email sent to ${emailData.to}\nSubject: ${emailData.subject}\n\n${emailData.body}`,
        emailData: {
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.body,
          sentAt: new Date().toISOString()
        }
      });
      
      // Reload activities to show the new email
      await loadActivities();
      
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error; // Re-throw to let modal handle the error
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    setIsTaskSaving(true);
    try {
      const { taskService } = await import('@/services/api/taskService');
      
      const taskPayload = {
        ...taskData,
        linkedTo: 'contact',
        linkedId: contact.Id
      };
      
      if (editingTask) {
        await taskService.update(editingTask.Id, taskPayload);
        toast.success('Task updated successfully');
      } else {
        await taskService.create(taskPayload);
        toast.success('Task created successfully');
      }
      
      await loadTasks();
      setIsTaskFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsTaskSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { taskService } = await import('@/services/api/taskService');
      await taskService.delete(taskId);
      await loadTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleToggleTaskStatus = async (taskId) => {
    try {
      const { taskService } = await import('@/services/api/taskService');
      await taskService.toggleStatus(taskId);
      await loadTasks();
      toast.success('Task status updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Load activities when tab changes to activities
React.useEffect(() => {
    if (activeTab === 'activities') {
      loadActivities();
    } else if (activeTab === 'tasks') {
      loadTasks();
    }
  }, [activeTab, contact.Id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.jobTitle || "No job title"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
<>
              <Button
                onClick={() => setIsEmailModalOpen(true)}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <ApperIcon name="Mail" size={16} className="mr-2" />
                Email
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                ) : (
                  <ApperIcon name="Trash2" size={16} className="mr-2" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                variant="primary"
                size="sm"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        {isEditing ? (
          // Edit Form
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Software Engineer, Marketing Manager"
            />
            
            {companies.length > 0 && (
              <Select
                label="Company"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
              >
                <option value="">No company</option>
                {companies.map((company) => (
                  <option key={company.Id} value={company.Id}>
                    {company.name}
                  </option>
                ))}
              </Select>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this contact..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" size={16} className="text-gray-400" />
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" size={16} className="text-gray-400" />
                  <a 
                    href={`tel:${contact.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Briefcase" size={16} className="text-gray-400" />
                  <span className="text-gray-900">{contact.jobTitle || "Not specified"}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Building" size={16} className="text-gray-400" />
                  <span className="text-gray-900">{getCompanyName(contact.companyId)}</span>
                </div>
              </div>
            </div>
            
            {contact.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-900 whitespace-pre-wrap">{contact.notes}</p>
                </div>
              </div>
            )}
<div className="text-xs text-gray-500 border-t pt-4">
              <div>Created: {new Date(contact.createdAt).toLocaleDateString()}</div>
              <div>Last updated: {new Date(contact.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        )}

{/* Activity Log Tab */}
        {activeTab === 'activities' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
                <p className="text-sm text-gray-500">Track all interactions with this contact</p>
              </div>
              <Button
                variant="primary"
                onClick={handleAddActivity}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                Add Activity
              </Button>
            </div>

            <div className="space-y-6">
              {React.createElement(() => {
                const ActivityList = React.lazy(() => import('@/components/organisms/ActivityList'));
                return (
                  <React.Suspense fallback={<div>Loading activities...</div>}>
                    <ActivityList
                      activities={activities}
                      onEdit={handleEditActivity}
                      onDelete={handleDeleteActivity}
                      isLoading={isActivitiesLoading}
                    />
                  </React.Suspense>
                );
              })}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
                <p className="text-sm text-gray-500">Manage follow-up tasks for this contact</p>
              </div>
              <Button
                variant="primary"
                onClick={handleAddTask}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                Add Task
              </Button>
            </div>

            <div className="space-y-4">
              {isTasksLoading ? (
                <div className="flex items-center justify-center py-8">
                  <ApperIcon name="Loader2" size={20} className="animate-spin mr-2" />
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckSquare" size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h4>
                  <p className="text-gray-500 mb-4">Create your first task to get started</p>
                  <Button variant="primary" onClick={handleAddTask}>
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.Id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <button
                              onClick={() => handleToggleTaskStatus(task.Id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                task.status === 'Completed'
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-green-500'
                              }`}
                            >
                              {task.status === 'Completed' && (
                                <ApperIcon name="Check" size={12} />
                              )}
                            </button>
                            <h4 className={`font-semibold ${
                              task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              task.priority === 'High' ? 'bg-red-100 text-red-800' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Calendar" size={14} />
                              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${
                              task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                          >
                            <ApperIcon name="Edit" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.Id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
<div className="border-t border-gray-200 px-6 py-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'details'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ApperIcon name="User" size={16} className="inline mr-2" />
              Details
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'activities'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ApperIcon name="Activity" size={16} className="inline mr-2" />
              Activity Log
              {activities.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                  {activities.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ApperIcon name="CheckSquare" size={16} className="inline mr-2" />
              Tasks
              {tasks.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                  {tasks.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

{/* Activity Form Modal */}
      {isActivityFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {React.createElement(() => {
              const ActivityForm = React.lazy(() => import('@/components/organisms/ActivityForm'));
              return (
                <React.Suspense fallback={<div className="p-6">Loading form...</div>}>
                  <ActivityForm
                    activity={editingActivity}
                    contactId={contact.Id}
                    onSave={handleSaveActivity}
                    onCancel={() => {
                      setIsActivityFormOpen(false);
                      setEditingActivity(null);
                    }}
                    isLoading={isActivitySaving}
                  />
                </React.Suspense>
              );
            })}
          </div>
</div>
      )}

      {/* Email Compose Modal */}
      <EmailComposeModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        contact={contact}
        onSend={handleSendEmail}
        isLoading={isEmailSending}
      />

      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            {React.createElement(() => {
              const TaskForm = React.lazy(() => import('@/components/organisms/TaskForm'));
              return (
                <React.Suspense fallback={<div className="p-6">Loading form...</div>}>
                  <TaskForm
                    task={editingTask}
                    onSave={handleSaveTask}
                    onCancel={() => {
                      setIsTaskFormOpen(false);
                      setEditingTask(null);
                    }}
                    isLoading={isTaskSaving}
                  />
                </React.Suspense>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDetail;