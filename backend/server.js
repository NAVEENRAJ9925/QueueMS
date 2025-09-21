// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import admin from 'firebase-admin';

// Routes
import queueRoutes from './routes/queueRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Firebase Auth Middleware
import { verifyToken } from './middleware/auth.js';

// Initialize dotenv
dotenv.config();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartqueue")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Firebase Admin SDK initialization
if (!admin.apps.length) {
  // Create temporary service account JSON file from env variable
  const serviceAccountContent = process.env.SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n');
  const tempPath = join(__dirname, 'tempServiceAccount.json');
  fs.writeFileSync(tempPath, serviceAccountContent);

  admin.initializeApp({
    credential: admin.credential.cert(tempPath),
  });
}

// API Routes
app.use('/api/queues', verifyToken, queueRoutes);
app.use('/api/users', verifyToken, userRoutes);

// Serve React SPA in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = join(__dirname, '../dist');
  app.use(express.static(frontendPath));

  // Correct catch-all for SPA
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
