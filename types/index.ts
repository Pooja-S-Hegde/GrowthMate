export type UserProfile = {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
}

export type AuthResponse = {
    error: string | null;
    success: boolean;
}
