import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Axios instance import karein
import { toast } from 'react-toastify';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTasks, setActiveTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- User data from LocalStorage ---
    const [user] = useState(() => {
        const saved = localStorage.getItem('user');
        try {
            return (saved && saved !== "undefined") ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    // --- Fetch Active Tasks from Backend ---
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchTasks = async () => {
            try {
                // Ye route backend par GET /api/requests/my-tasks hona chahiye
                const { data } = await api.get('/requests/my-tasks');
                setActiveTasks(data);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                toast.error("Tasks load nahi ho sakay.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user, navigate]);

    // Role-based logic
    const isSeeker = user?.role === 'Seeker' || user?.role === 'Both';
    const isHelper = user?.role === 'Helper' || user?.role === 'Both';

    if (!user) return null;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-12 gap-8">
                    
                    {/* --- Main Section --- */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        
                        {/* Hero Card */}
                        <div className="bg-[#1E293B] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <p className="text-teal-400 font-black uppercase tracking-widest text-[10px] mb-4">
                                    {user?.role} Account
                                </p>
                                <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                    Welcome, {user?.name}!
                                </h1>
                                
                                <div className="flex flex-wrap gap-4">
                                    {isSeeker && (
                                        <button 
                                            onClick={() => navigate('/create-request')}
                                            className="bg-teal-600 px-8 py-4 rounded-2xl font-black text-xs uppercase hover:bg-teal-500 transition-all shadow-lg"
                                        >
                                            + Request Help
                                        </button>
                                    )}
                                    {isHelper && (
                                        <button 
                                            onClick={() => navigate('/explore')}
                                            className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl font-black text-xs uppercase hover:bg-white/20 transition-all border border-white/10"
                                        >
                                            Browse Tasks
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Trust Score</p>
                                <p className="text-4xl font-black text-[#1E293B]">{user?.trustScore || 0}%</p>
                            </div>
                            <div className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Impact</p>
                                <p className="text-4xl font-black text-[#1E293B]">{user?.helpCount || 0}</p>
                            </div>
                        </div>

                        {/* --- Active Tasks Section --- */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-[#1E293B] flex items-center gap-2">
                                Your Active Tasks 
                                <span className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-lg">{activeTasks.length}</span>
                            </h2>

                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-24 bg-gray-100 rounded-[30px]"></div>
                                    <div className="h-24 bg-gray-100 rounded-[30px]"></div>
                                </div>
                            ) : activeTasks.length > 0 ? (
                                <div className="grid gap-4">
                                    {activeTasks.map(task => (
                                        <div key={task._id} className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all group">
                                            <div>
                                                <h3 className="font-bold text-lg text-[#1E293B] group-hover:text-teal-600 transition-colors">{task.title}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-teal-50 text-teal-600 rounded-md">
                                                        {task.status}
                                                    </span>
                                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight">
                                                        Seeker: {task.user?.name || 'Anonymous'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/chat/${task._id}`)}
                                                className="bg-[#1E293B] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-colors shadow-lg active:scale-95"
                                            >
                                                Chat & Help
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold text-sm italic mb-4">No active tasks found.</p>
                                    <button 
                                        onClick={() => navigate('/explore')}
                                        className="text-teal-600 font-black text-xs uppercase underline"
                                    >
                                        Explore Requests Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Sidebar --- */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="bg-[#F7F3EB] rounded-[45px] p-8 md:p-10 border border-orange-100/50 sticky top-8">
                            <h3 className="text-2xl font-black text-[#1E293B] mb-8">Badges & Reputation</h3>
                            <div className="flex flex-wrap gap-2">
                                {user?.badges?.length > 0 ? user.badges.map(b => (
                                    <div key={b} className="bg-white px-4 py-2 rounded-2xl text-[10px] font-black shadow-sm border border-orange-100">
                                        ⭐ {b}
                                    </div>
                                )) : (
                                    <p className="text-xs text-gray-400 font-bold italic">No badges earned yet.</p>
                                )}
                            </div>
                            
                            <div className="mt-10 p-6 bg-white/50 rounded-3xl border border-white/60">
                                <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                    Tip: Complete more tasks to increase your trust score and unlock premium features.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;