
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Domain_URL } from "../../config";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { X, Search } from 'react-bootstrap-icons';
import AdminShell from '../../Layout/AdminShell';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonthlyBooking {
  month: string;
  totalBookings: number;
}

interface BookingTrend {
  month: string;
  completed: number;
  canceled: number;
}

interface Booking {
  id: string;
  bookingId: string;
  userName: string;
  childName: string;
  coachName: string;
  date: string;
  status: string;
}

export default function AdminOverview() {
  const navigate = useNavigate();

  const [totalBookings, setTotalBookings] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState<MonthlyBooking[]>([]);
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const formatDateToCST = (dateString: string) => {
    const date = new Date(dateString);
    const isDST = date.getMonth() > 2 && date.getMonth() < 11;
    const timeZoneOffset = isDST ? 5 : 6;
    date.setHours(date.getHours() - timeZoneOffset);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('en-US');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const bookingsResponse = await axios.get(`${Domain_URL}/monthly-bookings`);
      const trendsResponse = await axios.get(`${Domain_URL}/booking-trends`);
      const listResponse = await axios.get(`${Domain_URL}/bookingsName`);
      const currentMonthUTC = new Date().getUTCMonth();

      const formattedTrends = trendsResponse.data
        .filter((t: { month: string }) => new Date(t.month).getUTCMonth() === currentMonthUTC)
        .map((t: { month: string; completed: string; canceled: string }) => ({
          month: new Date(t.month).toLocaleString('default', { month: 'long', timeZone: 'UTC' }),
          completed: parseInt(t.completed, 10),
          canceled: parseInt(t.canceled, 10),
        }));

      const formattedBookings = bookingsResponse.data.map((booking: { month: string; totalBookings: number }) => ({
        month: new Date(booking.month).toLocaleString('default', { month: 'long', timeZone: 'UTC' }),
        totalBookings: booking.totalBookings,
      }));

      setMonthlyBookings(formattedBookings);
      setBookingTrends(formattedTrends);
      setBookingList(listResponse.data);
      setTotalBookings(listResponse.data.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const barDataMonthly = {
    labels: monthlyBookings.map((data) => data.month),
    datasets: [
      {
        label: 'Total Bookings',
        data: monthlyBookings.map((data) => data.totalBookings),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  const barDataTrends = {
    labels: bookingTrends.map((trend) => trend.month),
    datasets: [
      {
        label: 'Completed Bookings',
        data: bookingTrends.map((trend) => trend.completed),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const filteredBookings = bookingList.filter((booking) =>
    (booking.coachName?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (booking.userName?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <AdminShell title="Overview">
        <div className="flex justify-center items-center h-64">
           <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Overview">
      <div className="space-y-8">

        {/* Stats Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
           <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Bookings</h2>
           <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Total Bookings</h3>
            <div className="h-[300px]">
              <Bar data={barDataMonthly} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Trends</h3>
            <div className="h-[300px]">
              <Bar data={barDataTrends} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Booking List</h3>
              <div className="relative w-64">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={14} />
                 </div>
                 <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search coach or user..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span className="text-gray-500">User</span>
                           <span className="font-medium text-gray-900">{booking.userName}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-500">Child</span>
                           <span className="font-medium text-gray-900">{booking.childName}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-500">Coach</span>
                           <span className="font-medium text-gray-900">{booking.coachName}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                           <span className="text-gray-500">Date</span>
                           <span className="font-medium text-indigo-600">{formatDateToCST(booking.date)}</span>
                        </div>
                     </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                   No bookings found
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                 <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                 <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                   <X size={20} />
                 </button>
              </div>
              <div className="space-y-3">
                 <p className="text-sm"><span className="text-gray-500 block">Booking ID</span> <span className="font-medium">{selectedBooking.bookingId}</span></p>
                 <p className="text-sm"><span className="text-gray-500 block">User Name</span> <span className="font-medium">{selectedBooking.userName}</span></p>
                 <p className="text-sm"><span className="text-gray-500 block">Coach Name</span> <span className="font-medium">{selectedBooking.coachName}</span></p>
                 <p className="text-sm"><span className="text-gray-500 block">Date</span> <span className="font-medium">{formatDateToCST(selectedBooking.date)}</span></p>
                 <p className="text-sm"><span className="text-gray-500 block">Status</span> <span className="font-medium">{selectedBooking.status}</span></p>
              </div>
              <div className="mt-6">
                 <button
                   onClick={() => setSelectedBooking(null)}
                   className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                 >
                   Close
                 </button>
              </div>
           </div>
        </div>
      )}
    </AdminShell>
  );
}
