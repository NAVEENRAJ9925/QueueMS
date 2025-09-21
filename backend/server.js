import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Routes
import queueRoutes from './routes/queueRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Firebase Auth Middleware
import { verifyToken } from './middleware/auth.js';

// Initialize
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartqueue")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/queues', verifyToken, queueRoutes);
app.use('/api/users', verifyToken, userRoutes);

// Serve static assets for frontend (React SPA)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = join(__dirname, '../dist');
  app.use(express.static(frontendPath));

  // Catch-all route for SPA
  app.get('*', (req, res) => {
    res.sendFile(join(frontendPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
