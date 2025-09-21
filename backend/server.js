import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import admin from 'firebase-admin';

import queueRoutes from './routes/queueRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- MONGODB CONNECTION -------------------
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartqueue')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ------------------- FIREBASE ADMIN -------------------
if (!admin.apps.length) {
  if (!process.env.SERVICE_ACCOUNT_KEY) {
    throw new Error('SERVICE_ACCOUNT_KEY environment variable not found!');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
  } catch (err) {
    console.error('Failed to parse SERVICE_ACCOUNT_KEY JSON:', err);
    throw err;
  }

  // Fix newlines in private key
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  // Write temporary JSON file
  const tempPath = join(__dirname, 'tempServiceAccount.json');
  fs.writeFileSync(tempPath, JSON.stringify(serviceAccount));

  admin.initializeApp({
    credential: admin.credential.cert(tempPath),
  });
}

// ------------------- API ROUTES -------------------
app.use('/api/queues', verifyToken, queueRoutes);
app.use('/api/users', verifyToken, userRoutes);

// ------------------- PRODUCTION SPA -------------------
if (process.env.NODE_ENV === 'production') {
  const frontendPath = join(__dirname, '../dist');
  app.use(express.static(frontendPath));

  // Catch-all route for React SPA
  app.get('*', (req, res) => {
    res.sendFile(join(frontendPath, 'index.html'));
  });
}

// ------------------- GLOBAL ERROR HANDLER -------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ------------------- START SERVER -------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
