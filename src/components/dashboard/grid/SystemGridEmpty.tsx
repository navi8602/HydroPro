// src/components/dashboard/grid/SystemGridEmpty.tsx
export function SystemGridEmpty() {
    return (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <span className="block text-3xl mb-4">🌱</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                Нет активных систем
            </h3>
            <p className="text-gray-500 mb-4">
                Арендуйте вашу первую гидропонную систему, чтобы начать выращивание
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent
                         text-sm font-medium rounded-md text-white bg-indigo-600
                         hover:bg-indigo-700">
                Арендовать систему
            </button>
        </div>
    );
}
