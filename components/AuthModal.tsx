import React, { useState, useEffect } from 'react';
import { XIcon, MailIcon, ShieldCheckIcon, UserIcon, DoctorIcon } from './IconComponents';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (userData: { name: string; email: string; practiceName: string; role: string }) => void;
    initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        practiceName: '',
    });

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Test users database
        const testUsers = [
            { email: 'admin@itera.health', password: '123', name: 'Admin User', practiceName: 'ITERA Health', role: 'Admin' },
            { email: 'callcenter@itera.health', password: '123', name: 'Call Center Agent', practiceName: 'ITERA Health', role: 'Call Center' },
            { email: 'practice@itera.health', password: '123', name: 'Practice Staff', practiceName: 'ITERA Health', role: 'Practice Staff' }
        ];

        if (mode === 'login') {
            // Authenticate user
            const user = testUsers.find(u => u.email === formData.email && u.password === formData.password);
            if (user) {
                onSuccess({
                    name: user.name,
                    email: user.email,
                    practiceName: user.practiceName,
                    role: user.role
                });
            } else {
                alert('Invalid credentials. Try: admin@itera.health / callcenter@itera.health / practice@itera.health with password: 123');
            }
        } else {
            // Signup mode - create new user as Practice Staff
            onSuccess({
                name: formData.name || 'Demo User',
                email: formData.email,
                practiceName: formData.practiceName || 'Itera Health Clinic',
                role: 'Practice Staff'
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-itera-blue-dark/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>

            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl z-10 overflow-hidden relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-itera-blue hover:bg-itera-blue-light/20 rounded-full transition-all"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                <div className="p-8 pb-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-itera-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-itera-blue/20">
                            {mode === 'login' ? (
                                <ShieldCheckIcon className="w-8 h-8 text-itera-blue" />
                            ) : (
                                <UserIcon className="w-8 h-8 text-itera-blue" />
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-itera-blue-dark">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            {mode === 'login'
                                ? 'Access your care management portal.'
                                : 'Begin your practice activation journey today.'}
                        </p>
                    </div>

                    <div className="flex p-1 bg-gray-100 rounded-2xl mb-8 gap-1">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white text-itera-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-itera-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <MailIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all"
                                />
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest px-1">Practice Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <DoctorIcon className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        name="practiceName"
                                        required
                                        value={formData.practiceName}
                                        onChange={handleChange}
                                        placeholder="Heart & Health Clinic"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5 pb-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Password</label>
                                {mode === 'login' && (
                                    <button type="button" className="text-[10px] font-bold text-itera-blue-dark hover:underline">Forgot password?</button>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <ShieldCheckIcon className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-itera-blue focus:border-itera-blue outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-itera-blue text-white rounded-2xl font-bold shadow-lg shadow-itera-blue/30 hover:bg-itera-blue-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {mode === 'login' ? 'Login to Activation Portal' : 'Create Your Account'}
                            <ShieldCheckIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400 font-medium">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="ml-1.5 text-itera-blue font-bold hover:underline"
                            >
                                {mode === 'login' ? 'Sign up now' : 'Log in here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
