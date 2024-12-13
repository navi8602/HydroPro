// src/components/dashboard/alerts/AlertBadge.tsx
type AlertSeverity = 'info' | 'warning' | 'error' | 'success';

interface AlertBadgeProps {
    severity: AlertSeverity;
    children: React.ReactNode;
}

const severityStyles: Record<AlertSeverity, string> = {
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800'
};

export function AlertBadge({ severity, children }: AlertBadgeProps) {
    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${severityStyles[severity]}
    `}>
      {children}
    </span>
    );
}
