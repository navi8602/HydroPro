// src/components/plants/PlantManager/PlantStatusBadge.tsx
import { Badge } from '../../ui/Badge';

interface PlantStatusBadgeProps {
    status: 'healthy' | 'warning' | 'critical';
}

export function PlantStatusBadge({ status }: PlantStatusBadgeProps) {
    const variants = {
        healthy: 'success',
        warning: 'warning',
        critical: 'error'
    } as const;

    const labels = {
        healthy: 'Здоровое',
        warning: 'Требует внимания',
        critical: 'Критическое'
    };

    return (
        <Badge variant={variants[status]}>
            {labels[status]}
        </Badge>
    );
}
