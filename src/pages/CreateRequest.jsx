import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateRequest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        urgency: 'Medium'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            return toast.error("Please fill in all required fields");
        }

        setLoading(true);
        try {
            // Backend endpoint: /api/requests
            await api.post('/requests', formData);
            toast.success("Help Request Posted Successfully!");
            navigate('/explore'); // Request post hote hi Explore page par bhej do
        } catch (err) {
            console.error("Post Error:", err.response?.data);
            toast.error(err.response?.data?.message || "Failed to post request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-[#1E293B] mb-4">Request Help</h1>
                    <p className="text-gray-500 text-lg">Describe what you need, and our community (or AI) will step in.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-100 space-y-8">
                    {/* Title */}
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 mb-3 block tracking-widest">Request Title</label>
                        <input 
                            type="text"
                            placeholder="e.g., Need help with React-Node integration"
                            className="w-full p-6 rounded-2xl bg-[#F7F3EB] border-none focus:ring-2 focus:ring-teal-500 font-medium text-lg"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Category & Urgency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 mb-3 block tracking-widest">Category</label>
                            <select 
                                className="w-full p-6 rounded-2xl bg-[#F7F3EB] border-none focus:ring-2 focus:ring-teal-500 font-bold text-gray-700"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option>General</option>
                                <option>Tech Support</option>
                                <option>Medical</option>
                                <option>Education</option>
                                <option>Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-400 mb-3 block tracking-widest">Urgency</label>
                            <div className="flex gap-2">
                                {['Low', 'Medium', 'High'].map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({...formData, urgency: level})}
                                        className={`flex-1 p-5 rounded-2xl font-bold transition-all ${
                                            formData.urgency === level 
                                            ? 'bg-[#1E293B] text-white shadow-lg' 
                                            : 'bg-[#F7F3EB] text-gray-400 hover:bg-gray-200'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Detailed Description</label>
                            <span className="text-[10px] font-black text-teal-600 uppercase">AI Writing Assistant On</span>
                        </div>
                        <textarea 
                            rows="6"
                            placeholder="Explain your situation in detail..."
                            className="w-full p-6 rounded-3xl bg-[#F7F3EB] border-none focus:ring-2 focus:ring-teal-500 font-medium text-lg resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0D9488] text-white p-8 rounded-full font-bold text-xl hover:bg-teal-700 transition-all shadow-xl shadow-teal-900/20 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? "Publishing to Network..." : "Post Help Request"}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default CreateRequest;