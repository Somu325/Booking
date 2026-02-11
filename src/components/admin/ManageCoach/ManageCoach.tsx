
'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Domain_URL } from "../../config";
import AdminShell from '../../Layout/AdminShell';
import { Pencil, SlashCircle, Search, Plus, X } from 'react-bootstrap-icons';

interface Coach {
  softDelete: any;
  coachId: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: "Active" | "Frozen";
  sport: string;
}

export default function ManageCoach() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [newCoach, setNewCoach] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    sport: "Cricket",
    bio: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    sport: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
        setCoaches(response.data || []);
        setFilteredCoaches(response.data || []);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchCoaches();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = coaches.filter((coach) =>
      coach.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCoaches(filtered);
  };

  const validateForm = () => {
    const validationErrors: any = {};

    const namePattern = /^[A-Za-z\s]+$/;
    if (!newCoach.name.trim()) validationErrors.name = "Name is required.";
    else if (!namePattern.test(newCoach.name)) validationErrors.name = "Name can only contain alphabets.";

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!newCoach.email.trim()) validationErrors.email = "Email is required.";
    else if (!emailPattern.test(newCoach.email)) validationErrors.email = "Invalid email format.";

    const phonePattern = /^(?!0)\d{10}$/;
    if (!newCoach.phoneNumber.trim()) validationErrors.phoneNumber = "Phone number is required.";
    else if (!phonePattern.test(newCoach.phoneNumber)) validationErrors.phoneNumber = "Phone number must be 10 digits and cannot start with 0.";

    if (!newCoach.gender) validationErrors.gender = "Gender is required.";
    if (!newCoach.sport) validationErrors.sport = "Sport is required.";

    const passwordPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (!newCoach.password.trim()) validationErrors.password = "Password is required.";
    else if (newCoach.password.length < 6) validationErrors.password = "Password must be at least 6 characters long.";
    else if (!passwordPattern.test(newCoach.password)) validationErrors.password = "Password must contain at least one special character.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (selectedCoach) {
        await axios.put(
          `${Domain_URL}/coach/update/${selectedCoach.coachId}`,
          newCoach
        );
      } else {
        await axios.post(`${Domain_URL}/coach/createCoache`, newCoach);
      }
      setIsModalOpen(false);
      setSelectedCoach(null);

      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
      setCoaches(response.data || []);
      setFilteredCoaches(response.data || []);
    } catch (error: any) {
      if (error.response?.data?.message === "Email is already registered.") {
        setErrors((prev) => ({
          ...prev,
          email: "Email is already registered.",
        }));
      } else {
        console.error("Error saving coach:", error);
      }
    }
  };

  const openModal = (coach?: Coach) => {
    if (coach) {
      setSelectedCoach(coach);
      setNewCoach(coach as any);
    } else {
      setSelectedCoach(null);
      setNewCoach({
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        sport: "Cricket",
        bio: "",
        password: "",
      });
    }
    setIsModalOpen(true);
  };

  const toggleFreezeCoach = async (coachId: string, action: "delete" | "restore") => {
    try {
      await axios.patch(`${Domain_URL}/coach/coaches/manage/${coachId}`, { action });
      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
      setCoaches(response.data || []);
      setFilteredCoaches(response.data || []);
    } catch (error) {
      console.error("Error freezing/unfreezing coach:", error);
    }
  };

  return (
    <AdminShell title="Manage Coaches">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
           <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="text-gray-400" size={16} />
              </div>
              <input
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
           </div>
           <button
             onClick={() => openModal()}
             className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
           >
             <Plus size={18} /> Add Coach
           </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {filteredCoaches.map((coach) => (
                       <tr key={coach.coachId} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">{coach.name}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{coach.email}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{coach.phoneNumber}</td>
                          <td className="py-4 px-6">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${coach.softDelete ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                {coach.softDelete ? 'Frozen' : 'Active'}
                             </span>
                          </td>
                          <td className="py-4 px-6">
                             <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openModal(coach)}
                                  className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                   <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => toggleFreezeCoach(coach.coachId, coach.softDelete ? "restore" : "delete")}
                                  className={`p-1.5 rounded-lg transition-colors ${coach.softDelete ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                                  title={coach.softDelete ? "Unfreeze" : "Freeze"}
                                >
                                   <SlashCircle size={16} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           {filteredCoaches.length === 0 && (
              <div className="p-8 text-center text-gray-500">No coaches found.</div>
           )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100 max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900">{selectedCoach ? "Edit Coach" : "Add Coach"}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                     <input
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        value={newCoach.name}
                        onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
                     />
                     {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                     <input
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        value={newCoach.email}
                        onChange={(e) => setNewCoach({ ...newCoach, email: e.target.value })}
                     />
                     {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                     <input
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        value={newCoach.phoneNumber}
                        onChange={(e) => setNewCoach({ ...newCoach, phoneNumber: e.target.value })}
                     />
                     {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Gender</label>
                        <select
                           className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                           value={newCoach.gender}
                           onChange={(e) => setNewCoach({ ...newCoach, gender: e.target.value })}
                        >
                           <option value="">Select</option>
                           <option value="male">Male</option>
                           <option value="female">Female</option>
                           <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase">Sport</label>
                        <select
                           className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                           value={newCoach.sport}
                           onChange={(e) => setNewCoach({ ...newCoach, sport: e.target.value })}
                        >
                           <option value="Cricket">Cricket</option>
                        </select>
                        {errors.sport && <p className="text-xs text-red-500">{errors.sport}</p>}
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-500 uppercase">Password</label>
                     <input
                        type="password"
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        value={newCoach.password}
                        onChange={(e) => setNewCoach({ ...newCoach, password: e.target.value })}
                     />
                     {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  </div>

                  <div className="pt-4 flex gap-3">
                     <button
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                     >
                        {selectedCoach ? "Update Coach" : "Add Coach"}
                     </button>
                     <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                     >
                        Cancel
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </AdminShell>
  );
}
