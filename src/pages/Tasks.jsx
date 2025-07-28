import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { create, getAll, update } from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import SearchInput from "@/components/atoms/SearchInput";
import DateRangeFilter from "@/components/atoms/DateRangeFilter";

const Tasks = () => {
const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  useEffect(() => {
    loadTasks();
  }, []);

useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter, startDate, endDate, sortBy]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const { taskService } = await import('@/services/api/taskService');
      const data = await taskService.getAll();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

const filterTasks = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Date range filter
    if (startDate || endDate) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.dueDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate + 'T23:59:59') : null;
        
        if (start && taskDate < start) return false;
        if (end && taskDate > end) return false;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      const { taskService } = await import('@/services/api/taskService');
      
      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskService.create(taskData);
        toast.success('Task created successfully');
      }
      
      await loadTasks();
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const { taskService } = await import('@/services/api/taskService');
      await taskService.delete(taskId);
      toast.success('Task deleted successfully');
      await loadTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      const { taskService } = await import('@/services/api/taskService');
      await taskService.toggleStatus(taskId);
      toast.success('Task status updated');
      await loadTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Completed' 
      ? 'text-green-600 bg-green-50' 
      : 'text-blue-600 bg-blue-50';
  };

  const isOverdue = (dueDate, status) => {
    return status === 'Pending' && new Date(dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLinkedRecordName = (task) => {
    // This would typically fetch the linked record name
    // For now, return a placeholder
    return `${task.linkedTo.charAt(0).toUpperCase() + task.linkedTo.slice(1)} #${task.linkedId}`;
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500">Manage follow-up tasks and activities</p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateTask}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          New Task
        </Button>
      </div>

      {/* Filters */}
<div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SearchInput
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All Status' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Completed', label: 'Completed' }
              ]}
            />
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: '', label: 'All Priority' },
                { value: 'High', label: 'High Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority' }
              ]}
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'dueDate', label: 'Sort by Due Date' },
                { value: 'priority', label: 'Sort by Priority' },
                { value: 'status', label: 'Sort by Status' },
                { value: 'title', label: 'Sort by Title' }
              ]}
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
            label="Filter by due date range"
          />
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          description="Create your first task to get started"
          action={
            <Button variant="primary" onClick={handleCreateTask}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Task
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <div key={task.Id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => handleToggleStatus(task.Id)}
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
                      <h3 
                        className={`text-lg font-semibold cursor-pointer hover:text-indigo-600 ${
                          task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}
                        onClick={() => handleViewTask(task)}
                      >
                        {task.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" size={14} />
                        <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : ''}>
                          Due {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate, task.status) && ' (Overdue)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Link" size={14} />
                        <span>{getLinkedRecordName(task)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTask(task)}
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.Id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
          title={editingTask ? 'Edit Task' : 'Create New Task'}
          size="lg"
        >
          {React.createElement(() => {
            const TaskForm = React.lazy(() => import('@/components/organisms/TaskForm'));
            return (
              <React.Suspense fallback={<div className="p-6">Loading form...</div>}>
                <TaskForm
                  task={editingTask}
                  onSave={handleSaveTask}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingTask(null);
                  }}
                />
              </React.Suspense>
            );
          })}
        </Modal>
      )}

      {/* Task Detail Modal */}
      {isDetailOpen && selectedTask && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedTask(null);
          }}
          title="Task Details"
          size="lg"
        >
          {React.createElement(() => {
            const TaskDetail = React.lazy(() => import('@/components/organisms/TaskDetail'));
            return (
              <React.Suspense fallback={<div className="p-6">Loading details...</div>}>
                <TaskDetail
                  task={selectedTask}
                  onEdit={() => {
                    setIsDetailOpen(false);
                    handleEditTask(selectedTask);
                  }}
                  onDelete={() => {
                    setIsDetailOpen(false);
                    handleDeleteTask(selectedTask.Id);
                  }}
                  onToggleStatus={() => {
                    handleToggleStatus(selectedTask.Id);
                    setSelectedTask({ ...selectedTask, status: selectedTask.status === 'Pending' ? 'Completed' : 'Pending' });
                  }}
                />
              </React.Suspense>
            );
          })}
        </Modal>
      )}
    </div>
  );
};

export default Tasks;