// src/components/dashboard/grid/SystemGridFilter.tsx
interface SystemGridFilterProps {
    filters: {
        status: string[];
        search: string;
    };
    onFilterChange: (filters: SystemGridFilterProps['filters']) => void;
}

export function SystemGridFilter({ filters, onFilterChange }: SystemGridFilterProps) {
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Поиск систем..."
                    value={filters.search}
                    onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                />
                <select
                    value={filters.status.join(',')}
                    onChange={(e) => onFilterChange({
                        ...filters,
                        status: e.target.value ? e.target.value.split(',') : []
                    })}
                    className="px-4 py-2 border rounded-lg"
                >
                    <option value="">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="warning">Требуют внимания</option>
                    <option value="error">С ошибками</option>
                </select>
            </div>
        </div>
    );
}
