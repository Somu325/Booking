
'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from "../../config";
import AdminShell from '../../Layout/AdminShell';
import { Search, Plus, X, Pencil, Eye, SlashCircle } from 'react-bootstrap-icons';

interface User {
  verified: any;
  userId: string;
  name: string;
  email: string;
  mobileNumber: string;
  age: number;
  status: string;
  softDelete: boolean;
}

export default function ManageUser() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    mobileNo: '',
    password: ''
  });
  const [editableValidationErrors, setEditableValidationErrors] = useState({
    name: '',
    email: '',
    mobileNo: '',
  });
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${Domain_URL}/user/users`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setValidationErrors({ name: '', email: '', mobileNo: '', password: '' });
  };

  const handleAddUser = async () => {
    const errors = { name: '', email: '', mobileNo: '', password: '' };
    let isValid = true;

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      errors.name = "Please enter a valid name (letters and spaces only).";
      isValid = false;
    }

    const mobileRegex = /^[1-9][0-9]{9}$/;
    if (!mobileRegex.test(mobileNo)) {
      errors.mobileNo = "Please enter a valid 10-digit mobile number that does not start with 0.";
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z]+[0-9]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email.";
      isValid = false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,16}$/;
    if (!passwordRegex.test(password)) {
      errors.password = "Password must be 8-16 characters, include uppercase, lowercase, a number, and a special character.";
      isValid = false;
    }

    setValidationErrors(errors);

    if (!isValid) return;

    const newUser = {
      name,
      email,
      mobileNumber: mobileNo,
      password,
    };

    try {
      const response = await axios.post(`${Domain_URL}/user/signup`, newUser, {
        headers: { "Content-Type": "application/json" },
      });

      const updatedUsers = [...users, response.data];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      setOpen(false);
      setName('');
      setEmail('');
      setMobileNo('');
      setPassword('');
      setValidationErrors({ name: '', email: '', mobileNo: '', password: '' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          setValidationErrors((prev) => ({ ...prev, email: "This email is already registered." }));
        } else if (error.response && error.response.data) {
          alert(`Error: ${error.response.data.error || "An error occurred."}`);
        } else {
          alert("An unexpected error occurred. Please try again later.");
        }
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setPage(0);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
    setIsEditing(false);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditableUser({ ...user });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSoftDelete = async (userId: string, isSoftDeleted: boolean) => {
    try {
      const newStatus = !isSoftDeleted;
      await axios.patch(`${Domain_URL}/user/users/${userId}/softDelete`, { isSoftDeleted: newStatus });

      const updatedUsers = users.map((user) =>
        user.userId === userId ? { ...user, softDelete: newStatus } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      if (selectedUser?.userId === userId) {
        setSelectedUser({ ...selectedUser, softDelete: newStatus });
      }
    } catch (error) {
      console.error("Error updating soft delete status:", error);
    }
  };

  const handleSave = async () => {
    if (editableUser) {
      const errors = { name: '', email: '', mobileNo: '' };
      let isValid = true;

      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(editableUser.name)) {
        errors.name = "Please enter a valid name.";
        isValid = false;
      }

      const mobileRegex = /^[1-9][0-9]{9}$/;
      if (!mobileRegex.test(editableUser.mobileNumber)) {
        errors.mobileNo = "Please enter a valid 10-digit mobile number.";
        isValid = false;
      }

      const emailRegex = /^[a-zA-Z]+[0-9]+@gmail\.com$/;
      if (!emailRegex.test(editableUser.email)) {
        errors.email = "Please enter a valid email.";
        isValid = false;
      }

      setEditableValidationErrors(errors);

      if (!isValid) return;

      try {
        await axios.put(`${Domain_URL}/user/id/${editableUser.userId}`, editableUser);
        const updatedUsers = users.map(user =>
          user.userId === editableUser.userId ? editableUser : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setShowModal(false);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <AdminShell title="Manage Users">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
           <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="text-gray-400" size={16} />
              </div>
              <input
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearch}
              />
           </div>
           <button
             onClick={() => setOpen(true)}
             className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
           >
             <Plus size={18} /> Add User
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
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                       <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">{user.name}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{user.mobileNumber}</td>
                          <td className="py-4 px-6">
                             <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSoftDelete(user.userId, user.softDelete)}
                                  className={`p-1.5 rounded-lg transition-colors ${user.softDelete ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                                  title={user.softDelete ? "Unfreeze" : "Freeze"}
                                >
                                   <SlashCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleViewDetails(user)}
                                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View"
                                >
                                   <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleEditClick(user)}
                                  className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                   <Pencil size={16} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">No users found.</div>
           )}
        </div>

        {/* Add User Modal */}
        {open && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Add User</h3>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                       <input
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                       />
                       {validationErrors.name && <p className="text-xs text-red-500">{validationErrors.name}</p>}
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                       <input
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                       />
                       {validationErrors.email && <p className="text-xs text-red-500">{validationErrors.email}</p>}
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-500 uppercase">Mobile No</label>
                       <input
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={mobileNo}
                          onChange={(e) => setMobileNo(e.target.value)}
                       />
                       {validationErrors.mobileNo && <p className="text-xs text-red-500">{validationErrors.mobileNo}</p>}
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-500 uppercase">Password</label>
                       <input
                          type="password"
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                       />
                       {validationErrors.password && <p className="text-xs text-red-500">{validationErrors.password}</p>}
                    </div>
                    <div className="pt-4 flex gap-3">
                       <button
                          onClick={handleAddUser}
                          className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                       >
                          Add
                       </button>
                       <button
                          onClick={handleClose}
                          className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                       >
                          Cancel
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Edit/View User Modal */}
        {showModal && selectedUser && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-100">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{isEditing ? "Edit User" : "User Details"}</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                 </div>

                 {isEditing && editableUser ? (
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                          <input
                             className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                             value={editableUser.name}
                             onChange={(e) => setEditableUser({ ...editableUser, name: e.target.value })}
                          />
                          {editableValidationErrors.name && <p className="text-xs text-red-500">{editableValidationErrors.name}</p>}
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                          <input
                             className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                             value={editableUser.email}
                             onChange={(e) => setEditableUser({ ...editableUser, email: e.target.value })}
                          />
                          {editableValidationErrors.email && <p className="text-xs text-red-500">{editableValidationErrors.email}</p>}
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase">Mobile Number</label>
                          <input
                             className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                             value={editableUser.mobileNumber}
                             onChange={(e) => setEditableUser({ ...editableUser, mobileNumber: e.target.value })}
                          />
                          {editableValidationErrors.mobileNo && <p className="text-xs text-red-500">{editableValidationErrors.mobileNo}</p>}
                       </div>
                       <div className="pt-4 flex gap-3">
                          <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Save</button>
                          <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-4 text-sm">
                       <div className="flex justify-between border-b border-gray-50 pb-2">
                          <span className="text-gray-500">Name</span>
                          <span className="font-medium text-gray-900">{selectedUser.name}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-2">
                          <span className="text-gray-500">Email</span>
                          <span className="font-medium text-gray-900">{selectedUser.email}</span>
                       </div>
                       <div className="flex justify-between border-b border-gray-50 pb-2">
                          <span className="text-gray-500">Mobile</span>
                          <span className="font-medium text-gray-900">{selectedUser.mobileNumber}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-gray-500">Account Status</span>
                          <span className={`font-medium ${selectedUser.softDelete ? 'text-red-600' : 'text-green-600'}`}>
                             {selectedUser.softDelete ? 'Frozen' : 'Active'}
                          </span>
                       </div>
                       <div className="pt-4">
                          <button onClick={() => setShowModal(false)} className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Close</button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>
    </AdminShell>
  );
}
