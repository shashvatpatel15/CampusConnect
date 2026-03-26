import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithPopup,
    updateProfile,
    getIdToken
} from 'firebase/auth';
import { auth, googleProvider } from '../api/firebase';
import api from '../api/axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Synchronize Firestore user preferences/role
    const syncUserProfile = async (firebaseUser) => {
        if (!firebaseUser) return null;
        
        try {
            // Get the ID token to authenticate with backend requests
            const token = await getIdToken(firebaseUser);
            localStorage.setItem('wms_token', token);

            // We always sync with the backend to get the most up-to-date role and info
            let userRole = 'student';
            const intendedRole = localStorage.getItem('intended_role');
            if (intendedRole) {
                userRole = intendedRole;
                localStorage.removeItem('intended_role');
            }

            const userMetadata = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                email: firebaseUser.email,
                role: userRole // Passed if new signup, otherwise backend returns existing role
            };
            
            // Call backend to ensure user exists (this endpoint is idempotent)
            const response = await api.post('/auth/signup', userMetadata);
            const verifiedUser = response.data.user;
            
            localStorage.setItem('wms_user', JSON.stringify(verifiedUser));
            return verifiedUser;
        } catch (error) {
            console.error("Error syncing user profile:", error);
            return null;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            if (user) {
                const profile = await syncUserProfile(user);
                setCurrentUser(profile);
            } else {
                setCurrentUser(null);
                localStorage.removeItem('wms_token');
                localStorage.removeItem('wms_user');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Login error:", error);
            throw error.message || 'Login failed';
        }
    };

    const signup = async (name, email, password, role = 'student') => {
        try {
            localStorage.setItem('intended_role', role);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            
            // For signup, we explicitly set the role in our local cache and/or backend
            const userMetadata = {
                id: userCredential.user.uid,
                name,
                email,
                role
            };
            localStorage.setItem('wms_user', JSON.stringify(userMetadata));
            setCurrentUser(userMetadata);

            // Here we could also call our backend to ensure the user is created in Firestore
            await api.post('/auth/signup', { 
                name, 
                email, 
                role,
                id: userCredential.user.uid
            });

            return userCredential.user;
        } catch (error) {
            console.error("Signup error:", error);
            throw error.message || 'Signup failed';
        }
    };

    const loginWithGoogle = async (role = null) => {
        try {
            if (role) {
                localStorage.setItem('intended_role', role);
            }
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error("Google Login error:", error);
            throw error.message || 'Google Login failed';
        }
    };

    const updateUser = (updatedUser) => {
        const newUser = { ...currentUser, ...updatedUser };
        setCurrentUser(newUser);
        localStorage.setItem('wms_user', JSON.stringify(newUser));
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
            localStorage.removeItem('wms_token');
            localStorage.removeItem('wms_user');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const value = {
        currentUser,
        login,
        signup,
        loginWithGoogle,
        updateUser,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
