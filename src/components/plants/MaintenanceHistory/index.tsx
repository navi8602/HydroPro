// src/components/plants/MaintenanceHistory/index.tsx
import { MaintenanceRecord } from './MaintenanceRecord';
import { AddMaintenanceForm } from './AddMaintenanceForm';
import type { MaintenanceRecord as TMaintenanceRecord } from '../../../types/plant';

interface MaintenanceHistoryProps {
    records: TMaintenanceRecord[];
    onAddRecord: (record: Partial<TMaintenanceRecord>) => Promise<void>;
}

export function MaintenanceHistory({
                                       records,
                                       onAddRecord
                                   }: MaintenanceHistoryProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">История обслуживания</h3>
                <AddMaintenanceForm onAdd={onAddRecord} />
            </div>

            <div className="space-y-4">
                {records.map(record => (
                    <MaintenanceRecord
                        key={record.id}
                        record={record}
                    />
                ))}

                {records.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                        История обслуживания пуста
                    </p>
                )}
            </div>
        </div>
    );
}
