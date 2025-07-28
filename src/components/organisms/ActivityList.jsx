import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const ActivityList = ({ activities = [], onEdit, onDelete, isLoading = false }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getActivityIcon = (type) => {
    const icons = {
      Call: 'Phone',
      Email: 'Mail',
      Meeting: 'Calendar',
      Note: 'FileText'
    };
    return icons[type] || 'FileText';
  };

  const getActivityColor = (type) => {
const colors = {
      Call: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-200/50 shadow-green-500/10',
      Email: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-200/50 shadow-blue-500/10',
      Meeting: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-200/50 shadow-purple-500/10',
      Note: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-200/50 shadow-gray-500/10'
    };
    return colors[type] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-200/50 shadow-gray-500/10';
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleDelete = async (activityId) => {
    try {
      await onDelete(activityId);
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete activity');
    }
  };

if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border border-gray-200/50 rounded-xl p-4 animate-pulse bg-white/60 backdrop-blur-sm shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/4 shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 shimmer"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2 shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

if (!activities.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-500/10">
          <ApperIcon name="FileText" size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2 font-display">No Activities Yet</h3>
        <p className="text-gray-500 mb-6 font-body">Start tracking interactions by adding your first activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const { date, time } = formatDateTime(activity.date);
        
        return (
<div key={activity.Id} className="border border-gray-200/50 rounded-xl p-4 hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-gray-300/60">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <ApperIcon name={getActivityIcon(activity.type)} size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">{activity.type}</h4>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{date}</span>
                  <span className="text-sm text-gray-500">{time}</span>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">{activity.description}</p>
                
                <div className="flex items-center gap-2 mt-3">
<Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(activity)}
                    className="text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    <ApperIcon name="Edit2" size={14} />
                    Edit
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(activity.Id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm === activity.Id && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="AlertTriangle" size={16} className="text-red-600" />
                  <span className="text-sm font-medium text-red-800">Confirm Deletion</span>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  Are you sure you want to delete this activity? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(activity.Id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ActivityList;