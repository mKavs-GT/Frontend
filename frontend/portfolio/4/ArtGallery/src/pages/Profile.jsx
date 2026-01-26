import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa'; // Import FaUser
import MovieCard from '../components/MovieCard';
import EditProfileModal from '../components/EditProfileModal';
import '../styles/Profile.css';

const Profile = () => {
    const { user, logout, watchList } = useAuth();
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="profile-page container flex-center" style={{ height: '100vh', flexDirection: 'column' }}>
                <h2>Please Sign In to view your profile</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="profile-page container">
            <div className="profile-header">
                <div className="profile-info">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="profile-avatar-lg" />
                    ) : (
                        <div className="profile-avatar-placeholder" style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '1.5rem'
                        }}>
                            <FaUser size={40} color="#888" />
                        </div>
                    )}
                    <div className="profile-text">
                        <h1>{user.name || 'FilmAura User'}</h1>
                        <p>{user.email}</p>
                        <div className="profile-badges">
                            <span className="badge premium">Premium Member</span>
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn btn-secondary" style={{ marginRight: '1rem' }} onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
                    <button className="btn btn-primary" onClick={handleLogout}>Sign Out</button>
                </div>
            </div>

            {/* Bio and Favorites Section */}
            {(user.bio || user.favoriteMovies || user.favoriteTVShows || user.favoriteAnime) && (
                <div className="profile-details">
                    {user.bio && (
                        <div className="detail-section">
                            <h3>About</h3>
                            <p>{user.bio}</p>
                        </div>
                    )}

                    {user.favoriteMovies && (
                        <div className="detail-section">
                            <h3>Favorite Movies</h3>
                            <p>{user.favoriteMovies}</p>
                        </div>
                    )}

                    {user.favoriteTVShows && (
                        <div className="detail-section">
                            <h3>Favorite TV Shows</h3>
                            <p>{user.favoriteTVShows}</p>
                        </div>
                    )}

                    {user.favoriteAnime && (
                        <div className="detail-section">
                            <h3>Favorite Anime</h3>
                            <p>{user.favoriteAnime}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="profile-section">
                <h3 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0 }}>My Watch List</h3>
                {watchList.length > 0 ? (
                    <div className="content-grid">
                        {watchList.map((movie, idx) => (
                            <MovieCard key={idx} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-list-message" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <p>Your watch list is empty. Add movies and shows to watch later!</p>
                        <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '10px' }}>
                            Browse Content
                        </button>
                    </div>
                )}
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};

export default Profile;
