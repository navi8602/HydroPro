
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
  return localStorage.getItem('token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token);
}
