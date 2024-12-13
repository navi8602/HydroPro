// src/components/common/LoadingState.tsx
export function LoadingState({ message = 'Загрузка...' }) {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="space-y-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                <p className="text-gray-500">{message}</p>
            </div>
        </div>
    );
}
