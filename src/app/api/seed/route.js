import { NextResponse } from "next/server";
import sql from "@/lib/db";

const INCLUDES = [
  "Трансфер по маршруту",
  "Проживание в отелях 3–4★",
  "Завтраки и ужины",
  "Профессиональный гид",
  "Входные билеты в нацпарки",
  "Страховка",
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80", caption: "Боровое — жемчужина Казахстана" },
  { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80", caption: "Кольсайские озёра" },
  { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=900&q=80", caption: "Горные леса Северного Тянь-Шаня" },
  { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80", caption: "Чарынский каньон на закате" },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80", caption: "Горные маршруты" },
  { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80", caption: "Озеро Каинды" },
];

const ITINERARY = [
  { day: 1, title: "Прибытие в Астану", place: "Астана", icon: "Sunrise", img: "https://images.unsplash.com/photo-1567520007207-69929c99b6e4?w=600&q=75", description: "Встреча в аэропорту, трансфер в отель. Вечерняя прогулка по набережной Есиля — знакомство с архитектурными жемчужинами столицы и панорамой футуристических небоскрёбов." },
  { day: 2, title: "Переезд в Боровое", place: "Акмолинская обл.", icon: "Bus", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=75", description: "Живописная дорога через степи Казахстана (3.5 ч). По приезде — размещение на берегу озера Щучье, вечерний костёр под звёздным небом." },
  { day: 3, title: "Лес и озёра Борового", place: "Боровое", icon: "TreePine", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75", description: "Треккинг по сосновому бору к скале Окжетпес («птица не долетит»). Купание в кристальном озере Большое Чебачье, прогулка на лодке к острову с легендарным камнем Жумбактас." },
  { day: 4, title: "Горные маршруты", place: "Боровое", icon: "Mountain", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=75", description: "Восхождение на пик Синюха (947 м) — панорамный вид на всё Боровое. Для желающих — маршрут лёгкой сложности вдоль берега озера. Вечером — дегустация блюд казахской кухни." },
  { day: 5, title: "Переезд в Алматы", place: "Алматы", icon: "Bus", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75", description: "Перелёт Астана → Алматы (1.5 ч). Размещение в отеле у подножия гор, вечерняя прогулка по Арбату — главной пешеходной улице города с уличными музыкантами и кафе." },
  { day: 6, title: "Медеу и Шымбулак", place: "Алматы", icon: "Waves", img: "https://images.unsplash.com/photo-1527549993586-dff825b37782?w=600&q=75", description: "Подъём на легендарный каток Медеу (1691 м), затем на канатной дороге — на горнолыжный курорт Шымбулак (2260 м). Потрясающий вид на заснеженные вершины Заилийского Алатау." },
  { day: 7, title: "Кольсайские озёра", place: "Кольсай", icon: "Waves", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=75", description: "Выезд на рассвете к Кольсайским озёрам (2.5 ч). Пешеходный маршрут: Нижнее озеро → Среднее озеро (3 ч, 6 км). Бирюзовая вода, ели, уходящие прямо в небо — фотосессия мечты." },
  { day: 8, title: "Озеро Каинды", place: "Алматинская обл.", icon: "TreePine", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=75", description: "Озеро Каинды — чудо природы: затопленный еловый лес прямо под водой. Опциональный дайвинг среди подводных деревьев. Возвращение через горный перевал с остановкой у водопада." },
  { day: 9, title: "Чарынский каньон", place: "Алматинская обл.", icon: "Compass", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=75", description: "«Долина замков» — красно-оранжевые скальные образования высотой до 150 м, напоминающие заброшенный средневековый город. Треккинг по дну каньона вдоль реки Чарын на закате." },
  { day: 10, title: "Возвращение домой", place: "Алматы", icon: "Sunrise", img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=75", description: "Прощальный завтрак с видом на горы. Свободное время для шопинга на Зелёном базаре (национальные сувениры, специи, сухофрукты). Трансфер в аэропорт с тёплыми воспоминаниями." },
];

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tours (
        id            SERIAL PRIMARY KEY,
        title         TEXT NOT NULL,
        subtitle      TEXT,
        country       TEXT,
        region        TEXT,
        days          INT,
        nights        INT,
        group_size    TEXT,
        rating        NUMERIC(3,1),
        reviews_count INT DEFAULT 0,
        price         INT,
        currency      TEXT DEFAULT '₸',
        is_hot        BOOLEAN DEFAULT false,
        description   TEXT,
        includes      JSONB DEFAULT '[]',
        gallery       JSONB DEFAULT '[]',
        itinerary     JSONB DEFAULT '[]'
      )
    `;

    const existing = await sql`SELECT id FROM tours WHERE id = 1`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO tours
          (title, subtitle, country, region, days, nights, group_size, rating, reviews_count, price, currency, is_hot, description, includes, gallery, itinerary)
        VALUES (
          'Сокровища Казахстана',
          'Боровое · Кольсай · Чарын',
          'Казахстан',
          'Акмолинская, Алматинская обл.',
          10, 9, '6–14', 4.9, 112, 185000, '₸', true,
          'Путешествие сквозь три жемчужины Казахстана — от сосновых берегов Борового до бирюзовых горных озёр Кольсай и огненного каньона Чарын. Маршрут сочетает мягкий размеренный отдых, треккинги любого уровня сложности и незабываемые панорамы, которые невозможно увидеть ни в одном другом месте планеты.',
          ${JSON.stringify(INCLUDES)},
          ${JSON.stringify(GALLERY)},
          ${JSON.stringify(ITINERARY)}
        )
      `;
    }

    return NextResponse.json({ ok: true, message: "БД готова" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
