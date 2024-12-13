// src/components/dashboard/grid/SystemGridItem.tsx
import { RentedSystem } from '../../../types/system';
import { SystemStatus } from '../overview/SystemStatus';
import { SystemMetrics } from '../overview/SystemMetrics';

interface SystemGridItemProps {
    system: RentedSystem;
    onSelect: (systemId: string) => void;
}

export function SystemGridItem({ system, onSelect }: SystemGridItemProps) {
    return (
        <div
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300
                 transition-colors cursor-pointer"
            onClick={() => onSelect(system.id)}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-medium">{system.name}</h3>
                    <p className="text-sm text-gray-500">
                        {system.plants.length} из {system.capacity} позиций занято
                    </p>
                </div>
                <SystemStatus
                    status={getSystemStatus(system)}
                    lastUpdate={system.metrics.lastUpdated}
                />
            </div>

            <SystemMetrics metrics={system.metrics} />
        </div>
    );
}
