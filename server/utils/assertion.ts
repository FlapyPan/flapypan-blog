export function nonNullable<T>(
  v: T | null | undefined,
  message: string,
  status: number = 400,
): asserts v is NonNullable<T> {
  if (!v) throw createError({ message, statusCode: status })
}

export function ensure<T>(
  v: T | null | undefined,
  message: string,
  status: number = 400,
): NonNullable<T> {
  nonNullable(v, message, status)
  return v
}
