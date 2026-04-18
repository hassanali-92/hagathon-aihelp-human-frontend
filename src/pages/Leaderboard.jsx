import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Leaderboard = () => {
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Backend endpoint: /api/users/leaderboard
                const { data } = await api.get('/users/leaderboard');
                setTopUsers(data);
            } catch (err) {
                console.error("Leaderboard Error:", err);
                toast.error("Failed to load rankings.");
                // Mock data for demo if backend fails
                setTopUsers([
                    { name: "Ali Ahmed", trustScore: 98, contributions: 45, role: "Pro Helper" },
                    { name: "Sara Khan", trustScore: 95, contributions: 38, role: "Saviour" },
                    { name: "Zainab Malik", trustScore: 92, contributions: 30, role: "Contributor" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <Layout>
            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black text-[#1E293B] tracking-tight">Community Heroes</h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">The most trusted contributors in the Helplytics network.</p>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Rank</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">User</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Trust Score</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Helps</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Badge</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [1, 2, 3, 4].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="px-10 py-8 bg-gray-50/50"></td>
                                        </tr>
                                    ))
                                ) : (
                                    topUsers.map((u, index) => (
                                        <tr key={index} className="hover:bg-teal-50/30 transition-colors group">
                                            <td className="px-10 py-8">
                                                <span className={`text-2xl font-black ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-slate-300'}`}>
                                                    #{index + 1}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#1E293B] flex items-center justify-center text-white font-bold shadow-lg shadow-slate-200">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#1E293B] text-lg">{u.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{u.location || 'Remote'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className="text-2xl font-black text-teal-600">{u.trustScore}%</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="font-bold text-[#1E293B]">{u.contributions} Helps</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    index === 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                                                }`}>
                                                    {index === 0 ? 'Top Contributor' : 'Verified'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="text-center p-12 bg-[#F7F3EB] rounded-[40px] border border-gray-200/50">
                    <p className="font-bold text-[#1E293B]">Want to see yourself here?</p>
                    <p className="text-sm text-gray-500 mt-1">Start helping people in the explore tab to earn points.</p>
                </div>
            </div>
        </Layout>
    );
};

export default Leaderboard;