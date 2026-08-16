// ─── Option helpers ───────────────────────────────────────────────────────────
// Список направлений приходит из таблицы resort_directions через /api/resort-directions.
// Список видов отдыха — из tours_relax_type через /api/relax-types.
//
// Все поля DEFAULT_FILTER соответствуют реальным колонкам tours / связям m2m.
// Удалены: adults/children (это параметры запроса туриста, не тура),
// accommodation, meal — нет соответствующих колонок в БД (форма создания
// тура их показывает, но не сохраняет).

// ─── Hotel class ──────────────────────────────────────────────────────────────
export const HOTEL_CLASSES = [
  { value: '', label: 'Любой класс' },
  { value: '1', label: '1 ★' },
  { value: '2', label: '2 ★★' },
  { value: '3', label: '3 ★★★' },
  { value: '4', label: '4 ★★★★' },
  { value: '5', label: '5 ★★★★★' },
]

// ─── Filter state defaults ────────────────────────────────────────────────────
// Валюты в системе нет — все цены безразмерные числа.
export const DEFAULT_FILTER = {
  directionId: '',
  tourTypes: [],
  dateFrom: null,
  dateTo: null,
  hotelClass: '',
  durationMinDays: 1,
  durationMaxDays: 7,
  priceMin: 0,
  priceMax: 500000,
  onlyPopular: false,
}
