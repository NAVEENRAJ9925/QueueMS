import admin from 'firebase-admin';

// Parse the Firebase service account from environment variable
const serviceAccount = JSON.parse(
  process.env.SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n')
);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Middleware to verify Firebase token
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

// Middleware to check if user is a business
export const isBusinessUser = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userRecord = await admin.auth().getUser(uid);

    if (userRecord.customClaims && userRecord.customClaims.role === 'business') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Business access required' });
    }
  } catch (error) {
    console.error('Error checking business role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is a regular user
export const isRegularUser = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userRecord = await admin.auth().getUser(uid);

    if (userRecord.customClaims && userRecord.customClaims.role === 'user') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: User access required' });
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
