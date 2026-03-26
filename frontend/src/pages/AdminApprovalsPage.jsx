import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { ShieldCheck, CheckCircle2, XCircle, Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { Link } from 'react-router-dom';

export default function AdminApprovalsPage() {
    const [pendingWorkshops, setPendingWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const res = await api.get('/workshops/admin/pending');
            setPendingWorkshops(res.data);
        } catch (err) {
            console.error('Failed to fetch pending workshops', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            setActionLoading(id);
            await api.patch(`/workshops/admin/${id}/status`, { status });
            // Remove from list smoothly
            setPendingWorkshops(prev => prev.filter(w => w.id !== id));
        } catch (err) {
            console.error(`Failed to ${status} workshop`, err);
            alert(`Failed to ${status} workshop. Please try again.`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-10 space-y-4 px-4">
                <div className="h-8 bg-slate-200 rounded-xl w-1/3 animate-pulse mb-8" />
                {[1, 2].map(i => (
                    <div key={i} className="h-40 bg-white border border-slate-200 rounded-3xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 px-4"
        >
            <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ShieldCheck size={28} className="text-red-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h2>
                    <p className="text-sm text-slate-500 font-medium">{pendingWorkshops.length} workshops pending approval</p>
                </div>
            </div>

            <AnimatePresence>
                {pendingWorkshops.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 rounded-3xl border border-slate-200 shadow-sm"
                    >
                        <div className="w-20 h-20 rounded-full bg-white border border-slate-200 mb-6 flex items-center justify-center shadow-sm">
                            <CheckCircle2 size={32} className="text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">All Caught Up!</h3>
                        <p className="text-slate-500 max-w-sm leading-relaxed font-medium">
                            There are currently no workshops pending your approval. Return later when organizers submit new ones.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid gap-5">
                        {pendingWorkshops.map((w, i) => (
                            <motion.article
                                key={w.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0, overflow: "hidden", marginTop: 0, marginBottom: 0, padding: 0, border: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white border border-red-100/50 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row gap-6 hover:border-red-200 transition-colors shadow-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl pointer-events-none" />

                                <div className="flex-1 space-y-4 relative z-10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                                                Pending Review
                                            </span>
                                            <span className="text-sm font-bold text-slate-500">
                                                by {w.organizer_name || 'Unknown'}
                                            </span>
                                        </div>
                                        <Link to={`/workshop/${w.id}`}>
                                            <h3 className="text-xl font-extrabold text-slate-800 hover:text-indigo-700 transition-colors">
                                                {w.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-slate-600 line-clamp-2 mt-2">{w.description}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Club</span>
                                            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-slate-400"/> {w.club}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Date & Time</span>
                                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> {formatDate(w.date)} • {w.time}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-400 font-bold uppercase text-[10px]">Location</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> {w.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col justify-end gap-3 sm:w-40 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 relative z-10">
                                    <button
                                        onClick={() => handleAction(w.id, 'approved')}
                                        disabled={actionLoading === w.id}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                                    >
                                        <CheckCircle2 size={16} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(w.id, 'rejected')}
                                        disabled={actionLoading === w.id}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
