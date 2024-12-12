
import { resolve as pathResolve } from 'path';
import { readFileSync } from 'fs';

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.endsWith('.ts')) {
    const resolved = await defaultResolve(specifier, context, defaultResolve);
    resolved.format = 'module';
    return resolved;
  }
  return defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith('.ts')) {
    const filePath = pathResolve(url.substring(7));
    const source = readFileSync(filePath, 'utf8');
    return { format: 'module', source };
  }
  return defaultLoad(url, context, defaultLoad);
}
