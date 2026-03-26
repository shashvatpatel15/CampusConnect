const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');
const readline = require('readline');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();
const auth = admin.auth();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the email of the user to make ADMIN: ', async (email) => {
    try {
        console.log(`\nLooking for user with email: ${email}`);
        
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
        } catch (authError) {
            console.error('Firebase Auth Error:', authError.message);
            process.exit(1);
        }
        
        const userRef = db.collection('users').doc(userRecord.uid);
        const doc = await userRef.get();
        
        const updateData = {
            role: 'admin',
            updated_at: new Date().toISOString()
        };
        
        if (!doc.exists) {
            console.log('User document not found in Firestore. Creating it...');
            updateData.email = email;
            updateData.name = userRecord.displayName || 'Admin User';
            updateData.created_at = new Date().toISOString();
        }
        
        await userRef.set(updateData, { merge: true });
        console.log(`\n✅ SUCCESS! Re-assigned role of ${email} to 'admin' in Firestore.`);
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        rl.close();
        process.exit(0);
    }
});
