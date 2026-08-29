import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGoogle } from 'react-icons/fa';
import logo from '../assets/logo.png';

const GoogleLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');

    const handleGoogleSignIn = (e) => {
        e.preventDefault();
        // Simulate Google Auth Success
        login({
            name: 'Google User',
            email: email || 'google_user@gmail.com',
            avatar: 'https://lh3.googleusercontent.com/a-/AOh14Gg...',
            provider: 'google'
        });
        navigate('/profile'); // Redirect to profile or home
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f2f5',
            color: '#202124'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '48px 40px 36px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center'
            }}>
                <img src={logo} alt="FilmAura Logo" style={{ height: '50px', marginBottom: '24px', objectFit: 'contain' }} />
                <h1 style={{ fontSize: '24px', fontWeight: '400', marginBottom: '8px', color: '#202124' }}>Sign in</h1>
                <p style={{ fontSize: '16px', marginBottom: '40px' }}>to continue to FilmAura</p>

                <form onSubmit={handleGoogleSignIn} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <input
                            type="email"
                            placeholder="Email or phone"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '13px 15px',
                                border: '1px solid #dadce0',
                                borderRadius: '4px',
                                fontSize: '16px',
                                color: '#202124',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '40px' }}>
                        <button type="submit" style={{
                            backgroundColor: '#1a73e8',
                            color: 'white',
                            border: 'none',
                            padding: '10px 24px',
                            borderRadius: '4px',
                            fontWeight: '500',
                            fontSize: '14px',
                            cursor: 'pointer'
                        }}>
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoogleLogin;
