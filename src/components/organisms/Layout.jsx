import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import Button from "@/components/atoms/Button";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Mobile header with hamburger */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2 touch-target"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
              <ApperIcon name="Users" size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">FlowHub</span>
          </div>
          
          <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center touch-target">
            <ApperIcon name="User" size={14} className="text-white" />
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Page content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
</div>
    </div>
  );
};

export default Layout;