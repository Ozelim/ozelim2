// Детерминированное форматирование чисел с разделителем тысяч.
//
// Важно: НЕ используем Number.toLocaleString('ru-RU') в клиентских компонентах,
// которые рендерятся и на сервере (SSR), и на клиенте (гидрация) — ICU в Node
// даёт U+00A0 как разделитель, а в браузере U+202F, из-за чего возникает
// hydration mismatch (и как следствие — ошибка про <script> в ThemeProvider).
//
// Здесь чистый JS без Intl → результат идентичен на сервере и клиенте.
export function fmtNum(value) {
  const n = Math.round(Number(value) || 0);
  const sign = n < 0 ? "-" : "";
  return sign + Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Цена с символом тенге.
export function fmtPrice(value) {
  return `${fmtNum(value)} ₸`;
}
