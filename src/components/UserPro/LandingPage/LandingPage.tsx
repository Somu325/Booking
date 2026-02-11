import React, { useState } from 'react'
import { Person, PersonVcard, Headset } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom';

interface RoleOption {
  name: string
  icon: React.ReactNode
  path: string
}

const roles: RoleOption[] = [
  {
    name: 'User',
    icon: <Person size={32} />,
    path: '/user-login',
  },
  {
    name: 'Coach',
    icon: <PersonVcard size={32} />,
    path: '/Coach-login',
  },
  {
    name: 'Admin',
    icon: <Headset size={32} />,
    path: '/Adminlogin',
  },
]

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const navigate = useNavigate();

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role.name)
    // Simulate a brief delay for interaction feedback before navigating
    setTimeout(() => {
      navigate(role.path);
    }, 600)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-slate-900 font-sans selection:bg-slate-100">

      {/* Minimal Header */}
      <header className="absolute top-0 w-full p-8 flex justify-between items-center">
        <div className="text-xs font-medium tracking-widest uppercase text-slate-400">
          The Sports 365
        </div>
      </header>

      <div className="w-full max-w-4xl px-6">

        {/* Main Content */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900">
            Welcome
          </h1>
          <p className="text-lg text-slate-500 font-light max-w-md mx-auto leading-relaxed">
            Select your role to continue.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <button
              key={role.name}
              onClick={() => handleRoleSelect(role)}
              className="
                group relative flex flex-col items-center justify-center py-12 px-8
                bg-white rounded-2xl border border-slate-100
                transition-all duration-500 ease-out
                hover:border-slate-300 hover:shadow-sm hover:-translate-y-1
                active:scale-[0.98] active:border-slate-400
                focus:outline-none focus:ring-2 focus:ring-slate-100 focus:ring-offset-2
              "
              aria-label={`Login as ${role.name}`}
            >
              <div className="text-slate-300 group-hover:text-slate-900 transition-colors duration-500 mb-6 transform group-hover:scale-110 ease-out">
                {role.icon}
              </div>

              <span className="text-lg font-medium text-slate-900 tracking-tight">
                {role.name}
              </span>

              <span className="absolute bottom-8 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 text-xs font-medium text-slate-400">
                Enter &rarr;
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Loading Overlay */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-500">
          <div className="flex flex-col items-center gap-3">
             <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
             <p className="text-sm font-medium text-slate-600 animate-pulse">
               Accessing {selectedRole}...
             </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-8 text-center w-full">
        <p className="text-xs text-slate-300">
          &copy; {new Date().getFullYear()} The Sports 365. All rights reserved.
        </p>
      </div>

    </div>
  )
}
