// Mock user data — replace with real API calls

export const MOCK_USER = {
  id: 1,
  name: 'Алия Сейткали',
  email: 'aliya@example.kz',
  phone: '+7 777 123 45 67',
  city: 'Алматы',
  country: 'Казахстан',
  bio: 'Люблю горы и природу Казахстана. Путешествую с 2015 года.',
  avatar: 'https://i.pravatar.cc/150?img=47',
  joinDate: '2022-03-15',
  // 'none' | 'family' | 'corporate' | 'agent'
  activePackage: 'family',
  balance: 125000,
  bonus: 3840,
}

export const MOCK_TRIPS = [
  { id: 1, name: 'Боровое — лесной рай', date: '2024-07-10', duration: '5 дней', price: '85 000 ₸', status: 'completed', img: 'https://picsum.photos/seed/trip1/400/220' },
  { id: 2, name: 'Чарынский каньон', date: '2024-05-20', duration: '3 дня', price: '45 000 ₸', status: 'completed', img: 'https://picsum.photos/seed/trip2/400/220' },
  { id: 3, name: 'Алтай — горные вершины', date: '2025-08-01', duration: '10 дней', price: '150 000 ₸', status: 'active', img: 'https://picsum.photos/seed/trip3/400/220' },
  { id: 4, name: 'Кольсайские озёра', date: '2023-09-05', duration: '4 дня', price: '60 000 ₸', status: 'completed', img: 'https://picsum.photos/seed/trip4/400/220' },
  { id: 5, name: 'Актау — Каспийское море', date: '2023-07-14', duration: '7 дней', price: '95 000 ₸', status: 'completed', img: 'https://picsum.photos/seed/trip5/400/220' },
]

export const MOCK_VISITED = [
  { id: 1, name: 'Боровое', region: 'Акмолинская обл.', type: 'Лес', visits: 2, img: 'https://picsum.photos/seed/v1/400/260' },
  { id: 2, name: 'Чарынский каньон', region: 'Алматинская обл.', type: 'Каньон', visits: 1, img: 'https://picsum.photos/seed/v2/400/260' },
  { id: 3, name: 'Кольсайские озёра', region: 'Алматинская обл.', type: 'Озёра', visits: 1, img: 'https://picsum.photos/seed/v3/400/260' },
  { id: 4, name: 'Медеу', region: 'Алматы', type: 'Горы', visits: 3, img: 'https://picsum.photos/seed/v4/400/260' },
  { id: 5, name: 'Актау', region: 'Мангистауская обл.', type: 'Море', visits: 1, img: 'https://picsum.photos/seed/v5/400/260' },
  { id: 6, name: 'Баянаул', region: 'Павлодарская обл.', type: 'Нацпарк', visits: 1, img: 'https://picsum.photos/seed/v6/400/260' },
]

export const MOCK_FAVORITES = [
  { id: 1, name: 'Шымбулак', type: 'Горнолыжный курорт', region: 'Алматы', rating: 4.8, img: 'https://picsum.photos/seed/fav1/400/220' },
  { id: 2, name: 'Алтай — тур на 10 дней', type: 'Приключения', region: 'ВКО', rating: 4.9, img: 'https://picsum.photos/seed/fav2/400/220' },
  { id: 3, name: 'Большое Алматинское озеро', type: 'Природа', region: 'Алматы', rating: 4.9, img: 'https://picsum.photos/seed/fav3/400/220' },
  { id: 4, name: 'Туркестан — культурный тур', type: 'Культура', region: 'Туркестанская обл.', rating: 4.7, img: 'https://picsum.photos/seed/fav4/400/220' },
]

export const MOCK_REVIEWS = [
  { id: 1, tour: 'Боровое — лесной рай', date: '2024-07-16', rating: 5, text: 'Невероятное место! Чистые озёра, свежий воздух, отличная организация тура. Обязательно вернусь.', img: 'https://picsum.photos/seed/rev1/400/220' },
  { id: 2, tour: 'Чарынский каньон', date: '2024-05-25', rating: 4, text: 'Потрясающий каньон, гид был профессиональным. Минус один балл за жару — возьмите больше воды!', img: 'https://picsum.photos/seed/rev2/400/220' },
  { id: 3, tour: 'Кольсайские озёра', date: '2023-09-12', rating: 5, text: 'Одно из красивейших мест в Казахстане. Природа дикая, нетронутая. Рекомендую всем!', img: 'https://picsum.photos/seed/rev3/400/220' },
]

export const MOCK_FAMILY_MEMBERS = [
  { id: 1, name: 'Ерлан Сейткали', type: 'adult', relation: 'Супруг', age: 34 },
  { id: 2, name: 'Айгерим Сейткали', type: 'child', relation: 'Дочь', age: 8 },
  { id: 3, name: 'Даниял Сейткали', type: 'child', relation: 'Сын', age: 5 },
]

export const MOCK_EMPLOYEES = [
  { id: 1, name: 'Асель Нурова', email: 'asel@corp.kz', dept: 'Маркетинг', status: 'active' },
  { id: 2, name: 'Бауыржан Ахметов', email: 'baur@corp.kz', dept: 'Продажи', status: 'active' },
  { id: 3, name: 'Дина Касымова', email: 'dina@corp.kz', dept: 'HR', status: 'active' },
  { id: 4, name: 'Серик Мухамедов', email: 'serik@corp.kz', dept: 'IT', status: 'inactive' },
]

export const MOCK_AGENT_INVITES = [
  { id: 1, name: 'Камила Есенова', email: 'kamila@mail.kz', date: '2024-11-01', status: 'registered' },
  { id: 2, name: 'Темиртас Бегалин', email: 'temir@mail.kz', date: '2024-11-10', status: 'registered' },
  { id: 3, name: 'Акбота Жумагали', email: 'akbota@mail.kz', date: '2024-11-18', status: 'pending' },
  { id: 4, name: 'Нурлан Сарсенов', email: 'nurlan@mail.kz', date: '2024-12-02', status: 'registered' },
]

export const PACKAGE_FEATURES = {
  family: {
    name: 'Семейный',
    icon: '👨‍👩‍👧‍👦',
    price: '9 900 ₸/мес',
    color: 'emerald',
    features: ['До 2 взрослых + 3 детей', 'Общий кабинет', 'Скидка 15% на туры', 'Приоритетная поддержка'],
  },
  corporate: {
    name: 'Корпоративный',
    icon: '🏢',
    price: '49 900 ₸/мес',
    color: 'blue',
    features: ['До 20 сотрудников', 'Групповые скидки 20%', 'Корпоративные туры', 'Менеджер аккаунта'],
  },
  agent: {
    name: 'Агентский',
    icon: '🤝',
    price: '14 900 ₸/мес',
    color: 'amber',
    features: ['Реферальная программа', 'Комиссия 8% с продаж', 'Маркетинговые материалы', 'Доступ к B2B ценам'],
  },
}
