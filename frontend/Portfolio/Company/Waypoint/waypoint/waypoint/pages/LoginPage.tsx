
import React from 'react';
import { Page } from '../types';
import Logo from '../components/Logo';
import ImgFallback from '../components/ImgFallback';

interface LoginPageProps {
    setPage: (page: Page) => void;
}

export default function LoginPage({ setPage }: LoginPageProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4">
            <ImgFallback src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80" alt="login-bg" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md bg-waypoint-darkest/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl shadow-waypoint-primary/20 border border-white/10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <Logo className="h-16 w-auto mx-auto" onClick={() => setPage('home')} />
                    <p className="text-gray-400 mt-4">Welcome back, explorer.</p>
                </div>
                <form className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-gray-400 block mb-2">Email Address</label>
                        <input type="email" className="w-full bg-gray-800 p-3 rounded-lg border-2 border-transparent focus:border-waypoint-secondary focus:outline-none transition-colors" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-400 block mb-2">Password</label>
                        <input type="password" className="w-full bg-gray-800 p-3 rounded-lg border-2 border-transparent focus:border-waypoint-secondary focus:outline-none transition-colors" placeholder="••••••••" />
                    </div>
                    <div className="text-right">
                        <a href="#" className="text-sm text-gray-400 hover:text-waypoint-accent transition-colors">Forgot Password?</a>
                    </div>
                    <div>
                        <button onClick={(e) => { e.preventDefault(); setPage('home'); }} className="w-full py-3 bg-gradient-to-r from-waypoint-primary to-waypoint-darkest text-white font-extrabold rounded-lg text-lg shadow-lg hover:shadow-waypoint-primary/30 transition-all border border-white/10">
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-400 text-sm mt-8">
                    Don't have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setPage('signup') }} className="font-bold text-waypoint-accent hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
