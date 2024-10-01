import { getDatabase, ref, set } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import FChatContext from '../context/FChatContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faFacebook, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import '../css/Profile.css';

export interface SocialLinks {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
}

export interface UserData {
    uid: string;
    avatar: string;
    username: string;
    bio: string;
    website: any;
    socialLinks: SocialLinks;
    email: string;
    name: string;
    // Otros campos que pueda tener el usuario
}


export const Profile = () => {
    const { userData, loadingUser } = useContext(FChatContext);
    const [saveOK, setSaveOK] = useState(false);
    const [saveKO, setSaveKO] = useState(false);
    const [showInput, setShowInput] = useState<keyof SocialLinks | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({});

    useEffect(() => {
        if (userData && userData.socialLinks) {
            setSocialLinks(userData.socialLinks);
        }
    }, [userData]);
    console.log(socialLinks)
    console.log(userData)

    const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
        setSocialLinks({
            ...socialLinks,
            [platform]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (userData) {
            const form = document.getElementById("profile-form") as HTMLFormElement;
            const username = form.username.value;
            const bio = form.bio.value;
            const website = form.website.value;

            const newUser = {
                ...userData,
                username,
                bio,
                website,
                socialLinks,
            };
            console.log(newUser)
            saveUser(newUser);
        }
    };

    const saveUser = (user: UserData) => {
        const database = getDatabase();

        set(ref(database, 'users/' + user.uid), user).then(() => {
            setSaveOK(true);
            setTimeout(() => {
                setSaveOK(false);
            }, 3000);
        }).catch(() => {
            setSaveKO(true);
            setTimeout(() => {
                setSaveKO(false);
            }, 3000);
        });
    };

    const handleSocialClick = (platform: keyof SocialLinks) => {
        setShowInput(showInput === platform ? null : platform);
    };

    return (
        <div id="profile" className='profile'>
            {loadingUser && (
                <div className="text-center h3 d-flex align-items-center justify-content-center text-primary py-5">
                    <i className='fa fa-spinner fa-spin fa-2x ms-3' />
                </div>
            )}
            {!loadingUser && (
                <form id="profile-form" onSubmit={handleSubmit} className="profile-form">
                <div className="profile-image-container">
                    {userData?.avatar && (
                        <img src={userData.avatar} alt="Avatar" className="avatar-image" />
                    )}
                </div>
                <div className="profile-details">
                    <div className="row mb-4">
                        <div className="col">
                            <label htmlFor='username' className='form-label'>Username</label>
                            <input type="text" id="username" name="username" className='form-control' defaultValue={userData?.username} />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col">
                            <label htmlFor='bio' className='form-label'>Bio</label>
                            <textarea id="bio" name="bio" className='form-control' rows={2} defaultValue={userData?.bio} />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col">
                            <label htmlFor='website' className='form-label'>Website</label>
                            <input type="text" id="website" name="website" className='form-control' defaultValue={userData?.website} />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col d-flex flex-wrap justify-content-between">
                            <div className="social-icon-container">
                                <FontAwesomeIcon
                                    icon={faTwitter}
                                    className="social-icon"
                                    onClick={() => handleSocialClick('twitter')}
                                />
                                {showInput === 'twitter' && (
                                    <input
                                        type="text"
                                        id="twitter"
                                        name="twitter"
                                        className='social-input'
                                        placeholder='Enter your Twitter URL'
                                        value={socialLinks.twitter || ''}
                                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="social-icon-container">
                                <FontAwesomeIcon
                                    icon={faInstagram}
                                    className="social-icon"
                                    onClick={() => handleSocialClick('instagram')}
                                />
                                {showInput === 'instagram' && (
                                    <input
                                        type="text"
                                        id="instagram"
                                        name="instagram"
                                        className='social-input'
                                        placeholder='Enter your Instagram URL'
                                        value={socialLinks.instagram || ''}
                                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="social-icon-container">
                                <FontAwesomeIcon
                                    icon={faFacebook}
                                    className="social-icon"
                                    onClick={() => handleSocialClick('facebook')}
                                />
                                {showInput === 'facebook' && (
                                    <input
                                        type="text"
                                        id="facebook"
                                        name="facebook"
                                        className='social-input'
                                        placeholder='Enter your Facebook URL'
                                        value={socialLinks.facebook || ''}
                                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="social-icon-container">
                                <FontAwesomeIcon
                                    icon={faGithub}
                                    className="social-icon"
                                    onClick={() => handleSocialClick('github')}
                                />
                                {showInput === 'github' && (
                                    <input
                                        type="text"
                                        id="github"
                                        name="github"
                                        className='social-input'
                                        placeholder='Enter your Github URL'
                                        value={socialLinks.github || ''}
                                        onChange={(e) => handleSocialChange('github', e.target.value)}
                                    />
                                )}
                            </div>
                            <div className="social-icon-container">
                                <FontAwesomeIcon
                                    icon={faLinkedin}
                                    className="social-icon"
                                    onClick={() => handleSocialClick('linkedin')}
                                />
                                {showInput === 'linkedin' && (
                                    <input
                                        type="text"
                                        id="linkedin"
                                        name="linkedin"
                                        className='social-input'
                                        placeholder='Enter your LinkedIn URL'
                                        value={socialLinks.linkedin || ''}
                                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            {saveOK && (
                                <div className="alert alert-success mt-3" role="alert">
                                    <i className='fa fa-circle-check fa-solid'></i> Profile saved successfully!
                                </div>
                            )}
                            {saveKO && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    <i className='fa fa-circle-xmark fa-solid'></i> Error saving profile.
                                </div>
                            )}
                            {!saveOK && !saveKO && (
                                <button type='submit' className='btn btn-lg btn-primary text-white mt-3'>Save Changes</button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            
            )}
        </div>
    );
};
