// src/components/dashboard/stats/StatGroup.tsx
interface StatGroupProps {
    stats: Array<{
        id: string;
        title: string;
        value: number;
        total?: number;
        color: string;
        bgColor: string;
        icon?: React.ReactNode;
        trend?: {
            value: number;
            direction: 'up' | 'down';
        };
    }>;
}

export function StatGroup({ stats }: StatGroupProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(stat => (
                <StatCard key={stat.id} {...stat} />
            ))}
        </div>
    );
}
