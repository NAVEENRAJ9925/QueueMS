import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Search, ClipboardList, Clock } from 'lucide-react';
import QueueCard from '../../components/QueueCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllQueues, getUserJoinedQueues } from '../../services/api';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('available');
  const [allQueues, setAllQueues] = useState([]);
  const [joinedQueues, setJoinedQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  
  useEffect(() => {
    console.log('Current User:', currentUser); // Add this line
    const fetchQueues = async () => {
      try {
        setLoading(true);
        
        // Fetch all available queues
        const fetchedQueues = await getAllQueues();
        setAllQueues(fetchedQueues);
        
        // Fetch queues the user has joined
        if (currentUser) {
          const userQueues = await getUserJoinedQueues(currentUser.uid);
          setJoinedQueues(userQueues);
        }
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
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filterQueues = (queues) => {
    if (!searchQuery) return queues;
    
    return queues.filter(queue => 
      queue.queueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (queue.businessName && queue.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (queue.description && queue.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  
  const filteredQueues = filterQueues(activeTab === 'available' ? allQueues : joinedQueues);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow">User Dashboard</h1>
        <p className="text-slate-200 mt-1">Find and join queues or check your position</p>
      </div>
      
      {/* Search and Tab Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-300" />
          </div>
          <input
            type="text"
            placeholder="Search queues..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 pr-3 py-2 w-full rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-300/50"
          />
        </div>
        
        <div className="flex w-full md:w-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex items-center px-4 py-2 rounded-md flex-1 md:flex-none ${
              activeTab === 'available'
                ? 'glass-dark text-white'
                : 'glass-dark text-slate-200'
            }`}
          >
            <ClipboardList className="h-5 w-5 mr-2" />
            Available Queues
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex items-center px-4 py-2 rounded-md ml-2 flex-1 md:flex-none ${
              activeTab === 'joined'
                ? 'glass-dark text-white'
                : 'glass-dark text-slate-200'
            }`}
          >
            <Clock className="h-5 w-5 mr-2" />
            My Queues
          </button>
        </div>
      </div>
      
      {/* Queue Listings */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <LoadingSpinner size="large" />
        </div>
      ) : filteredQueues.length === 0 ? (
        <div className="glass-dark rounded-lg neon-shadow p-8 text-center">
          <p className="text-slate-200 mb-4">
            {activeTab === 'available' 
              ? searchQuery 
                ? 'No queues match your search.' 
                : 'No available queues at the moment.'
              : 'You haven\'t joined any queues yet.'}
          </p>
          {activeTab === 'joined' && (
            <button 
              onClick={() => setActiveTab('available')}
              className="text-sky-300 hover:text-white"
            >
              Browse available queues
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQueues.map(queue => (
            <QueueCard key={queue._id} queue={queue} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;