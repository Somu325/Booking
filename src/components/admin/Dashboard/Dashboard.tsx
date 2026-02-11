
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { Domain_URL } from "../../config";
import moment from 'moment';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AdminShell from '../../Layout/AdminShell';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Dashboard() {
  const [dailyData, setDailyData] = useState<{ labels: string[]; datasets: { data: number[] }[] }>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [weeklyData, setWeeklyData] = useState<{ labels: string[]; datasets: { data: number[] }[] }>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dailyResponse = await axios.get(`${Domain_URL}/daily`);
        const weeklyResponse = await axios.get(`${Domain_URL}/weekly`);
  
        const dailyCounts = Array(7).fill(0);
        dailyResponse.data.forEach((booking: any) => {
          const bookingDate = new Date(`${booking.day}T00:00:00-06:00`);
          const dayIndex = bookingDate.getDay();
          dailyCounts[dayIndex] += booking.totalBookings;
        });
  
        const dailyChartData = {
          labels: weekdays,
          datasets: [
            {
              label: 'Daily Bookings',
              data: dailyCounts,
              backgroundColor: 'rgba(99, 102, 241, 0.5)', // Indigo-500
              borderColor: 'rgb(99, 102, 241)',
              borderWidth: 1,
            },
          ],
        };
  
        setDailyData(dailyChartData);
  
        const weeklyCounts = weeklyResponse.data.map((booking: any) => booking.totalBookings);
        const weeklyLabels = weeklyResponse.data.map((booking: any) => {
          if (booking.week) {
            let date: Date;
            try {
              date = new Date(booking.week);
              if (isNaN(date.getTime())) {
                date = new Date(`${booking.week}T00:00:00-06:00`);
              }
  
              if (isNaN(date.getTime())) {
                throw new Error(`Invalid date format for week: ${booking.week}`);
              }
  
              const startOfWeek = moment(date).startOf('week');
              const endOfWeek = moment(date).endOf('week');
              return `${startOfWeek.format('MM/DD')} - ${endOfWeek.format('MM/DD')}`;
            } catch (error) {
              console.error('Invalid date:', error);
              return ''; 
            }
          }
          return ''; 
        });
  
        const weeklyChartData = {
          labels: weeklyLabels.filter(Boolean),
          datasets: [
            {
              label: 'Weekly Bookings',
              data: weeklyCounts,
              backgroundColor: 'rgba(16, 185, 129, 0.5)', // Emerald-500
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 1,
            },
          ],
        };
  
        setWeeklyData(weeklyChartData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  return (
    <AdminShell title="Dashboard">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h5 className="text-lg font-bold text-gray-900 mb-6">Daily Bookings</h5>
              <div className="h-[300px]">
                <Bar
                  data={dailyData as any}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                      x: { grid: { display: false } }
                    },
                    plugins: {
                      legend: { display: false }
                    }
                  }}
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h5 className="text-lg font-bold text-gray-900 mb-6">Weekly Bookings</h5>
              <div className="h-[300px]">
                <Bar
                  data={weeklyData as any}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                      x: { grid: { display: false } }
                    },
                    plugins: {
                      legend: { display: false }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

export default Dashboard;
