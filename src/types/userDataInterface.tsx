export interface SocialLinks {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
}

export interface userDataInterface {
    uid: string, 
    email: string, 
    username: string, 
    name: string, 
    avatar: string,
    bio?: string,
    website?: string,
    socialLinks?: SocialLinks
};
