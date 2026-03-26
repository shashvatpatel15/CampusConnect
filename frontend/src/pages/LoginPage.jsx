import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            setError(err.message || 'Google authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 overflow-hidden">
            {/* Dynamic Background Mesh */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white/70 backdrop-blur-3xl border border-white/50 rounded-[3rem] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.15)] overflow-hidden">
                    {/* Visual Header */}
                    <div className="relative h-44 bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
                        </div>
                        
                        <div className="relative z-10 text-center flex flex-col items-center">
                            <motion.div 
                                initial={{ rotate: -15, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-4 shadow-2xl"
                            >
                                <ShieldCheck size={32} className="text-white" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Access Hub</h2>
                            <p className="text-indigo-200/80 text-xs font-bold uppercase tracking-[0.2em] mt-1">Authorized Personnel Only</p>
                        </div>

                        {/* Animated sparkles */}
                        <div className="absolute top-4 right-8 text-white/20"><Sparkles size={20} /></div>
                        <div className="absolute bottom-6 left-8 text-white/20"><Sparkles size={16} /></div>
                    </div>

                    <div className="p-10">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="mb-8 p-4 bg-red-50/50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-bold flex items-center gap-3"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Identifier</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium placeholder:text-slate-300"
                                    placeholder="agent@workshop.edu"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 pr-14 text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium placeholder:text-slate-300"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full group flex justify-center items-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Validating...' : (
                                    <>
                                        Authorize Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                <span className="bg-white/0 px-4">Secure Link</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-4 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all duration-300 shadow-sm active:scale-[0.98] disabled:opacity-50 group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-slate-700 font-bold tracking-tight">Google Authentication</span>
                        </button>

                        <div className="mt-10 text-center">
                            <p className="text-sm font-semibold text-slate-400">
                                New operative?{' '}
                                <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold transition-all border-b-2 border-transparent hover:border-indigo-600 pb-0.5">
                                    Request Clearance
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
