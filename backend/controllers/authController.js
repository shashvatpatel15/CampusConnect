const { db, auth } = require("../config/firebase");

/**
 * SIGNUP / SYNC USER
 * This endpoint ensures a user document exists in Firestore.
 * It's called after Firebase Auth signup or on the first login.
 */
exports.signup = async (req, res) => {
  const { name, email, role, id } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const usersRef = db.collection("users");
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user already exists
    // If 'id' (uid) is provided from frontend, use it as doc ID
    const userDocRef = id ? usersRef.doc(id) : null;
    let userDoc = null;
    
    if (userDocRef) {
      userDoc = await userDocRef.get();
    } else {
      const snapshot = await usersRef.where("email", "==", normalizedEmail).limit(1).get();
      if (!snapshot.empty) {
        userDoc = snapshot.docs[0];
      }
    }

    if (userDoc && userDoc.exists) {
      // User already exists in Firestore, just return it
      return res.status(200).json({
        message: "User already exists",
        user: { id: userDoc.id, ...userDoc.data() }
      });
    }

    // Create new user in Firestore
    // If not provided from frontend, we try to fetch from Firebase Auth
    let newUserId = id;
    if (!newUserId) {
      try {
        const fbUser = await auth.getUserByEmail(normalizedEmail);
        newUserId = fbUser.uid;
      } catch (e) {
        // If user not in Auth yet, we might need to wait or it's a manual entry
        console.warn("User not found in Firebase Auth during sync:", normalizedEmail);
      }
    }

    if (!newUserId) {
        return res.status(400).json({ message: "Firebase User ID required for synchronization" });
    }

    const newUser = usersRef.doc(newUserId);

    const userData = {
      name: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: role || "student",
      created_at: new Date().toISOString(),
    };

    await newUser.set(userData);

    res.status(201).json({
      message: "User profile created successfully",
      user: { id: newUserId, ...userData },
    });
  } catch (error) {
    console.error("Signup/Sync Error:", error);
    res.status(500).json({ message: "Server error during user sync" });
  }
};

/**
 * LOGIN (Legacy / Verification)
 * In Firebase Auth, the frontend handles logic, but it may call this to verify.
 */
exports.login = async (req, res) => {
  const { user } = req; // From authMiddleware
  
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({
    message: "Authenticated",
    user
  });
};
