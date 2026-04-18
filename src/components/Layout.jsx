import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getUserData = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "undefined") {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Error parsing user data", e);
        return null;
      }
    }
    return null;
  };

  const user = getUserData();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Explore', path: '/explore' },
    { name: 'Create Help', path: '/create-request' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.clear(); 
    window.location.href = '/login'; 
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E293B] m-4 rounded-[32px] flex flex-col p-8 text-white fixed h-[95vh] shadow-2xl z-50">
        <div className="text-2xl font-black mb-12 text-teal-400 tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            SkillSwap
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`block w-full text-left p-4 rounded-2xl transition-all font-bold text-sm ${
                  isActive 
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Dynamic Trust Score */}
        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] uppercase font-black text-teal-500 mb-1 tracking-widest">Trust Score</p>
            <p className="text-xl font-bold">{user?.trustScore || 0}%</p>
            <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                <div 
                    className="bg-teal-500 h-full transition-all duration-1000" 
                    style={{ width: `${user?.trustScore || 0}%` }}
                ></div>
            </div>
        </div>

        <button 
          onClick={handleLogout}
          className="p-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-colors text-left text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        <header className="flex justify-between items-center mb-12 bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                {location.pathname.replace('/', '') || 'Overview'}
            </p>
            <h2 className="text-2xl font-black text-[#1E293B]">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-[#F7F3EB] p-2 pr-6 rounded-full border border-orange-100/50">
            <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-teal-400 font-black shadow-md uppercase">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex flex-col">
                <span className="font-black text-[#1E293B] text-xs leading-none">{user?.name || 'Guest'}</span>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">{user?.role || 'Member'}</span>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;