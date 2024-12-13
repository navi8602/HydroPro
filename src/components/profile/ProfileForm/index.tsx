// src/components/profile/ProfileForm/index.tsx
import { useState } from 'react';
import { ProfileBasicInfo } from './ProfileBasicInfo';
import { ProfileContacts } from './ProfileContacts';
import { ProfilePreferences } from './ProfilePreferences';
import type { User } from '../../../types/user';

interface ProfileFormProps {
    user: User;
    onUpdate: (data: Partial<User>) => Promise<void>;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onUpdate(formData);
            setIsEditing(false);
        } catch (err) {
            // Обработка ошибки
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <ProfileBasicInfo
                data={formData}
                onChange={setFormData}
                isEditing={isEditing}
            />
            <ProfileContacts
                data={formData}
                onChange={setFormData}
                isEditing={isEditing}
            />
            <ProfilePreferences
                data={formData}
                onChange={setFormData}
                isEditing={isEditing}
            />

            <div className="flex justify-end space-x-3">
                {isEditing ? (
                    <>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Сохранить
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData(user);
                                setIsEditing(false);
                            }}
                            className="btn-secondary"
                        >
                            Отмена
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                    >
                        Редактировать
                    </button>
                )}
            </div>
        </form>
    );
}
