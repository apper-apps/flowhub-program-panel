import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Companies", href: "/companies", icon: "Building2" },
    { name: "Deals", href: "/deals", icon: "Handshake" },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={() => onClose && onClose()}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-gradient-primary text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
        }`
      }
    >
      <ApperIcon name={item.icon} size={20} />
      <span className="font-medium">{item.name}</span>
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 min-h-0 pt-6 pb-4">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-primary">
              FlowHub
            </h2>
            <p className="text-xs text-gray-500">CRM System</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>
        
        <div className="px-4 mt-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Need Help?</h3>
            <p className="text-xs text-gray-600 mb-3">Contact our support team</p>
            <button className="text-xs bg-gradient-primary text-white px-3 py-1 rounded-md hover:shadow-lg transition-all duration-200">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col flex-1 min-h-0 pt-6 pb-4">
              <div className="flex items-center justify-between flex-shrink-0 px-6 mb-8">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <ApperIcon name="Zap" size={24} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-primary">
                      FlowHub
                    </h2>
                    <p className="text-xs text-gray-500">CRM System</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;