import { Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function QueueCard({ queue, isBusinessView = false }) {
  const calculateEstimatedTime = () => {
    const waitTime = queue.estimatedWaitTime || 5; // Default 5 minutes per person
    const peopleAhead = queue.usersInQueue?.length || 0;
    return waitTime * peopleAhead;
  };

  return (
    <div className="glass-dark glass-border neon-shadow transition-transform-shadow glass-hover rounded-lg p-6 flex flex-col h-full text-slate-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white drop-shadow">{queue.queueName}</h3>
        {queue.isActive !== false && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/20 text-emerald-200 border border-emerald-200/30">
            Active
          </span>
        )}
        {queue.isActive === false && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-400/20 text-rose-200 border border-rose-200/30">
            Closed
          </span>
        )}
      </div>
      
      <div className="flex items-center mb-3 text-slate-200/90">
        <Users className="h-5 w-5 mr-2 text-sky-300" />
        <span>
          {queue.usersInQueue?.length || 0} {queue.usersInQueue?.length === 1 ? 'person' : 'people'} in queue
        </span>
      </div>
      
      <div className="flex items-center mb-4 text-slate-200/90">
        <Clock className="h-5 w-5 mr-2 text-sky-300" />
        <span>~{calculateEstimatedTime()} min wait time</span>
      </div>
      
      {queue.businessName && (
        <p className="text-slate-300 mb-4">
          <span className="font-medium text-white">Business:</span> {queue.businessName}
        </p>
      )}
      
      {isBusinessView ? (
        <Link 
          to={`/business/queue/${queue._id}`} 
          className="mt-auto flex items-center justify-center py-2 px-4 glass-dark glass-border rounded-md text-white transition-transform-shadow glass-hover"
        >
          Manage Queue
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      ) : (
        <Link 
          to={`/queue/${queue._id}/join`} 
          className="mt-auto flex items-center justify-center py-2 px-4 glass-dark glass-border rounded-md text-white transition-transform-shadow glass-hover"
        >
          Join Queue
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default QueueCard;