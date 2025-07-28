import React, { useState, useEffect, useMemo } from "react";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import DateRangeFilter from "@/components/atoms/DateRangeFilter";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { activityService } from "@/services/api/activityService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCompanies: 0,
    recentContactsCount: 0,
    contactsByStatus: {
      Lead: 0,
      Prospect: 0,
      Customer: 0,
      Closed: 0
    }
  });
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredActivities = useMemo(() => {
    let filtered = allActivities;
    
    // Filter by date range
    if (startDate || endDate) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate + 'T23:59:59') : null;
        
        if (start && activityDate < start) return false;
        if (end && activityDate > end) return false;
        return true;
      });
    }
    
    return filtered
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [allActivities, startDate, endDate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [contacts, companies, activities] = await Promise.all([
        contactService.getAll(),
        companyService.getAll(),
        activityService.getAll()
      ]);
      
      // Calculate recent contacts (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentContacts = contacts.filter(contact => 
        new Date(contact.createdAt) > oneWeekAgo
      );

      // Calculate contacts by status
      const statusBreakdown = contacts.reduce((acc, contact) => {
        const status = contact.status || 'Lead';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      
      setStats({
        totalContacts: contacts.length,
        totalCompanies: companies.length,
        recentContactsCount: recentContacts.length,
        contactsByStatus: {
          Lead: statusBreakdown.Lead || 0,
          Prospect: statusBreakdown.Prospect || 0,
          Customer: statusBreakdown.Customer || 0,
          Closed: statusBreakdown.Closed || 0
        }
      });

      setAllActivities(activities);
      
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load dashboard"
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome to FlowHub CRM</h1>
              <p className="text-white/90">Manage your customer relationships efficiently</p>
            </div>
          </div>
          <p className="text-lg text-white/90 max-w-2xl">
            Your central hub for managing contacts, companies, and building stronger business relationships. 
            Get insights into your customer base and streamline your sales process.
          </p>
        </div>
        
        {/* Background decoration */}
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="Users"
          trend={{
            type: stats.recentContactsCount > 0 ? "up" : "neutral",
            value: `${stats.recentContactsCount} this week`
          }}
        />
        
        <StatsCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon="Building2"
        />
        
        <StatsCard
          title="Recent Activities"
          value={filteredActivities.length}
          icon="Activity"
          trend={{
            type: "neutral",
            value: startDate || endDate ? "Filtered results" : "Last 10 activities"
          }}
        />

        <StatsCard
          title="Active Leads"
          value={stats.contactsByStatus.Lead}
          icon="Target"
          trend={{
            type: "neutral",
            value: "Potential customers"
          }}
        />
      </div>

      {/* Contacts by Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Contacts by Status</h3>
          <ApperIcon name="PieChart" size={20} className="text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Chart */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Simple donut chart using CSS */}
              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 via-green-400 to-orange-400 p-2">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
                    <div className="text-sm text-gray-600">Total Contacts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Leads</span>
              </div>
              <span className="text-blue-600 font-semibold">{stats.contactsByStatus.Lead}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Prospects</span>
              </div>
              <span className="text-purple-600 font-semibold">{stats.contactsByStatus.Prospect}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Customers</span>
              </div>
              <span className="text-green-600 font-semibold">{stats.contactsByStatus.Customer}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Closed</span>
              </div>
              <span className="text-orange-600 font-semibold">{stats.contactsByStatus.Closed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="/contacts"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform duration-200">
              <ApperIcon name="Users" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Contacts</p>
              <p className="text-sm text-gray-600">Manage your contacts</p>
            </div>
          </a>
          
          <a 
            href="/companies"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] group"
          >
            <div className="p-2 bg-gradient-accent rounded-lg group-hover:scale-110 transition-transform duration-200">
              <ApperIcon name="Building2" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Companies</p>
              <p className="text-sm text-gray-600">Manage companies</p>
            </div>
          </a>
          
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] group cursor-pointer">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <ApperIcon name="UserPlus" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Contact</p>
              <p className="text-sm text-gray-600">Create new contact</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-[1.02] group cursor-pointer">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <ApperIcon name="Plus" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Add Company</p>
              <p className="text-sm text-gray-600">Create new company</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          <ApperIcon name="Clock" size={20} className="text-gray-400" />
        </div>
        
        {/* Activity Filter */}
        <div className="mb-6">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClear={() => {
              setStartDate("");
              setEndDate("");
            }}
            label="Filter activities by date"
            className="max-w-lg"
          />
        </div>
        
        <div className="space-y-3">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => {
              const activityColors = {
                call: { bg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-600' },
                email: { bg: 'bg-green-50', dot: 'bg-green-500', text: 'text-green-600' },
                meeting: { bg: 'bg-purple-50', dot: 'bg-purple-500', text: 'text-purple-600' },
                note: { bg: 'bg-orange-50', dot: 'bg-orange-500', text: 'text-orange-600' },
                task: { bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-600' }
              };
              
              const colors = activityColors[activity.type] || activityColors.note;
              const activityDate = new Date(activity.date);
              const isToday = activityDate.toDateString() === new Date().toDateString();
              const timeAgo = isToday ? 
                activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                activityDate.toLocaleDateString();

              return (
                <div key={activity.Id} className={`flex items-center space-x-3 p-3 ${colors.bg} rounded-lg`}>
                  <div className={`w-2 h-2 ${colors.dot} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {activity.type}: {activity.description}
                    </p>
                    <p className="text-xs text-gray-600">
                      Contact ID: {activity.contactId}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{timeAgo}</span>
                </div>
              );
            })
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {startDate || endDate ? 'No activities found in selected date range' : 'No recent activities'}
                </p>
                <p className="text-xs text-gray-600">
                  {startDate || endDate ? 'Try adjusting your date filter' : 'Activities will appear here once created'}
                </p>
              </div>
              <span className="text-xs text-gray-500">-</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;