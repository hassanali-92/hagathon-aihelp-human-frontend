import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

const ChatPage = () => {
    const { id } = useParams(); // Chat ID
    const [chat, setChat] = useState(null);
    const [text, setText] = useState("");
    const scrollRef = useRef();

    // Messages fetch karne ka function
    const fetchChat = async () => {
        try {
            const { data } = await api.get(`/chat/${id}`);
            setChat(data);
        } catch (err) {
            console.error("Chat load error", err);
        }
    };

    useEffect(() => {
        fetchChat();
        const interval = setInterval(fetchChat, 3000); // 3 sec polling
        return () => clearInterval(interval);
    }, [id]);

    // Auto scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            await api.post(`/chat/${id}/message`, { text });
            setText("");
            fetchChat(); // Foran refresh
        } catch (err) {
            alert("Message nahi gaya");
        }
    };

    const currentUser = JSON.parse(localStorage.getItem('user'));

    return (
        <Layout>
            <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white shadow-2xl rounded-[40px] overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="p-6 bg-[#1E293B] text-white flex justify-between items-center">
                    <div>
                        <h2 className="font-black text-sm uppercase tracking-tighter">
                            Chat: {chat?.requestId?.title || 'Loading...'}
                        </h2>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
                    {chat?.messages.map((msg, index) => {
                        const isMe = msg.sender === currentUser._id || msg.sender?._id === currentUser._id;
                        return (
                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-4 rounded-[25px] shadow-sm ${
                                    isMe 
                                    ? 'bg-teal-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                }`}>
                                    <p className="text-sm font-medium">{msg.text}</p>
                                    <span className="text-[8px] opacity-50 mt-1 block">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-50 flex gap-3">
                    <input 
                        type="text" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-100 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                    <button className="bg-teal-600 text-white px-10 rounded-2xl font-black text-xs uppercase hover:bg-teal-500 transition-all shadow-lg shadow-teal-900/20">
                        Send
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ChatPage;