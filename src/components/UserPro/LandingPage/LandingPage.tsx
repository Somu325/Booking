import React, { useState } from 'react'
import { Person, PersonVcard, Headset } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom';

interface RoleOption {
  name: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  path: string
  tailwindColor: string
  bgHover: string
  borderHover: string
}

const roles: RoleOption[] = [
  {
    name: 'User',
    icon: <Person size={64} />,
    color: '#3498db',
    hoverColor: '#2980b9',
    path: '/user-login',
    tailwindColor: 'text-blue-600',
    bgHover: 'hover:bg-blue-50',
    borderHover: 'hover:border-blue-200'
  },
  {
    name: 'Coach',
    icon: <PersonVcard size={64} />,
    color: '#e74c3c',
    hoverColor: '#c0392b',
    path: '/Coach-login',
    tailwindColor: 'text-red-600',
    bgHover: 'hover:bg-red-50',
    borderHover: 'hover:border-red-200'
  },
  {
    name: 'Admin',
    icon: <Headset size={64} />,
    color: '#2ecc71',
    hoverColor: '#27ae60',
    path: '/Adminlogin',
    tailwindColor: 'text-green-600',
    bgHover: 'hover:bg-green-50',
    borderHover: 'hover:border-green-200'
  },
]

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const navigate = useNavigate();

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role.name)
    setTimeout(() => {
      navigate(role.path);
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4 font-sans">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">
            Note: This app is designed for desktop/laptop use only
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-16 transition-all duration-500">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 text-center mb-12 tracking-tight">
            Choose your role
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {roles.map((role) => (
              <div
                key={role.name}
                className={`
                  group relative flex flex-col items-center justify-center p-8
                  bg-white rounded-2xl shadow-lg border border-transparent
                  cursor-pointer transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-2xl hover:-translate-y-2
                  ${role.bgHover} ${role.borderHover}
                `}
                onClick={() => handleRoleSelect(role)}
              >
                <div
                  className={`
                    mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                    ${role.tailwindColor}
                  `}
                >
                  {role.icon}
                </div>

                <h2 className="text-2xl font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {role.name}
                </h2>

                {/* Decorative element for hover state */}
                <div className={`absolute inset-0 rounded-2xl border-2 border-transparent ${role.borderHover} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              </div>
            ))}
          </div>

          {selectedRole && (
            <div className="text-center animate-pulse">
              <div className="inline-block px-6 py-3 bg-slate-100 rounded-full">
                <p className="text-lg font-medium text-slate-700">
                  You selected: <span className="font-bold text-blue-600">{selectedRole}</span>
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Redirecting to Login Page...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
