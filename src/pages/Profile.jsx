import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import api from '../api/axios'; 

const Profile = () => {
    // 1. Initial States
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [formData, setFormData] = useState({ name: "", location: "", bio: "" });

    // Helper function to update all states (DRY - Don't Repeat Yourself)
    const updateLocalStates = (data) => {
        setUser(data);
        setSkills(data.skills || []);
        setFormData({
            name: data.name || "",
            location: data.location || "Karachi, Pakistan",
            bio: data.bio || ""
        });
    };

    // 2. Sync Logic (Fetch from DB on Mount)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Backend route check: /api/users/profile
                const { data } = await api.get('/users/profile'); 
                
                if (data) {
                    updateLocalStates(data);
                    // Fresh data ko storage mein update karein
                    localStorage.setItem('user', JSON.stringify(data));
                }
            } catch (err) {
                console.error("Sync Error Details:", err.response?.data || err.message);
                
                // Fallback: Agar backend fail ho, toh cached data dikhao
                const local = JSON.parse(localStorage.getItem('user'));
                if (local) {
                    updateLocalStates(local);
                    toast.info("Showing cached profile data.");
                } else {
                    toast.error("Could not fetch profile from database.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // 3. Handlers
    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput)) {
                setSkills([...skills, skillInput]);
                setSkillInput("");
            }
        }
    };

    const handleSave = async () => {
        if (!formData.name) return toast.error("Name is required");

        setSaveLoading(true);
        try {
            // Backend update call
            const { data } = await api.put('/users/profile', { ...formData, skills });
            
            // Success: Update UI and LocalStorage
            updateLocalStates(data);
            localStorage.setItem('user', JSON.stringify(data));
            toast.success("Identity Updated Successfully!");
        } catch (err) {
            console.error("Save Error:", err.response?.data);
            toast.error(err.response?.data?.message || "Update failed.");
        } finally {
            setSaveLoading(false);
        }
    };

    // Loading State
    if (loading && !user) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="font-bold text-teal-600">Syncing Profile...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Dark Header Card */}
                <div className="bg-[#1E293B] rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <p className="text-teal-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">User Profile</p>
                        <h1 className="text-6xl font-bold mb-2">{user?.name || "User"}</h1>
                        <p className="text-gray-400 font-medium text-lg">
                            {user?.role || "Member"} • {formData.location}
                        </p>
                    </div>
                    {/* Decorative Blur Effect */}
                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left: Stats & Skills */}
                    <div className="col-span-12 lg:col-span-7 space-y-8">
                        <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm">
                            <h2 className="text-4xl font-bold text-[#1E293B] mb-8 leading-tight">Skills and reputation</h2>
                            
                            <div className="grid grid-cols-2 gap-8 mb-12">
                                <div className="border-b border-gray-100 pb-6">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Trust score</p>
                                    <p className="text-4xl font-bold text-teal-600">{user?.trustScore || 0}%</p>
                                </div>
                                <div className="border-b border-gray-100 pb-6">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-widest">Contributions</p>
                                    <p className="text-4xl font-bold text-[#1E293B]">{user?.contributions || 0}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Active Skills</p>
                                <div className="flex flex-wrap gap-3">
                                    {skills.length > 0 ? skills.map((s, index) => (
                                        <span key={index} className="px-6 py-3 bg-[#F7F3EB] text-[#1E293B] rounded-full text-sm font-bold border border-gray-200 hover:border-teal-200 transition-all">
                                            {s}
                                        </span>
                                    )) : <p className="text-gray-400 italic">No skills added yet.</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Edit Form */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm">
                            <h2 className="text-4xl font-bold text-[#1E293B] mb-8 leading-tight">Edit Identity</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-5 rounded-2xl bg-[#F7F3EB] border-none focus:ring-2 focus:ring-teal-500 font-medium transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block ml-1">Location</label>
                                    <input 
                                        type="text" 
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full p-5 rounded-2xl bg-[#F7F3EB] border-none focus:ring-2 focus:ring-teal-500 font-medium transition-all" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block ml-1">Add Skill (Press Enter)</label>
                                    <input 
                                        type="text" 
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                        placeholder="e.g. React, Python" 
                                        className="w-full p-5 rounded-2xl bg-[#F7F3EB] border-none focus:ring-2 focus:ring-teal-500 font-medium transition-all" 
                                    />
                                </div>
                                <button 
                                    onClick={handleSave}
                                    disabled={saveLoading}
                                    className="w-full bg-[#0D9488] text-white p-6 rounded-full font-bold text-lg hover:bg-teal-700 transition-all shadow-xl shadow-teal-900/10 active:scale-95 disabled:opacity-50 mt-4"
                                >
                                    {saveLoading ? "Syncing Changes..." : "Save profile"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;