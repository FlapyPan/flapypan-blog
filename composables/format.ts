import type { MaybeRefOrGetter } from 'vue';

type MaybeDate = number | string | Date;
type DateFormat = `${string}-${string}-${string}` | '-';
type DateTimeFormat = `${string}-${string}-${string}` | '-';

export function dateFormat(maybeDate?: MaybeDate): DateFormat {
  if (!maybeDate) return '-';
  const date = new Date(maybeDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useDateFormat(date?: MaybeRefOrGetter<number | string | Date>) {
  return computed(() => dateFormat(toRef(date).value));
}

export function dateTimeFormat(maybeDate?: MaybeDate): DateTimeFormat {
  if (!maybeDate) return '-';
  const date = new Date(maybeDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function useDateTimeFormat(date?: MaybeRefOrGetter<number | string | Date>) {
  return computed(() => dateTimeFormat(toRef(date).value));
}
