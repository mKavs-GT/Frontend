
import React from 'react';
import Logo from './Logo';

export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black/40 backdrop-blur-md">
            <div className="h-20 mb-8">
                <Logo className="h-full animate-pulse" />
            </div>
            <div className="w-48 h-1 bg-gradient-to-r from-waypoint-secondary to-waypoint-primary mt-4 rounded-full overflow-hidden">
                <div className="h-1 bg-white w-1/2 animate-loading-bar rounded-full"></div>
            </div>
            <style>{`
            @keyframes loading-bar {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
            .animate-loading-bar {
                animation: loading-bar 1.5s infinite linear;
            }
        `}</style>
        </div>
    );
}
