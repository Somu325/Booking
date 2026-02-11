import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, CalendarCheck, Person, BoxArrowRight, X } from 'react-bootstrap-icons';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSidebar = ({ isOpen, onClose }: UserSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    // Clear cookies too
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    navigate('/user-login');
  };

  const navItems = [
    { name: 'Find a Coach', icon: <Grid size={18} />, path: '/screen' },
    { name: 'My Bookings', icon: <CalendarCheck size={18} />, path: '/booking-history' },
    { name: 'My Profile', icon: <Person size={18} />, path: '/userprofile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-100 flex flex-col
        transition-transform duration-300 ease-out lg:translate-x-0 shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-50">
          <span className="text-xs font-bold tracking-widest uppercase text-slate-900">
            The Sports 365
          </span>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-slate-50 text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }
                `}
              >
                <span className={`transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <BoxArrowRight size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
