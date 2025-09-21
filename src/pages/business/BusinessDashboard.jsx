import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Users, Clock, Plus, ChevronRight, BarChart } from 'lucide-react';
import QueueCard from '../../components/QueueCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getBusinessQueues } from '../../services/api';

function BusinessDashboard() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQueues: 0,
    activeQueues: 0,
    totalCustomersServed: 0,
    avgWaitTime: 0
  });
  
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  
  useEffect(() => {
    console.log('Current User:', currentUser); // Add this line
    const fetchQueues = async () => {
      try {
        setLoading(true);
        const fetchedQueues = await getBusinessQueues(currentUser.uid);
        setQueues(fetchedQueues);
        
        // Calculate stats
        setStats({
          totalQueues: fetchedQueues.length,
          activeQueues: fetchedQueues.filter(q => q.isActive !== false).length,
          totalCustomersServed: fetchedQueues.reduce((total, q) => total + (q.customersServed || 0), 0),
          avgWaitTime: fetchedQueues.reduce((total, q) => total + (q.estimatedWaitTime || 5), 0) / (fetchedQueues.length || 1)
        });
      } catch (error) {
        console.error('Error fetching queues:', error);
        addToast('Failed to load queues', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchQueues();
    } else {
      setLoading(false); // Add this to prevent infinite loading when no user
    }
  }, [currentUser, addToast]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow">Business Dashboard</h1>
          <p className="text-slate-200 mt-1">Manage your queues and track customer flow</p>
        </div>
        <Link
          to="/business/create-queue"
          className="glass-dark glass-border text-white px-4 py-2 rounded-md inline-flex items-center mt-4 md:mt-0 transition-transform-shadow glass-hover"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Queue
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-dark p-6 rounded-lg neon-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-300">Total Queues</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalQueues}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-sky-300" />
            </div>
          </div>
        </div>
        
        <div className="glass-dark p-6 rounded-lg neon-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-300">Active Queues</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.activeQueues}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Clock className="h-6 w-6 text-emerald-300" />
            </div>
          </div>
        </div>
        
        <div className="glass-dark p-6 rounded-lg neon-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-300">Customers Served</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.totalCustomersServed}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-orange-300" />
            </div>
          </div>
        </div>
        
        <div className="glass-dark p-6 rounded-lg neon-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-300">Avg Wait Time</p>
              <h3 className="text-3xl font-bold text-white mt-1">{Math.round(stats.avgWaitTime)} min</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Clock className="h-6 w-6 text-violet-300" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Queues */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white drop-shadow">Active Queues</h2>
          {queues.length > 0 && (
            <Link to="/business/analytics" className="text-sky-300 hover:text-white flex items-center">
              <span>View All</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner />
          </div>
        ) : queues.length === 0 ? (
          <div className="glass-dark rounded-lg neon-shadow p-6 text-center">
            <p className="text-slate-200 mb-4">You don't have any queues yet.</p>
            <Link
              to="/business/create-queue"
              className="inline-flex items-center text-sky-300 hover:text-white"
            >
              <Plus className="h-5 w-5 mr-1" />
              Create your first queue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queues.filter(queue => queue.isActive !== false).slice(0, 3).map(queue => (
              <QueueCard key={queue._id} queue={queue} isBusinessView={true} />
            ))}
          </div>
        )}
      </div>
      
      {/* Customer Analytics Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white drop-shadow">Analytics Overview</h2>
          <Link to="/business/analytics" className="text-sky-300 hover:text-white flex items-center">
            <span>Detailed Analytics</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="glass-dark rounded-lg neon-shadow p-6">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <BarChart className="w-12 h-12 text-sky-300 mx-auto mb-2" />
              <p className="text-slate-200">Analytics dashboard coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDashboard;