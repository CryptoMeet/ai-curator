export function toPlainObject<T>(instance: any): T {
  return JSON.parse(JSON.stringify(instance));
}
