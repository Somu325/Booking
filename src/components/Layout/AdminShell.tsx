
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Grid,
  BarChart,
  Person,
  People,
  CalendarCheck,
  XCircle,
  BoxArrowRight,
  List,
  X,
  Speedometer
} from 'react-bootstrap-icons';
import Cookies from 'js-cookie';

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminShell({ children, title }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove('admintoken');
    navigate('/Adminlogin');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Grid size={18} /> },
    { label: 'Overview', path: '/AdminOverview', icon: <Speedometer size={18} /> },
    { label: 'Analytics', path: '/Analyst', icon: <BarChart size={18} /> },
    { label: 'Manage Coach', path: '/ManageCoach', icon: <Person size={18} /> },
    { label: 'Manage User', path: '/ManageUser', icon: <People size={18} /> },
    { label: 'Bookings', path: '/Booking', icon: <CalendarCheck size={18} /> },
    { label: 'Cancel Booking', path: '/Booking-cancel', icon: <XCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center px-8 border-b border-gray-50">
          <span className="text-xl font-bold tracking-tight text-indigo-600">AdminPanel</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-gray-50 text-indigo-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <BoxArrowRight size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <List size={24} />}
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {title || (menuItems.find(i => i.path === location.pathname)?.label ?? 'Dashboard')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                A
              </div>
              <span className="text-sm font-medium text-gray-600 hidden sm:block">
                Administrator
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
