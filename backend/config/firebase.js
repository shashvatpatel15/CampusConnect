// config/firebase.js
const admin = require('firebase-admin');

// Using try-catch to avoid multiple initialization error if it occurs during hot-reloads
try {
  if (!admin.apps.length) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.error('Firebase admin initialization error:', error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
