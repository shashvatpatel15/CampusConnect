import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, UserPlus, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default to student
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            return setError('Please fill in all fields');
        }

        try {
            setError('');
            setLoading(true);
            await signup(name, email, password, role);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to create an account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError('');
        try {
            // Google login logic is the same for signup/signin
            await loginWithGoogle(role);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Google signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 -left-1/4 w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-1/4 w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] overflow-hidden">
                    {/* Header Section */}
                    <div className="relative pt-10 pb-6 text-center px-8">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30 mb-8"
                        >
                            <UserPlus size={32} className="text-white" />
                        </motion.div>

                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Journey</span>
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 font-medium">
                            Join the smartest workshop hub at your campus.
                        </p>
                    </div>

                    <div className="px-8 pb-10">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="p-4 bg-red-50/80 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Social Signup */}
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all duration-300 shadow-sm active:scale-[0.98] disabled:opacity-50 group mb-6"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-slate-700 font-bold tracking-tight">Claim Account with Google</span>
                        </button>

                        <div className="relative mb-6 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <span className="relative bg-white px-3 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">or traditional setup</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Identity</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <User size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                        placeholder="Michael Scott"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Node</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                        placeholder="michael.scott@dundermifflin.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Access Key</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pb-2">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`py-3 px-4 rounded-2xl border transition-all flex items-center justify-center gap-2 font-bold text-sm ${
                                        role === 'student' 
                                        ? 'bg-indigo-600/5 border-indigo-200 text-indigo-700 shadow-sm' 
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    {role === 'student' && <CheckCircle2 size={16} />} Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('organizer')}
                                    className={`py-3 px-4 rounded-2xl border transition-all flex items-center justify-center gap-2 font-bold text-sm ${
                                        role === 'organizer' 
                                        ? 'bg-purple-600/5 border-purple-200 text-purple-700 shadow-sm' 
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    {role === 'organizer' && <CheckCircle2 size={16} />} Organizer
                                </button>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? 'Syncing...' : (
                                    <>
                                        Establish Account
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm font-semibold text-slate-400">
                                Already identified?{' '}
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                                    Login Interface
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
