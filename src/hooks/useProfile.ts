// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { UserService } from '../api/services/user.service';
import type { User, UserSettings } from '../types/user';

export function useProfile() {
    const [profile, setProfile] = useState<User | null>(null);
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const [profileData, settingsData] = await Promise.all([
                UserService.getProfile(),
                UserService.getSettings()
            ]);

            setProfile(profileData.data);
            setSettings(settingsData.data);
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (data: Partial<User>) => {
        try {
            const { data: updatedProfile } = await UserService.updateProfile(data);
            setProfile(updatedProfile);
            return updatedProfile;
        } catch (err) {
            throw new Error('Failed to update profile');
        }
    };

    const updateSettings = async (data: Partial<UserSettings>) => {
        try {
            const { data: updatedSettings } = await UserService.updateSettings(data);
            setSettings(updatedSettings);
            return updatedSettings;
        } catch (err) {
            throw new Error('Failed to update settings');
        }
    };

    return {
        profile,
        settings,
        loading,
        error,
        updateProfile,
        updateSettings,
        refresh: fetchProfile
    };
}
