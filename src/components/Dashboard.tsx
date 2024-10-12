import React, { useState, useEffect } from 'react';
import { BarChart, Users, MessageSquare, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface DashboardData {
  totalUsers: number;
  activeConversations: number;
  satisfactionRate: string;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulating API call to Chatwoot
        const response = await axios.get('https://api.chatwoot.com/api/v1/dashboard', {
          headers: { 'api-access-token': 'YOUR_CHATWOOT_API_TOKEN' }
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('User not found. Please check your Chatwoot account.');
          } else if (err.response?.status === 401) {
            setError('Authentication failed. Please check your API token.');
          } else if (err.code === 'ECONNABORTED') {
            setError('Connection timed out. Please try again later.');
          } else {
            setError('Failed to fetch dashboard data. Please try again.');
          }
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data) {
    return <ErrorMessage message="No data available. Please check your Chatwoot connection." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          icon={<Users className="w-8 h-8 text-blue-500" />} 
          title="Total Users" 
          value={data.totalUsers.toString()} 
        />
        <DashboardCard 
          icon={<MessageSquare className="w-8 h-8 text-green-500" />} 
          title="Active Conversations" 
          value={data.activeConversations.toString()} 
        />
        <DashboardCard 
          icon={<BarChart className="w-8 h-8 text-purple-500" />} 
          title="Satisfaction Rate" 
          value={data.satisfactionRate} 
        />
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{ icon: React.ReactNode; title: string; value: string }> = ({ icon, title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <h2 className="ml-3 text-xl font-semibold text-gray-700">{title}</h2>
        </div>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
      </div>
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
    <div className="flex">
      <div className="py-1">
        <AlertCircle className="h-6 w-6 text-red-500 mr-4" />
      </div>
      <div>
        <p className="font-bold">Error</p>
        <p>{message}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;