export function ensure<T>(v: T | null | undefined, message: string, status: number = 400): T {
  if (!v) throw createError({ message, status });
  return v;
}
