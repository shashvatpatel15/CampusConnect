const { auth, db } = require('../config/firebase');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;

        // Fetch user info from Firestore to keep original behavior
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            // Some users might only be in Auth but not in our collection (e.g., first social login)
            // We'll handle this by returning the basics from the token
            req.user = { 
                id: uid, 
                email: decodedToken.email, 
                role: decodedToken.role || 'student' ,
                name: decodedToken.name || decodedToken.email.split('@')[0]
            };
        } else {
            const userData = userDoc.data();
            req.user = { 
                id: uid, 
                email: userData.email, 
                role: userData.role || 'student',
                name: userData.name
            };
        }
        
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
};
