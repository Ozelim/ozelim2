// ─── Option helpers ───────────────────────────────────────────────────────────
// ─── Regions ──────────────────────────────────────────────────────────────────
export const REGIONS = [
  { value: '', label: 'Весь Казахстан' },
  { value: 'astana', label: 'Астана' },
  { value: 'almaty', label: 'Алматы' },
  { value: 'aktau', label: 'Актау' },
  { value: 'atyrau', label: 'Атырау' },
  { value: 'aktobe', label: 'Актобе' },
  { value: 'uralsk', label: 'Уральск' },
  { value: 'kostanay', label: 'Костанай' },
  { value: 'petropavlovsk', label: 'Петропавловск' },
  { value: 'kokshetau', label: 'Кокшетау' },
  { value: 'pavlodar', label: 'Павлодар' },
  { value: 'semey', label: 'Семей' },
  { value: 'ust-kamenogorsk', label: 'Усть-Каменогорск' },
  { value: 'karaganda', label: 'Караганда' },
  { value: 'zhezkazgan', label: 'Жезказган' },
  { value: 'kyzylorda', label: 'Кызылорда' },
  { value: 'konaev', label: 'Конаев' },
  { value: 'taldykorgan', label: 'Талдыкорган' },
  { value: 'turkestan', label: 'Туркестан' },
  { value: 'taraz', label: 'Тараз' },
  { value: 'shymkent', label: 'Шымкент' },
]

// ─── Resorts ──────────────────────────────────────────────────────────────────
export const RESORTS = [
  { value: '', label: 'Любой курорт' },
  { value: 'astana', label: 'Астана' },
  { value: 'almaty', label: 'Алматы' },
  { value: 'aktau', label: 'Актау' },
  { value: 'alakol', label: 'Алаколь' },
  { value: 'balkhash', label: 'Балхаш' },
  { value: 'bayanaul', label: 'Баянаул' },
  { value: 'borovoe', label: 'Боровое' },
  { value: 'buhtarma', label: 'Бухтарма' },
  { value: 'zaysan', label: 'Зайсан' },
  { value: 'katon', label: 'Катон-Карагай' },
  { value: 'kapchagay', label: 'Капчагай' },
  { value: 'mangyshlak', label: 'Мангышлак (Мангистау)' },
  { value: 'saryagash', label: 'Сарыагаш' },
  { value: 'turkestan', label: 'Туркестан' },
]

// ─── Tour types ───────────────────────────────────────────────────────────────
export const TOUR_TYPES = [
  { value: 'excursion', label: 'Экскурсионный тур' },
  { value: 'cultural', label: 'Культурно-познавательный тур' },
  { value: 'ski', label: 'Горнолыжный отдых' },
  { value: 'family', label: 'Семейный отдых (с детьми)' },
  { value: 'active', label: 'Спортивно-активный отдых' },
  { value: 'health', label: 'Оздоровительный отдых' },
  { value: 'beach', label: 'Пляжный отдых' },
  { value: 'pilgrim', label: 'Религиозно-паломнический тур' },
  { value: 'business', label: 'Деловой тур' },
  { value: 'shopping', label: 'Шоп-туры' },
  { value: 'passive', label: 'Пассивный отдых' },
  { value: 'language', label: 'Языковые туры (казахский, английский)' },
  { value: 'production', label: 'Производственный тур' },
  { value: 'teambuilding', label: 'Тимбилдинг' },
  { value: 'ethno', label: "Этно-тур «Өлке тану»" },
  { value: 'craft', label: 'Ремесленный тур' },
  { value: 'festival', label: 'Фестивальный и событийный тур' },
  { value: 'wedding', label: 'Свадебный тур' },
  { value: 'jubilee', label: 'Юбилейный тур' },
  { value: 'city', label: 'Городской тур' },
]

// ─── Hotel class ──────────────────────────────────────────────────────────────
export const HOTEL_CLASSES = [
  { value: '', label: 'Любой класс' },
  { value: '1', label: '1 ★' },
  { value: '2', label: '2 ★★' },
  { value: '3', label: '3 ★★★' },
  { value: '4', label: '4 ★★★★' },
  { value: '5', label: '5 ★★★★★' },
]

// ─── Accommodation types ──────────────────────────────────────────────────────
export const ACCOMMODATION_TYPES = [
  { value: 'hotel', label: 'Отель' },
  { value: 'pansion', label: 'Пансионат' },
  { value: 'base', label: 'База отдыха' },
  { value: 'guesthouse', label: 'Гостевой дом' },
  { value: 'apartments', label: 'Апартаменты' },
  { value: 'villa', label: 'Вилла' },
  { value: 'hostel', label: 'Хостел' },
]

// ─── Meal plans ───────────────────────────────────────────────────────────────
export const MEAL_PLANS = [
  { value: '', label: 'Любое питание' },
  { value: 'BB', label: 'BB — только завтрак' },
  { value: 'HB', label: 'HB — завтрак + ужин' },
  { value: 'FB', label: 'FB — полный пансион' },
  { value: 'AI', label: 'AI — всё включено' },
  { value: 'UAI', label: 'UAI — ультра всё включено' },
]

// ─── Currencies ───────────────────────────────────────────────────────────────
export const CURRENCIES = [
  { value: 'KZT', label: '₸ KZT' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
]

// ─── Hotel services ───────────────────────────────────────────────────────────

export const SERVICE_GROUPS = [
  {
    id: 'beach',
    label: 'Пляж и расположение',
    icon: '🏖',
    items: [
      { value: 'firstline', label: 'Первая линия' },
      { value: 'ownbeach', label: 'Свой пляж' },
      { value: 'sandbeach', label: 'Песчаный пляж' },
      { value: 'pebblebeach', label: 'Галечный пляж' },
    ],
  },
  {
    id: 'hotel',
    label: 'В отеле',
    icon: '🏨',
    items: [
      { value: 'wifi', label: 'Wi-Fi' },
      { value: 'waterslides', label: 'Водные горки' },
      { value: 'pool', label: 'Бассейн' },
      { value: 'heatedpool', label: 'Бассейн с подогревом' },
      { value: 'spa', label: 'SPA' },
      { value: 'gym', label: 'Спортзал' },
      { value: 'tennis', label: 'Теннис' },
      { value: 'football', label: 'Футбол' },
      { value: 'restaurant', label: 'Ресторан / кафе' },
      { value: 'disco', label: 'Дискотека' },
      { value: 'animation', label: 'Анимация' },
    ],
  },
  {
    id: 'features',
    label: 'Особенности',
    icon: '⭐',
    items: [
      { value: 'pets', label: 'Можно с животными' },
      { value: 'family', label: 'Семейный' },
      { value: 'vip', label: 'VIP' },
      { value: 'adultsonly', label: 'Только для взрослых' },
      { value: 'newhotel', label: 'Новый отель' },
      { value: 'singlemen', label: 'Одиноким мужчинам' },
    ],
  },
  {
    id: 'room',
    label: 'В номере',
    icon: '🛏',
    items: [
      { value: 'ac', label: 'Кондиционер' },
      { value: 'kitchen', label: 'Кухня' },
      { value: 'balcony', label: 'Балкон' },
      { value: 'roomwifi', label: 'Wi-Fi в номере' },
    ],
  },
  {
    id: 'kids',
    label: 'Для детей',
    icon: '👶',
    items: [
      { value: 'kidsslides', label: 'Водные горки' },
      { value: 'playground', label: 'Детская площадка' },
      { value: 'kidsanim', label: 'Детская анимация' },
      { value: 'miniclub', label: 'Мини-клуб' },
      { value: 'kidsmenu', label: 'Детское меню' },
    ],
  },
]

// ─── Filter state type ────────────────────────────────────────────────────────
// Remove interface, just export a plain object for default filter
export const DEFAULT_FILTER = {
  region: '',
  resort: '',
  tourTypes: [],
  dateFrom: null,
  dateTo: null,
  adults: 2,
  children: 0,
  hotelClass: '',
  accommodation: [],
  meal: '',
  budgetMin: 0,
  budgetMax: 500000,
  currency: 'KZT',
  services: [],
}
