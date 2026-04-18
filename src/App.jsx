import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- PAGES ---
import AuthPage from './pages/AuthPage'; 
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import CreateRequest from './pages/CreateRequest';
import Leaderboard from './pages/Leaderboard';
import ChatPage from './pages/ChatPage'; // <--- ChatPage Import Kiya

// --- COMPONENTS ---
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    {/* --- PUBLIC ROUTES --- */}
                    <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><AuthPage /></PublicRoute>} />

                    {/* --- PROTECTED ROUTES (Login Required) --- */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                    <Route path="/create-request" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    
                    {/* Naya Chat Route */}
                    <Route path="/chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

                    {/* --- REDIRECTS & 404 --- */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={
                        <div className="h-screen flex items-center justify-center bg-[#FDFBF7] text-[#1E293B] font-black text-2xl uppercase tracking-widest">
                            404 - Page Not Found
                        </div>
                    } />
                </Routes>

                <ToastContainer 
                    theme="dark" 
                    position="bottom-right" 
                    autoClose={3000} 
                    newestOnTop={true}
                    closeOnClick
                />
            </Router>
        </QueryClientProvider>
    );
}

export default App;