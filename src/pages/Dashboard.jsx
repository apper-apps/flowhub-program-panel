import React, { useState, useEffect } from "react";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCompanies: 0,
    recentContactsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [contacts, companies] = await Promise.all([
        contactService.getAll(),
        companyService.getAll()
      ]);
      
      // Calculate recent contacts (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentContacts = contacts.filter(contact => 
        new Date(contact.createdAt) > oneWeekAgo
      );
      
      setStats({
        totalContacts: contacts.length,
        totalCompanies: companies.length,
        recentContactsCount: recentContacts.length
      });
      
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          title="Recent Activity"
          value={stats.recentContactsCount}
          icon="Activity"
          trend={{
            type: "neutral",
            value: "New contacts"
          }}
        />
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <ApperIcon name="Clock" size={20} className="text-gray-400" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">System initialized</p>
              <p className="text-xs text-gray-600">CRM system is ready to use</p>
            </div>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
          
          {stats.totalContacts > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Contacts loaded</p>
                <p className="text-xs text-gray-600">{stats.totalContacts} contacts available</p>
              </div>
              <span className="text-xs text-gray-500">Recently</span>
            </div>
          )}
          
          {stats.totalCompanies > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Companies loaded</p>
                <p className="text-xs text-gray-600">{stats.totalCompanies} companies available</p>
              </div>
              <span className="text-xs text-gray-500">Recently</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;