export function dateFormat(maybeDate) {
  if (!maybeDate) return '-';
  const date = new Date(maybeDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useDateFormat(maybeRefOrGetterDate) {
  return computed(() => {
    const date = toRef(maybeRefOrGetterDate);
    return dateFormat(date.value);
  });
}

export function dateTimeFormat(maybeDate) {
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

export function useDateTimeFormat(maybeRefOrGetterDate) {
  return computed(() => {
    const date = toRef(maybeRefOrGetterDate);
    return dateTimeFormat(date.value);
  });
}
