import express from 'express';
import Queue from '../models/Queue.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all available queues
router.get('/available', async (req, res) => {
  try {
    const queues = await Queue.find({ isActive: true });
    res.json(queues);
  } catch (error) {
    console.error('Error fetching available queues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get queues for a specific business
router.get('/:businessId', verifyToken, async (req, res) => {
  try {
    const { businessId } = req.params;
    
    // Verify user is the business owner
    if (req.user.uid !== businessId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const queues = await Queue.find({ businessId });
    res.json(queues);
  } catch (error) {
    console.error('Error fetching business queues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get queues that a user has joined
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user is requesting their own data
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const queues = await Queue.find({ 'usersInQueue.userId': userId });
    res.json(queues);
  } catch (error) {
    console.error('Error fetching user queues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get details for a specific queue
router.get('/details/:queueId', async (req, res) => {
  try {
    const { queueId } = req.params;
    const queue = await Queue.findById(queueId);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    res.json(queue);
  } catch (error) {
    console.error('Error fetching queue details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user position in queue
router.get('/:queueId/position/:userId', verifyToken, async (req, res) => {
  try {
    const { queueId, userId } = req.params;
    
    // Verify user is requesting their own data
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const queue = await Queue.findById(queueId);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    const userIndex = queue.usersInQueue.findIndex(user => user.userId === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not in queue', position: -1 });
    }
    
    res.json({ position: userIndex + 1 });
  } catch (error) {
    console.error('Error fetching user position:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new queue
router.post('/create', verifyToken, async (req, res) => {
  try {
    const { businessId, queueName, description, estimatedWaitTime, maxCapacity, businessName } = req.body;
    
    // Verify user is the business owner
    if (req.user.uid !== businessId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const newQueue = new Queue({
      businessId,
      businessName,
      queueName,
      description,
      estimatedWaitTime,
      maxCapacity,
      isActive: true,
      usersInQueue: [],
      currentToken: 0,
      createdAt: new Date()
    });
    
    const savedQueue = await newQueue.save();
    res.status(201).json(savedQueue);
  } catch (error) {
    console.error('Error creating queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a queue
router.put('/:queueId/update', verifyToken, async (req, res) => {
  try {
    const { queueId } = req.params;
    const updateData = req.body;
    
    const queue = await Queue.findById(queueId);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    // Verify user is the business owner
    if (req.user.uid !== queue.businessId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const updatedQueue = await Queue.findByIdAndUpdate(
      queueId,
      { $set: updateData },
      { new: true }
    );
    
    res.json(updatedQueue);
  } catch (error) {
    console.error('Error updating queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a queue
router.post('/:queueId/join', verifyToken, async (req, res) => {
  try {
    const { queueId } = req.params;
    const { userId, userName, userEmail } = req.body;
    
    // Verify user is joining with their own ID
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const queue = await Queue.findById(queueId);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    if (!queue.isActive) {
      return res.status(400).json({ message: 'Queue is not active' });
    }
    
    // Check if user is already in queue
    const userInQueue = queue.usersInQueue.find(user => user.userId === userId);
    if (userInQueue) {
      return res.status(400).json({ message: 'User already in queue' });
    }
    
    // Check if queue is at capacity
    if (queue.usersInQueue.length >= queue.maxCapacity) {
      return res.status(400).json({ message: 'Queue is at maximum capacity' });
    }
    
    // Add user to queue
    queue.usersInQueue.push({
      userId,
      userName,
      userEmail,
      joinedAt: new Date()
    });
    
    await queue.save();
    res.status(200).json(queue);
  } catch (error) {
    console.error('Error joining queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a queue
router.post('/:queueId/leave/:userId', verifyToken, async (req, res) => {
  try {
    const { queueId, userId } = req.params;
    
    // Verify user is leaving with their own ID
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const queue = await Queue.findById(queueId);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    // Remove user from queue
    queue.usersInQueue = queue.usersInQueue.filter(user => user.userId !== userId);
    
    await queue.save();
    res.status(200).json({ message: 'Successfully left queue' });
  } catch (error) {
    console.error('Error leaving queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a user from queue (business owner only)
router.delete('/:queueId/user/:userId', verifyToken, async (req, res) => {
  try {
    const { queueId, userId } = req.params;
    
    const queue = await Queue.findById(queueId);
    
    if (!queue) {
      return res.status(404).json({ message: 'Queue not found' });
    }
    
    // Verify user is the business owner
    if (req.user.uid !== queue.businessId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Remove user from queue
    queue.usersInQueue = queue.usersInQueue.filter(user => user.userId !== userId);
    
    // Increment customers served count
    queue.customersServed += 1;
    
    await queue.save();
    res.status(200).json(queue);
  } catch (error) {
    console.error('Error removing user from queue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;