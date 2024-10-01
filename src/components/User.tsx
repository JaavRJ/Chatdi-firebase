import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import "../css/User.css"; // Archivo CSS para el estilo

// Define la interfaz para el tipo de usuario
export interface User {
    avatar: string;
    username: string;
    bio: string;
    website: string;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        facebook?: string;
        linkedin?: string;
        github?: string;
        [key: string]: string | undefined;
    };
}

export const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const database = getDatabase();
        const userRef = ref(database, `users/${userId}`);

        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            setUser(userData);
        });
    }, [userId]);

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="all-container">
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="avatar-image"
                    />
                </div>
                <div className="profile-info">
                    <h2 className="profile-username">{user.username}</h2>
                    <p className="profile-bio">{user.bio}</p>
                    {user.website && (
                        <p className="profile-website">
                            <a href={user.website} target="_blank" rel="noopener noreferrer">
                                {user.website}
                            </a>
                        </p>
                    )}
                    <div className="social-links">
                        {user.socialLinks && Object.entries(user.socialLinks).map(([network, url]) => (
                            url && (
                                <a key={network} href={url} target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <i className={`fab fa-${network}`}></i>
                                </a>
                            )
                        ))}
                    </div>
                </div>
            </div>
            <div className="profile-content">
                <h4 className="profile-content-title">Publicaciones</h4>
                {/* Aquí podrías agregar una galería de imágenes o publicaciones del usuario */}
                <div className="posts-placeholder">Aquí se mostrarán las publicaciones del usuario.</div>
            </div>
        </div>
        </div>
    );
};
