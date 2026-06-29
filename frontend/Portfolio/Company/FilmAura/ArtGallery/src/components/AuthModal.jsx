import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import '../styles/AuthModal.css';

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, login } = useAuth();
    const [method, setMethod] = useState('email'); // 'email' or 'phone'
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact: '', // email or phone
        password: ''
    });
    const navigate = useNavigate();

    if (!isAuthModalOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login with entered data
        login({
            name: formData.name || (isSignUp ? 'New User' : 'User'),
            email: formData.contact || 'user@example.com',
            // No default avatar here, will handle in component
            avatar: null
        });
    };

    const handleGoogleLogin = () => {
        closeAuthModal();
        navigate('/google-login');
    };

    const toggleMode = () => setIsSignUp(!isSignUp);

    return (
        <div className="auth-overlay">
            <div className="auth-modal">
                <button className="close-btn" onClick={closeAuthModal}><FaTimes /></button>

                <div className="auth-logo">
                    <img src={logo} alt="FilmAura Logo" className="auth-logo-img" />
                </div>
                <h2>{isSignUp ? 'Create Account' : 'Sign In to FilmAura'}</h2>

                <div className="auth-tabs">
                    <button
                        className={`tab ${method === 'email' ? 'active' : ''}`}
                        onClick={() => setMethod('email')}
                    >
                        Email
                    </button>
                    <button
                        className={`tab ${method === 'phone' ? 'active' : ''}`}
                        onClick={() => setMethod('phone')}
                    >
                        Phone
                    </button>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    {isSignUp && (
                        <div className="form-group">
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                    )}

                    {method === 'email' ? (
                        <div className="form-group">
                            <input type="email" name="contact" placeholder="Email Address" value={formData.contact} onChange={handleInputChange} required />
                        </div>
                    ) : (
                        <div className="form-group">
                            <input type="tel" name="contact" placeholder="Phone Number" value={formData.contact} onChange={handleInputChange} required />
                        </div>
                    )}

                    <div className="form-group">
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button className="btn btn-secondary btn-block flex-center" onClick={handleGoogleLogin}>
                    <FaGoogle style={{ marginRight: '10px' }} /> Continue with Google
                </button>

                <p className="auth-footer">
                    {isSignUp ? 'Already have an account?' : 'New to FilmAura?'}
                    <span className="text-link" onClick={toggleMode} style={{ marginLeft: '5px' }}>
                        {isSignUp ? 'Sign In.' : 'Sign up now.'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
