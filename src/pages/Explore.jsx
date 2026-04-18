import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Explore = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // Specific button loading ke liye

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await api.get('/requests');
                setRequests(data);
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Failed to load requests.");
                setRequests([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // --- HELP LOGIC ---
  const handleHelpNow = async (requestId) => {
    setActionLoading(requestId);
    try {
        // Backend hit karega: POST /api/requests/:id/offer
        const { data } = await api.post(`/requests/${requestId}/offer`); 
        
        toast.success("Zabardast! Offer bhej di gayi hai.");
        
        // List se hata dein kyunke ab ye 'Assigned' ho chuki hai
        setRequests(prev => prev.filter(req => req._id !== requestId));
        
        // Optional: Redirect to My Tasks
        // navigate('/my-tasks'); 
    } catch (err) {
        const msg = err.response?.data?.message || "Server error occurred";
        toast.error(msg);
    } finally {
        setActionLoading(null);
    }
};

    return (
        <Layout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 1. Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-bold text-[#1E293B]">Explore Requests</h1>
                        <p className="text-gray-500 mt-2 text-lg">Help someone today and boost your trust score.</p>
                    </div>
                    <div className="flex gap-4">
                        <select className="bg-white border-none rounded-2xl px-6 py-4 shadow-sm text-sm font-bold text-gray-600 focus:ring-2 focus:ring-teal-500 cursor-pointer">
                            <option>All Categories</option>
                            <option>Tech Support</option>
                            <option>Medical</option>
                            <option>Education</option>
                        </select>
                    </div>
                </div>

                {/* 2. Requests Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[40px]"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {requests.length > 0 ? requests.map((req) => (
                            <div key={req._id} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col h-full">
                                {/* Tag & Date */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        req.urgency === 'High' ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-600'
                                    }`}>
                                        {req.category || "General"}
                                    </span>
                                    <span className="text-gray-400 text-[10px] font-bold uppercase">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                {/* Content */}
                                <h3 className="text-2xl font-bold text-[#1E293B] mb-4 group-hover:text-teal-600 transition-colors">
                                    {req.title}
                                </h3>
                                
                                <p className="text-gray-500 line-clamp-3 mb-8 text-sm leading-relaxed flex-grow">
                                    {req.description}
                                </p>

                                {/* Footer: User Info & Button */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-tr from-[#1E293B] to-slate-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                            {req.user?.name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#1E293B]">{req.user?.name || "Anonymous"}</p>
                                            <p className="text-[10px] text-teal-600 font-black uppercase tracking-tighter">Trust: {req.user?.trustScore || 0}%</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleHelpNow(req._id)}
                                        disabled={actionLoading === req._id}
                                        className={`px-5 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                                            actionLoading === req._id 
                                            ? 'bg-gray-200 text-gray-500' 
                                            : 'bg-[#1E293B] text-white hover:bg-teal-600'
                                        }`}
                                    >
                                        {actionLoading === req._id ? 'SENDING...' : 'HELP NOW'}
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 text-xl font-medium">No help requests found at the moment.</p>
                                <button 
                                    onClick={() => window.location.href='/create-request'}
                                    className="mt-4 text-teal-600 font-bold underline cursor-pointer"
                                >
                                    Create a new request
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Explore;