// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Lock, Eye, EyeOff } from 'lucide-react';
// import { toast } from 'react-toastify';
// import api from '../api/axios';

// const ResetPassword = () => {
//     const { token } = useParams();
//     const navigate = useNavigate();
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     const handleReset = async (e) => {
//         e.preventDefault();
//         try {
//             // Backend par naya password bhej rahe hain
//             await api.post('/auth/reset-password', { token, password });
//             toast.success("Password updated! Please login.");
//             navigate('/login');
//         }
//         // } catch (error) {
//         //     toast.error("Link expired or invalid");
//         // }
//     };

//     return (
//         <div className="flex min-h-screen bg-[#0f172a] text-white items-center justify-center p-6">
//             <div className="w-full max-w-sm bg-[#1e293b] p-8 rounded-2xl border border-gray-800 shadow-2xl">
//                 <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
//                 <p className="text-gray-400 text-sm mb-6">Enter your new secure password below.</p>
                
//                 <form onSubmit={handleReset} className="space-y-4">
//                     <div className="relative">
//                         <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
//                         <input 
//                             type={showPassword ? "text" : "password"} 
//                             required
//                             className="w-full bg-[#0f172a] border border-gray-700 rounded-lg py-2.5 pl-10 pr-10 outline-none focus:border-blue-500"
//                             placeholder="New password"
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <button 
//                             type="button"
//                             className="absolute right-3 top-3 text-gray-500"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
//                         </button>
//                     </div>
//                     <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition">
//                         Update Password
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ResetPassword;