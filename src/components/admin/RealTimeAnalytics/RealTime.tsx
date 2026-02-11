
'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Domain_URL } from "../../config";
import { useNavigate } from 'react-router-dom';
import AdminShell from '../../Layout/AdminShell';
import { People, Activity, CalendarCheck } from 'react-bootstrap-icons';

interface User {
  userId: string;
  name: string;
  gender: string;
  mobileNumber: string;
  email: string;
}

export default function RealTime() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeSessions, setActiveSessions] = useState<number>(0);
  const [bookedSlots, setBookedSlots] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [userDetails, setUserDetails] = useState<User[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const usersResponse = await axios.get(`${Domain_URL}/user/count`);
        setTotalUsers(usersResponse.data.count);

        const sessionsResponse = await axios.get(`${Domain_URL}/bookings/progress/count`);
        setActiveSessions(sessionsResponse.data.count);

        const slotsResponse = await axios.get(`${Domain_URL}/slot/booked/count`);
        setBookedSlots(slotsResponse.data.count);

        const userDetailsResponse = await axios.get(`${Domain_URL}/user/users`);
        const sortedUserDetails = userDetailsResponse.data.sort((a: User, b: User) =>
          a.name.localeCompare(b.name)
        );
        setUserDetails(sortedUserDetails);
      } catch (error: any) {
        console.error('Error fetching user data: ', error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <AdminShell title="Analytics">
        <div className="flex justify-center items-center h-64">
           <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Analytics">
      <div className="space-y-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <People size={24} />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Activity size={24} />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                    <h3 className="text-2xl font-bold text-gray-900">{activeSessions}</h3>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <CalendarCheck size={24} />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-gray-500">Booked Slots</p>
                    <h3 className="text-2xl font-bold text-gray-900">{bookedSlots}</h3>
                 </div>
              </div>
           </div>
        </div>

        {/* User Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">User Details</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                       <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {userDetails.length > 0 ? (
                       userDetails.map((user) => (
                          <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                             <td className="py-4 px-6 text-sm text-gray-900 font-medium capitalize">{user.name}</td>
                             <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                             <td className="py-4 px-6 text-sm text-gray-600">{user.mobileNumber}</td>
                          </tr>
                       ))
                    ) : (
                       <tr>
                          <td colSpan={3} className="py-8 text-center text-gray-500">No user details available.</td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </AdminShell>
  );
}
