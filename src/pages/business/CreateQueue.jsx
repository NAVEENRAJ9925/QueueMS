import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Clock, Users, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { createQueue } from '../../services/api';

function CreateQueue() {
  const [queueName, setQueueName] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(5);
  const [maxCapacity, setMaxCapacity] = useState(50);
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!queueName) {
      addToast('Please enter a queue name', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      const newQueue = {
        queueName,
        description,
        estimatedWaitTime: parseInt(estimatedWaitTime),
        maxCapacity: parseInt(maxCapacity),
        businessId: currentUser.uid,
        businessName: currentUser.displayName,
        isActive: true,
        usersInQueue: [],
        currentToken: 0,
        createdAt: new Date().toISOString()
      };
      
      await createQueue(newQueue);
      addToast('Queue created successfully!', 'success');
      navigate('/business');
      
    } catch (error) {
      console.error('Error creating queue:', error);
      addToast('Failed to create queue', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/business')}
        className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Create New Queue</h1>
          <p className="text-gray-400">Set up a new queue for your customers</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="queueName" className="block text-sm font-medium text-gray-300 mb-1">
              Queue Name *
            </label>
            <input
              type="text"
              id="queueName"
              value={queueName}
              onChange={(e) => setQueueName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-100 placeholder-gray-400"
              placeholder="E.g. Checkout Counter 1, Doctor Consultation"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-100 placeholder-gray-400"
              placeholder="Optional: Add details about this queue"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="estimatedWaitTime" className="block text-sm font-medium text-gray-300 mb-1">
                Estimated Wait Time (minutes per person)
              </label>
              <div className="flex items-center">
                <div className="relative flex items-center flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="estimatedWaitTime"
                    min="1"
                    max="60"
                    value={estimatedWaitTime}
                    onChange={(e) => setEstimatedWaitTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-100"
                  />
                </div>
                <span className="ml-2 text-gray-300">min</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-300 mb-1">
                Maximum Capacity
              </label>
              <div className="flex items-center">
                <div className="relative flex items-center flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    id="maxCapacity"
                    min="1"
                    max="1000"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-800 text-gray-100"
                  />
                </div>
                <span className="ml-2 text-gray-300">people</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate('/business')}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Creating...</span>
                </>
              ) : (
                'Create Queue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQueue;