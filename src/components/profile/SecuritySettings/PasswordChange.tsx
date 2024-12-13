// src/components/profile/SecuritySettings/PasswordChange.tsx
import { useState } from 'react';
import { validatePassword } from '../../../utils/validation';

interface PasswordChangeProps {
    onSubmit: (oldPassword: string, newPassword: string) => Promise<void>;
}

export function PasswordChange({ onSubmit }: PasswordChangeProps) {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        const validation = validatePassword(formData.newPassword);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setErrors(['Пароли не совпадают']);
            return;
        }

        try {
            await onSubmit(formData.oldPassword, formData.newPassword);
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setErrors(['Не удалось обновить пароль']);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium">Изменение пароля</h3>

            {/* Form fields */}
            <div className="space-y-4">
                <input
                    type="password"
                    placeholder="Текущий пароль"
                    value={formData.oldPassword}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        oldPassword: e.target.value
                    }))}
                    className="input-field"
                />

                <input
                    type="password"
                    placeholder="Новый пароль"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        newPassword: e.target.value
                    }))}
                    className="input-field"
                />

                <input
                    type="password"
                    placeholder="Подтвердите новый пароль"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        confirmPassword: e.target.value
                    }))}
                    className="input-field"
                />
            </div>

            {errors.length > 0 && (
                <div className="text-red-600 text-sm">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            <button type="submit" className="btn-primary">
                Изменить пароль
            </button>
        </form>
    );
}
