import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { create, getAll } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import ApperIcon from "@/components/ApperIcon";
import StatsCard from "@/components/molecules/StatsCard";
import ContactForm from "@/components/organisms/ContactForm";
import CompanyForm from "@/components/organisms/CompanyForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import DateRangeFilter from "@/components/atoms/DateRangeFilter";
import Companies from "@/pages/Companies";
import Contacts from "@/pages/Contacts";

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
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [allActivities, setAllActivities] = useState([]);
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
    
    return filtered;
}, [allActivities, startDate, endDate]);

  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [...prev, newContact]);
      setShowContactModal(false);
      toast.success('Contact added successfully!');
      
      // Reload dashboard data to update stats
      await loadDashboardData();
    } catch (error) {
      toast.error('Failed to add contact. Please try again.');
      throw error;
    }
  };

  const handleAddCompany = async (companyData) => {
    try {
      const newCompany = await companyService.create(companyData);
      setCompanies(prev => [...prev, newCompany]);
      setShowCompanyModal(false);
      toast.success('Company added successfully!');
      
      // Reload dashboard data to update stats
      await loadDashboardData();
    } catch (error) {
      toast.error('Failed to add company. Please try again.');
      throw error;
    }
  };

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
      <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm shadow-lg">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight">Welcome to FlowHub CRM</h1>
              <p className="text-white/90 font-body">Manage your customer relationships efficiently</p>
            </div>
          </div>
          <p className="text-lg text-white/90 max-w-2xl font-body leading-relaxed">
            Your central hub for managing contacts, companies, and building stronger business relationships. 
            Get insights into your customer base and streamline your sales process.
          </p>
        </div>
        
        {/* Enhanced background decoration */}
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full animate-pulse delay-75"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full animate-pulse delay-150"></div>
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
<div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display">Contacts by Status</h3>
          <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
            <ApperIcon name="PieChart" size={20} className="text-gray-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Chart */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Enhanced donut chart using CSS */}
              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 via-green-400 to-orange-400 p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-display">{stats.totalContacts}</div>
                    <div className="text-sm text-gray-600 font-body">Total Contacts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                <span className="font-medium text-gray-900 font-body">Leads</span>
              </div>
              <span className="text-blue-600 font-semibold font-display">{stats.contactsByStatus.Lead}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm"></div>
                <span className="font-medium text-gray-900 font-body">Prospects</span>
              </div>
              <span className="text-purple-600 font-semibold font-display">{stats.contactsByStatus.Prospect}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></div>
                <span className="font-medium text-gray-900 font-body">Customers</span>
              </div>
              <span className="text-green-600 font-semibold font-display">{stats.contactsByStatus.Customer}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"></div>
                <span className="font-medium text-gray-900 font-body">Closed</span>
              </div>
              <span className="text-orange-600 font-semibold font-display">{stats.contactsByStatus.Closed}</span>
            </div>
          </div>
        </div>
      </div>

{/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100/50 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="/contacts"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] group border border-blue-100/50 touch-target"
          >
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/25">
              <ApperIcon name="Users" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 font-body group-hover:text-primary transition-colors">View Contacts</p>
              <p className="text-sm text-gray-600 font-body">Manage your contacts</p>
            </div>
          </a>
          
          <a 
            href="/companies"
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] group border border-purple-100/50 touch-target"
          >
            <div className="p-2 bg-gradient-accent rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/25">
              <ApperIcon name="Building2" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 font-body group-hover:text-accent transition-colors">View Companies</p>
              <p className="text-sm text-gray-600 font-body">Manage companies</p>
            </div>
          </a>
          
          <button 
            onClick={() => setShowContactModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02] group border border-green-100/50 touch-target w-full text-left"
          >
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
              <ApperIcon name="UserPlus" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 font-body group-hover:text-green-600 transition-colors">Add Contact</p>
              <p className="text-sm text-gray-600 font-body">Create new contact</p>
            </div>
          </button>
          
          <button 
            onClick={() => setShowCompanyModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02] group border border-orange-100/50 touch-target w-full text-left"
          >
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/25">
              <ApperIcon name="Plus" size={16} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 font-body group-hover:text-orange-600 transition-colors">Add Company</p>
              <p className="text-sm text-gray-600 font-body">Create new company</p>
            </div>
          </button>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg shadow-green-500/25">
                  <ApperIcon name="UserPlus" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-display">Add New Contact</h2>
                  <p className="text-sm text-gray-600 font-body">Create a new contact in your CRM</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-target"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <div className="p-6">
              <ContactForm
                onSubmit={handleAddContact}
                onCancel={() => setShowContactModal(false)}
                companies={companies}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-lg shadow-orange-500/25">
                  <ApperIcon name="Plus" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-display">Add New Company</h2>
                  <p className="text-sm text-gray-600 font-body">Create a new company in your CRM</p>
                </div>
              </div>
              <button
                onClick={() => setShowCompanyModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-target"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <div className="p-6">
              <CompanyForm
                onSubmit={handleAddCompany}
                onCancel={() => setShowCompanyModal(false)}
              />
            </div>
          </div>
        </div>
      )}

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
                call: { bg: 'bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200/50', dot: 'bg-gradient-to-r from-blue-500 to-blue-600', text: 'text-blue-700' },
                email: { bg: 'bg-gradient-to-r from-green-50 to-green-100/50 border-green-200/50', dot: 'bg-gradient-to-r from-green-500 to-green-600', text: 'text-green-700' },
                meeting: { bg: 'bg-gradient-to-r from-purple-50 to-purple-100/50 border-purple-200/50', dot: 'bg-gradient-to-r from-purple-500 to-purple-600', text: 'text-purple-700' },
                note: { bg: 'bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-200/50', dot: 'bg-gradient-to-r from-orange-500 to-orange-600', text: 'text-orange-700' },
                task: { bg: 'bg-gradient-to-r from-red-50 to-red-100/50 border-red-200/50', dot: 'bg-gradient-to-r from-red-500 to-red-600', text: 'text-red-700' }
              };
              
              const colors = activityColors[activity.type] || activityColors.note;
              const activityDate = new Date(activity.date);
              const isToday = activityDate.toDateString() === new Date().toDateString();
              const timeAgo = isToday ? 
                activityDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                activityDate.toLocaleDateString();

              return (
                <div key={activity.Id} className={`flex items-center space-x-3 p-3 ${colors.bg} rounded-lg border shadow-sm hover:shadow-md transition-all duration-300`}>
                  <div className={`w-2 h-2 ${colors.dot} rounded-full shadow-sm`}></div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${colors.text} capitalize font-body`}>
                      {activity.type}: {activity.description}
                    </p>
                    <p className="text-xs text-gray-600 font-body">
                      Contact ID: {activity.contactId}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 font-body">{timeAgo}</span>
                </div>
              );
            })
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg border border-gray-200/50 shadow-sm">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 font-body">
                  {startDate || endDate ? 'No activities found in selected date range' : 'No recent activities'}
                </p>
                <p className="text-xs text-gray-600 font-body">
                  {startDate || endDate ? 'Try adjusting your date filter' : 'Activities will appear here once created'}
                </p>
              </div>
              <span className="text-xs text-gray-500 font-body">-</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;