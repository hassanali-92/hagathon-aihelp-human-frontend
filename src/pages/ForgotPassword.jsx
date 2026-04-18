// import React, { useState } from 'react';
// import { Mail, ArrowLeft } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import api from '../api/axios';

// const ForgotPassword = () => {
//     const [email, setEmail] = useState('');

//     const handleReset = async (e) => {
//         e.preventDefault();
//         try {
//             await api.post('/auth/forgot-password', { email });
//             toast.info('If this email exists, a reset link has been sent.');
//         } catch (err) {
//             toast.error("Something went wrong");
//         }
//     };

//     return (
//         <div className="flex min-h-screen bg-[#0f172a] text-white items-center justify-center p-6">
//             <div className="w-full max-w-sm bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-2xl">
//                 <Link to="/login" className="flex items-center text-sm text-gray-400 hover:text-white mb-6">
//                     <ArrowLeft size={16} className="mr-2" /> Back to login
//                 </Link>
//                 <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
//                 <p className="text-gray-400 text-sm mb-6">Enter your email and we'll send you a link to reset your password.</p>
                
//                 <form onSubmit={handleReset} className="space-y-4">
//                     <div className="relative">
//                         <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
//                         <input 
//                             type="email" required
//                             className="w-full bg-[#0f172a] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
//                             placeholder="Email address"
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </div>
//                     <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition">
//                         Send Reset Link
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;