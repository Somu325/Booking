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
    icon: <Person size={48} />,
    color: '#3498db',
    hoverColor: '#2980b9',
    path: '/user-login',
    tailwindColor: 'text-blue-600',
    bgHover: 'hover:bg-blue-50',
    borderHover: 'hover:border-blue-200'
  },
  {
    name: 'Coach',
    icon: <PersonVcard size={48} />,
    color: '#e74c3c',
    hoverColor: '#c0392b',
    path: '/Coach-login',
    tailwindColor: 'text-red-600',
    bgHover: 'hover:bg-red-50',
    borderHover: 'hover:border-red-200'
  },
  {
    name: 'Admin',
    icon: <Headset size={48} />,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 font-sans">

      {/* Background decorative blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-5xl">

        {/* Note: keeping existing functionality but styling it subtly */}
        <div className="text-center mb-8">
           <span className="inline-block px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 text-xs font-semibold text-slate-500 tracking-wider uppercase shadow-sm">
            Desktop Experience
          </span>
        </div>

        <div className="relative bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 p-8 md:p-16 overflow-hidden">

          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

          <div className="text-center mb-16 relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 tracking-tight mb-4 drop-shadow-sm">
              Choose your role
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              Select your account type to proceed to the dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
            {roles.map((role) => (
              <div
                key={role.name}
                className="
                  group relative flex flex-col items-center justify-center p-8
                  bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm
                  cursor-pointer transition-all duration-300 ease-out
                  hover:bg-white/80 hover:scale-[1.03] hover:shadow-xl hover:-translate-y-1
                  hover:border-indigo-100
                "
                onClick={() => handleRoleSelect(role)}
              >
                <div
                  className={`
                    mb-6 p-5 rounded-full bg-white shadow-sm border border-slate-100
                    transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                    text-slate-600 group-hover:text-indigo-600
                  `}
                >
                  {role.icon}
                </div>

                <h2 className="text-xl font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {role.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Click to login as {role.name}
                </p>

                {/* Decorative glow on hover */}
                <div className="absolute -inset-px bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-lg -z-10" />
              </div>
            ))}
          </div>

          {selectedRole && (
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-900/90 backdrop-blur-md text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <p className="text-base font-medium">
                  Redirecting to <span className="font-bold text-indigo-300">{selectedRole}</span> login...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
