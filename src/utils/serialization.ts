export function toPlainObject<T>(instance: any): T {
  if (!instance || typeof instance !== 'object') {
    return instance;
  }

  if (Array.isArray(instance)) {
    return instance.map(item => toPlainObject(item)) as any;
  }

  // Convert Date objects to ISO strings
  if (instance instanceof Date) {
    return instance.toISOString() as any;
  }

  // Create a regular plain object instead of null prototype
  const plainObject: Record<string, any> = {};
  
  // Copy all enumerable properties
  for (const key of Object.keys(instance)) {
    plainObject[key] = toPlainObject(instance[key]);
  }

  return plainObject as T;
}
