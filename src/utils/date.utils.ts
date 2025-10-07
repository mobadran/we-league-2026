export function formatDateToEnglishDigits(dateStr?: string | null) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
    }).format(d); // returns English-month + Latin digits
  } catch {
    return dateStr;
  }
}
