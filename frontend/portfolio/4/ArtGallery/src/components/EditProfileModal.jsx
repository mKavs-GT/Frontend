import React, { useState, useEffect } from 'react';
import { FaTimes, FaCamera, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        favoriteMovies: '',
        favoriteTVShows: '',
        favoriteAnime: '',
        avatar: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                favoriteMovies: user.favoriteMovies || '',
                favoriteTVShows: user.favoriteTVShows || '',
                favoriteAnime: user.favoriteAnime || '',
                avatar: user.avatar
            });
            setPreviewImage(user.avatar);
        }
    }, [user]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (formData.bio && formData.bio.length > 500) {
            newErrors.bio = 'Bio must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            updateProfile(formData);
            onClose();
        }
    };

    return (
        <div className="edit-profile-overlay" onClick={onClose}>
            <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                <h2>Edit Profile</h2>

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    {/* Avatar Section */}
                    <div className="avatar-section">
                        <div className="avatar-preview">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" />
                            ) : (
                                <div className="avatar-placeholder">
                                    <FaUser size={50} />
                                </div>
                            )}
                            <label className="avatar-upload-btn">
                                <FaCamera />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                        <p className="avatar-hint">Click camera icon to upload photo</p>
                    </div>

                    {/* Basic Info */}
                    <div className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Your name"
                                className={errors.name ? 'input-error' : ''}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Tell us about yourself..."
                                rows="4"
                                className={errors.bio ? 'input-error' : ''}
                            />
                            {errors.bio && <span className="error-message">{errors.bio}</span>}
                            <div className="char-count" style={{ fontSize: '0.8rem', textAlign: 'right', color: formData.bio.length > 500 ? 'red' : '#888' }}>
                                {formData.bio.length}/500
                            </div>
                        </div>
                    </div>

                    {/* Favorites Section */}
                    <div className="form-section">
                        <h3>Your Favorites</h3>
                        <div className="form-group">
                            <label>Favorite Movies</label>
                            <input
                                type="text"
                                name="favoriteMovies"
                                value={formData.favoriteMovies}
                                onChange={handleInputChange}
                                placeholder="e.g., The Shawshank Redemption, Inception, Interstellar"
                            />
                        </div>

                        <div className="form-group">
                            <label>Favorite TV Shows</label>
                            <input
                                type="text"
                                name="favoriteTVShows"
                                value={formData.favoriteTVShows}
                                onChange={handleInputChange}
                                placeholder="e.g., Breaking Bad, Game of Thrones, The Office"
                            />
                        </div>

                        <div className="form-group">
                            <label>Favorite Anime</label>
                            <input
                                type="text"
                                name="favoriteAnime"
                                value={formData.favoriteAnime}
                                onChange={handleInputChange}
                                placeholder="e.g., Attack on Titan, Death Note, One Piece"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
