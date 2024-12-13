// src/components/dashboard/actions/ActionButton.tsx
interface ActionButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export function ActionButton({
                                 icon,
                                 label,
                                 onClick,
                                 disabled = false,
                                 loading = false
                             }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        flex items-center justify-center p-4 rounded-lg border
        transition-colors w-full
        ${disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 border-gray-200'}
      `}
        >
            <div className="flex flex-col items-center">
        <span className="text-2xl mb-2">
          {loading ? '🔄' : icon}
        </span>
                <span className="text-sm font-medium">
          {loading ? 'Выполняется...' : label}
        </span>
            </div>
        </button>
    );
}
