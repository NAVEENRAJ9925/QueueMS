import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ArrowLeft, Users, Clock, UserX, Play, Pause, ExternalLink, Edit, Save, X } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getQueueDetails, updateQueue, removeUserFromQueue } from '../../services/api';

function QueueDetails() {
  const { queueId } = useParams();
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQueue, setEditedQueue] = useState({
    queueName: '',
    description: '',
    estimatedWaitTime: 5,
    isActive: true
  });
  
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQueueDetails = async () => {
      try {
        setLoading(true);
        const queueData = await getQueueDetails(queueId);
        
        // Check if current user is the owner of this queue
        if (queueData.businessId !== currentUser.uid) {
          addToast('You do not have permission to view this queue', 'error');
          navigate('/business');
          return;
        }
        
        setQueue(queueData);
        setEditedQueue({
          queueName: queueData.queueName,
          description: queueData.description || '',
          estimatedWaitTime: queueData.estimatedWaitTime || 5,
          isActive: queueData.isActive !== false
        });
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
  }, [queueId, currentUser, addToast, navigate]);
  
  const handleRemoveUser = async (userId) => {
    try {
      await removeUserFromQueue(queueId, userId);
      
      // Update local state
      setQueue(prevQueue => ({
        ...prevQueue,
        usersInQueue: prevQueue.usersInQueue.filter(user => user.userId !== userId)
      }));
      
      addToast('User removed from queue', 'success');
    } catch (error) {
      console.error('Error removing user:', error);
      addToast('Failed to remove user', 'error');
    }
  };
  
  const handleToggleActive = async () => {
    try {
      const updatedQueue = {
        ...queue,
        isActive: !queue.isActive
      };
      
      await updateQueue(queueId, { isActive: !queue.isActive });
      setQueue(updatedQueue);
      addToast(`Queue ${!queue.isActive ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (error) {
      console.error('Error toggling queue status:', error);
      addToast('Failed to update queue status', 'error');
    }
  };
  
  const handleSaveChanges = async () => {
    try {
      await updateQueue(queueId, editedQueue);
      
      // Update local state
      setQueue(prevQueue => ({
        ...prevQueue,
        ...editedQueue
      }));
      
      setIsEditing(false);
      addToast('Queue updated successfully', 'success');
    } catch (error) {
      console.error('Error updating queue:', error);
      addToast('Failed to update queue', 'error');
    }
  };
  
  const calculateWaitTime = (position) => {
    const waitTime = queue?.estimatedWaitTime || 5;
    return position * waitTime;
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Queue not found</h2>
        <button
          onClick={() => navigate('/business')}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/business')}
        className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-500 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          {isEditing ? (
            <div className="w-full md:w-2/3">
              <input
                type="text"
                value={editedQueue.queueName}
                onChange={(e) => setEditedQueue({...editedQueue, queueName: e.target.value})}
                className="w-full px-3 py-2 text-black rounded-md mb-2"
                placeholder="Queue Name"
              />
              <textarea
                value={editedQueue.description}
                onChange={(e) => setEditedQueue({...editedQueue, description: e.target.value})}
                className="w-full px-3 py-2 text-black rounded-md h-20"
                placeholder="Description (optional)"
              ></textarea>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold mb-1">{queue.queueName}</h1>
              <p>{queue.description}</p>
            </div>
          )}
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={handleToggleActive}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    queue.isActive 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {queue.isActive ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-gray-700">People in Queue</span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{queue.usersInQueue?.length || 0}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-gray-700">Wait Time Per Person</span>
              </div>
              {isEditing ? (
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={editedQueue.estimatedWaitTime}
                    onChange={(e) => setEditedQueue({...editedQueue, estimatedWaitTime: parseInt(e.target.value)})}
                    className="w-20 px-2 py-1 text-gray-800 border rounded-md mr-2"
                  />
                  <span className="text-gray-700">minutes</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-800 mt-2">{queue.estimatedWaitTime || 5} min</p>
              )}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-gray-700">Total Wait Time</span>
              </div>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {calculateWaitTime(queue.usersInQueue?.length || 0)} min
              </p>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Queue</h2>
          
          {queue.usersInQueue?.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No customers in queue</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wait Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {queue.usersInQueue.map((user, index) => (
                    <tr key={user.userId} className={index === 0 ? "bg-green-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {index + 1}
                          {index === 0 && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.userName || 'Anonymous'}</div>
                        <div className="text-sm text-gray-500">{user.userEmail || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {calculateWaitTime(index)} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveUser(user.userId)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Queue Link Section */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Queue Link</h3>
            <p className="text-gray-600 mb-4">Share this link with your customers to let them join the queue:</p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={`${window.location.origin}/queue/${queueId}/join`}
                  readOnly
                  className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/queue/${queueId}/join`);
                    addToast('Link copied to clipboard!', 'success');
                  }}
                  className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-100 text-gray-700 rounded-r-md hover:bg-gray-200 transition-colors"
                >
                  Copy
                </button>
              </div>
              
              <a 
                href={`/queue/${queueId}/join`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueDetails;