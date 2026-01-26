import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const slangMessages = [
    "Checking the vibe... 💅",
    "Loading... no cap. 🧢",
    "Manifesting your content... ✨",
    "Main character energy incoming... 🎭",
    "Slaying the bits and bytes... ⚡",
    "Vibe check in progress... 🔍",
    "Go touch grass while this loads... 🌱",
    "It's giving fast internet... NOT. 💀",
    "Sending immaculate vibes... 💖",
    "Hold up, let him cook... 👨‍🍳"
];

const LoadingScreen = ({ fadeOut }) => {
    const [message, setMessage] = useState(slangMessages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * slangMessages.length);
            setMessage(slangMessages[randomIndex]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
            <div className="loading-content">
                <h1 className="loading-title glitch" data-text="SARA.CODES">SARA.CODES</h1>
                <div className="loading-bar-container">
                    <div className="loading-bar"></div>
                </div>
                <p className="loading-text keyframe-text" key={message}>{message}</p>
            </div>
            <div className="loading-overlay"></div>
        </div>
    );
};

export default LoadingScreen;
