// src/components/profile/ProfileHeader/index.tsx
import { Avatar } from './Avatar';
import { ProfileInfo } from './ProfileInfo';
import { ProfileActions } from './ProfileActions';
import type { User } from '../../../types/user';

interface ProfileHeaderProps {
    user: User;
    onEdit: () => void;
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Avatar src={user.avatar} name={user.name} />
                <ProfileInfo user={user} />
            </div>
            <ProfileActions onEdit={onEdit} />
        </div>
    );
}
