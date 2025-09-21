import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ArrowLeft, Clock, Users, CheckCircle, X } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getQueueDetails, joinQueue, getUserPositionInQueue, leaveQueue } from '../../services/api';

function JoinQueue() {
  const { queueId } = useParams();
  const [queue, setQueue] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQueueDetails = async () => {
      try {
        setLoading(true);
        const queueData = await getQueueDetails(queueId);
        setQueue(queueData);
        
        // Check if user has already joined this queue
        if (currentUser) {
          try {
            const position = await getUserPositionInQueue(queueId, currentUser.uid);
            if (position && position.position !== -1) {
              setUserPosition(position.position);
              setHasJoined(true);
            }
          } catch (error) {
            // User hasn't joined this queue yet
            setHasJoined(false);
          }
        }
      } catch (error) {
        console.error('Error fetching queue details:', error);
        addToast('Failed to load queue details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (queueId && currentUser) {
      fetchQueueDetails();
    }
  }, [queueId, currentUser, addToast]);
  
  const handleJoinQueue = async () => {
    try {
      setJoining(true);
      
      const userData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email,
        joinedAt: new Date().toISOString()
      };
      
      await joinQueue(queueId, userData);
      
      // Get updated position
      const position = await getUserPositionInQueue(queueId, currentUser.uid);
      setUserPosition(position.position);
      setHasJoined(true);
      
      addToast('Successfully joined the queue!', 'success');
    } catch (error) {
      console.error('Error joining queue:', error);
      addToast('Failed to join queue', 'error');
    } finally {
      setJoining(false);
    }
  };
  
  const handleLeaveQueue = async () => {
    try {
      setLeaving(true);
      
      await leaveQueue(queueId, currentUser.uid);
      
      setHasJoined(false);
      setUserPosition(null);
      
      addToast('You have left the queue', 'success');
    } catch (error) {
      console.error('Error leaving queue:', error);
      addToast('Failed to leave queue', 'error');
    } finally {
      setLeaving(false);
    }
  };
  
  const calculateEstimatedTime = () => {
    if (!queue) return 0;
    
    const waitTime = queue.estimatedWaitTime || 5; // Default 5 minutes per person
    return waitTime * (userPosition - 1);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!queue) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-white drop-shadow mb-4">Queue not found</h2>
        <button
          onClick={() => navigate('/user')}
          className="flex items-center text-sky-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (queue.isActive === false) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/user')}
          className="flex items-center text-sky-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <div className="glass-dark rounded-lg neon-shadow p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-400/20 border border-rose-200/30 text-rose-100 rounded-full mb-4">
            <X className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white drop-shadow mb-2">Queue is Currently Closed</h2>
          <p className="text-slate-200 mb-6">
            This queue is not accepting new customers at the moment. Please check back later or try another queue.
          </p>
          <Link
            to="/user"
            className="inline-flex items-center px-4 py-2 glass-dark glass-border text-white rounded-md transition-transform-shadow glass-hover"
          >
            Browse Other Queues
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/user')}
        className="flex items-center text-sky-300 hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>
      
      <div className="glass-dark rounded-lg neon-shadow overflow-hidden">
        <div className="glass-dark text-white p-6">
          <h1 className="text-2xl font-bold mb-1">{queue.queueName}</h1>
          <p className="text-slate-200">{queue.businessName}</p>
        </div>
        
        <div className="p-6">
          {queue.description && (
            <div className="mb-6 text-slate-200">
              <h3 className="text-lg font-medium text-white drop-shadow mb-2">About this Queue</h3>
              <p>{queue.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="glass-dark p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-sky-300 mr-2" />
                <span className="text-slate-200">People in Queue</span>
              </div>
              <p className="text-3xl font-bold text-white mt-2">{queue.usersInQueue?.length || 0}</p>
            </div>
            
            <div className="glass-dark p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-sky-300 mr-2" />
                <span className="text-slate-200">Estimated Wait Time</span>
              </div>
              <p className="text-3xl font-bold text-white mt-2">
                {queue.estimatedWaitTime || 5} min per person
              </p>
            </div>
          </div>
          
          {hasJoined ? (
            <div className="glass-dark rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-400/20 text-emerald-200 border border-emerald-200/30 rounded-full mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-white drop-shadow mb-2">You're in the Queue!</h2>
              <p className="text-slate-200 mb-2">Your position: <span className="font-bold text-xl text-white">{userPosition}</span></p>
              <p className="text-slate-200 mb-6">
                Estimated wait time: <span className="font-bold">{calculateEstimatedTime()} minutes</span>
              </p>
              <button
                onClick={handleLeaveQueue}
                disabled={leaving}
                className="inline-flex items-center px-4 py-2 glass-dark glass-border text-white rounded-md transition-transform-shadow glass-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {leaving ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Leaving...</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Leave Queue
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-200 mb-6">
                Join this queue to secure your spot and get notified when it's your turn.
              </p>
              <button
                onClick={handleJoinQueue}
                disabled={joining}
                className="inline-flex items-center px-6 py-3 glass-dark glass-border text-white rounded-md transition-transform-shadow glass-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Joining...</span>
                  </>
                ) : (
                  'Join Queue'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JoinQueue;