import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
  businessId: {
    type: String,
    required: true,
    index: true
  },
  businessName: {
    type: String,
    required: true
  },
  queueName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  estimatedWaitTime: {
    type: Number,
    default: 5 // minutes per person
  },
  maxCapacity: {
    type: Number,
    default: 50
  },
  currentToken: {
    type: Number,
    default: 0
  },
  customersServed: {
    type: Number,
    default: 0
  },
  usersInQueue: [
    {
      userId: {
        type: String,
        required: true
      },
      userName: {
        type: String
      },
      userEmail: {
        type: String
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
QueueSchema.index({ businessId: 1, isActive: 1 });

const Queue = mongoose.model('Queue', QueueSchema);

export default Queue;