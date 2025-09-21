import admin from 'firebase-admin';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountEnv = process.env.SERVICE_ACCOUNT_KEY;
if (!serviceAccountEnv) {
  throw new Error('SERVICE_ACCOUNT_KEY environment variable not found!');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountEnv);
} catch (err) {
  console.error('Failed to parse SERVICE_ACCOUNT_KEY JSON:', err);
  throw err;
}

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
const tempPath = join(__dirname, 'tempServiceAccount.json');
fs.writeFileSync(tempPath, JSON.stringify(serviceAccount));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(tempPath),
  });
}

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const isBusinessUser = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userRecord = await admin.auth().getUser(uid);
    if (userRecord.customClaims?.role === 'business') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Business access required' });
    }
  } catch (error) {
    console.error('Error checking business role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const isRegularUser = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userRecord = await admin.auth().getUser(uid);
    if (userRecord.customClaims?.role === 'user') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: User access required' });
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};