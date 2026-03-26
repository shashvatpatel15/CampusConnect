const { db, auth } = require('./config/firebase');

async function makeOrganizer(email) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`Looking for user with email: ${normalizedEmail}`);
    
    // Find the user in Firestore
    const snapshot = await db.collection("users").where("email", "==", normalizedEmail).limit(1).get();
    
    if (snapshot.empty) {
      console.log('User not found in Firestore.');
      // Also check if they exist in Auth but not Firestore
      try {
          const userRecord = await auth.getUserByEmail(normalizedEmail);
          console.log(`Found user in Firebase Auth with UID: ${userRecord.uid}. Creating Firestore record...`);
          await db.collection("users").doc(userRecord.uid).set({
              name: userRecord.displayName || normalizedEmail.split('@')[0],
              email: normalizedEmail,
              role: 'organizer',
              created_at: new Date().toISOString()
          });
          console.log('Successfully created and granted organizer role!');
      } catch (e) {
          console.log('User also not found in Firebase Auth.');
      }
      process.exit(0);
    }

    const userDoc = snapshot.docs[0];
    const uid = userDoc.id;
    
    await db.collection("users").doc(uid).update({
      role: 'organizer'
    });
    
    console.log(`Successfully updated ${normalizedEmail} to organizer!`);
    console.log(`Please log out and log back in on the frontend to refresh the privileges.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Please provide an email address.');
  console.log('Usage: node make-organizer.js <email>');
  process.exit(1);
}

makeOrganizer(args[0]);
