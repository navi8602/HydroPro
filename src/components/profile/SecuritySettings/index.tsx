// src/components/profile/SecuritySettings/index.tsx
import { PasswordChange } from './PasswordChange';
import { TwoFactorAuth } from './TwoFactorAuth';
import { SessionsManager } from './SessionsManager';
import { useAuth } from '../../../hooks/useAuth';

export function SecuritySettings() {
    const { updatePassword, setupTwoFactor, terminateSession } = useAuth();

    return (
        <div className="space-y-8">
            <PasswordChange onSubmit={updatePassword} />
            <TwoFactorAuth
                onEnable={setupTwoFactor.enable}
                onDisable={setupTwoFactor.disable}
            />
            <SessionsManager onTerminate={terminateSession} />
        </div>
    );
}
