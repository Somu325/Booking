import { useState, ReactNode } from 'react';
import { List } from 'react-bootstrap-icons';
import UserSidebar from './UserSidebar';

interface UserShellProps {
  children: ReactNode;
}

const UserShell = ({ children }: UserShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 antialiased overflow-hidden selection:bg-indigo-50 selection:text-indigo-900">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64 transition-all duration-300 relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 sticky top-0 supports-[backdrop-filter]:bg-white/60">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 focus:outline-none transition-colors rounded-lg hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <List size={24} />
          </button>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-900">
            The Sports 365
          </span>
          <div className="w-8" /> {/* Spacer for visual balance */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 scrollbar-hide">
            <div className="max-w-7xl mx-auto w-full min-h-full">
              {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default UserShell;
