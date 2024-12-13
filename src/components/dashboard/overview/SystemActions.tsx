// src/components/dashboard/overview/SystemActions.tsx
interface SystemAction {
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
    disabled?: boolean;
}

interface SystemActionsProps {
    actions: SystemAction[];
}

export function SystemActions({ actions }: SystemActionsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map(action => (
                <button
                    key={action.id}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={`
            p-4 rounded-lg border text-center
            ${action.disabled
                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50 border-gray-200'}
          `}
                >
                    <span className="block text-2xl mb-2">{action.icon}</span>
                    <span className="text-sm font-medium">{action.label}</span>
                </button>
            ))}
        </div>
    );
}
