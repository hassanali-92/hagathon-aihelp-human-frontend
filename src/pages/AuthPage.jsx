import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Both'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    
    // Sirf wahi data bhejein jo zaroori hai
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } 
      : formData;

    try {
      const { data } = await api.post(endpoint, payload);
      
      if (data.token && data.user) {
        // Token aur User storage mein save karein
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success(isLogin ? `Welcome back, ${data.user.name}!` : "Account created successfully!");
        
        // Use window.location for a clean state or navigate
        setTimeout(() => {
          window.location.href = '/dashboard'; 
        }, 500);
      } else {
        toast.error("Invalid response from server");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const errorMsg = err.response?.data?.message || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans flex items-center justify-center p-4 md:p-10">
      <div className="grid grid-cols-12 gap-0 lg:gap-12 w-full max-w-7xl bg-white md:bg-transparent rounded-[40px] overflow-hidden shadow-2xl md:shadow-none">
        
        {/* Left Side - Hero Info */}
        <div className="hidden md:flex col-span-12 md:col-span-5 bg-[#1E293B] rounded-[32px] p-10 lg:p-16 text-white flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.3em] text-teal-400 font-bold mb-4">SkillSwap Network</p>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-8 tracking-tighter">
              {isLogin ? "Welcome back to the circle." : "The future of skill sharing."}
            </h1>
            <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-sm">
              Connect with experts, offer your skills, and earn badges in a premium community interface.
            </p>
            <div className="space-y-6">
              {['Role-based access', 'Secure Authentication', 'Real-time Dashboard'].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-gray-300 font-bold text-sm">
                  <div className="w-5 h-5 bg-teal-500/20 border border-teal-500/50 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="col-span-12 md:col-span-7 bg-[#F7F3EB] md:rounded-[32px] p-6 md:p-12 lg:p-20 flex items-center justify-center">
          <div className="w-full max-w-md">
            
            <div className="mb-10 text-center md:text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-600 mb-2">
                {isLogin ? "Member Portal" : "Get Started"}
              </p>
              <h2 className="text-[#1E293B] text-4xl font-black tracking-tight">
                {isLogin ? "Sign In" : "Register"}
              </h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Full Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ali Ahmed" 
                    className="w-full p-4 rounded-2xl border-2 border-transparent bg-white focus:border-teal-500/20 transition-all outline-none text-sm font-bold shadow-sm" 
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com" 
                  className="w-full p-4 rounded-2xl border-2 border-transparent bg-white focus:border-teal-500/20 transition-all outline-none text-sm font-bold shadow-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Password</label>
                <input 
                  name="password"
                  type="password" 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="w-full p-4 rounded-2xl border-2 border-transparent bg-white focus:border-teal-500/20 transition-all outline-none text-sm font-bold shadow-sm" 
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Select Your Primary Role</label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border-2 border-transparent bg-white focus:border-teal-500/20 transition-all outline-none text-sm font-bold shadow-sm cursor-pointer appearance-none"
                  >
                    <option value="Both">Both (Seeker & Helper)</option>
                    <option value="Seeker">Seeker (Need help)</option>
                    <option value="Helper">Helper (Offer skills)</option>
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1E293B] text-white p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all transform active:scale-95 disabled:opacity-50 mt-6 shadow-xl shadow-slate-200"
              >
                {loading ? "Processing..." : isLogin ? "Enter Dashboard" : "Create Account"}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500 font-bold">
                  {isLogin ? "New to SkillSwap?" : "Already have an account?"}
                  {" "}
                  <button 
                      type="button"
                      onClick={() => setIsLogin(!isLogin)} 
                      className="text-teal-600 hover:underline transition-all"
                  >
                      {isLogin ? "Join now" : "Sign in here"}
                  </button>
                </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;