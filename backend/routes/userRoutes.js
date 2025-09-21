import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user is requesting their own data
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update user profile
router.post('/profile', verifyToken, async (req, res) => {
  try {
    const { userId, displayName, email, role } = req.body;
    
    // Verify user is updating their own data
    if (req.user.uid !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    let user = await User.findOne({ userId });
    
    if (user) {
      // Update existing user
      user.displayName = displayName;
      user.email = email;
      user.role = role;
    } else {
      // Create new user
      user = new User({
        userId,
        displayName,
        email,
        role,
        createdAt: new Date()
      });
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;