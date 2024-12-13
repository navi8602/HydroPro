// src/components/profile/ProfileHeader/ProfileInfo.tsx
import { formatDate } from '../../../utils/date';
import type { User } from '../../../types/user';

interface ProfileInfoProps {
    user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="text-sm text-gray-500">
                <p>{user.email}</p>
                <p>Участник с {formatDate(user.joinDate)}</p>
            </div>
        </div>
    );
}
