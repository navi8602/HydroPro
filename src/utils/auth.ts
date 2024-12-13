
import { Permission } from '@prisma/client';

export type AccessLevel = 'full' | 'readonly' | 'metrics';

export function checkSystemAccess(permissions: Permission[], systemId: number): AccessLevel | null {
  const permission = permissions.find(p => p.systemId === systemId);
  return permission?.accessLevel || null;
}

export function canModifySystem(accessLevel: AccessLevel | null): boolean {
  return accessLevel === 'full';
}

export function canViewMetrics(accessLevel: AccessLevel | null): boolean {
  return accessLevel === 'full' || accessLevel === 'metrics';
}

export function getAuthToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload.id?.toString() || null;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token);
}
