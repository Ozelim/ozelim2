import sql from "@/lib/db";

const SEED_DIRECTIONS = [
  "Баянаул",
  "Катон-Карагай",
  "Кольсай",
  "Каинды",
  "Туркестан",
  "Балхаш",
  "Актау",
  "Бухтарма",
  "Капчагай",
  "Астана",
  "Зайсан",
  "Алматы",
  "Сарыагаш",
  "Боровое",
  "Бозжыра",
  "Чарынский каньон",
  "Алаколь/Акши",
  "Алаколь/Кабанбай",
  "Белуха",
  "Маркаколь",
];

const SEED_BAYANAUL_BASES = [
  "Зона отдыха Султан",
  "Зона отдыха Ritz Carlton",
];

const SEED_SULTAN_SERVICES = [
  { name: "3-х разовое питание", price_adult: 5000, price_child: 2500 },
  { name: "ЖД билет", price_adult: 20000, price_child: 10000 },
  { name: "Гид экскурсовод", price_adult: 8500, price_child: 6500 },
];

let initialized = false;

export async function ensureResortTables() {
  if (initialized) return;

  await sql`
    CREATE TABLE IF NOT EXISTS resort_directions (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL UNIQUE,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS resort_bases (
      id           SERIAL PRIMARY KEY,
      direction_id INT NOT NULL REFERENCES resort_directions(id) ON DELETE CASCADE,
      name         TEXT NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS resort_services (
      id          SERIAL PRIMARY KEY,
      base_id     INT NOT NULL REFERENCES resort_bases(id) ON DELETE CASCADE,
      name        TEXT NOT NULL,
      price_adult INT NOT NULL DEFAULT 0,
      price_child INT NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  const existing = await sql`SELECT COUNT(*)::int AS c FROM resort_directions`;
  if (existing[0]?.c === 0) {
    for (let i = 0; i < SEED_DIRECTIONS.length; i++) {
      await sql`
        INSERT INTO resort_directions (name, sort_order)
        VALUES (${SEED_DIRECTIONS[i]}, ${i})
        ON CONFLICT (name) DO NOTHING
      `;
    }

    const bayanaul = await sql`
      SELECT id FROM resort_directions WHERE name = ${"Баянаул"} LIMIT 1
    `;
    const bayanaulId = bayanaul[0]?.id;
    if (bayanaulId) {
      for (const baseName of SEED_BAYANAUL_BASES) {
        await sql`
          INSERT INTO resort_bases (direction_id, name)
          VALUES (${bayanaulId}, ${baseName})
        `;
      }

      const sultan = await sql`
        SELECT id FROM resort_bases
        WHERE direction_id = ${bayanaulId} AND name = ${"Зона отдыха Султан"}
        LIMIT 1
      `;
      const sultanId = sultan[0]?.id;
      if (sultanId) {
        for (const s of SEED_SULTAN_SERVICES) {
          await sql`
            INSERT INTO resort_services (base_id, name, price_adult, price_child)
            VALUES (${sultanId}, ${s.name}, ${s.price_adult}, ${s.price_child})
          `;
        }
      }
    }
  }

  initialized = true;
}

export async function listDirections() {
  await ensureResortTables();
  return await sql`
    SELECT id, name, sort_order
    FROM resort_directions
    ORDER BY sort_order ASC, name ASC
  `;
}

export async function listBases(directionId) {
  await ensureResortTables();
  if (directionId) {
    return await sql`
      SELECT id, direction_id, name
      FROM resort_bases
      WHERE direction_id = ${directionId}
      ORDER BY name ASC
    `;
  }
  return await sql`
    SELECT b.id, b.direction_id, b.name, d.name AS direction_name
    FROM resort_bases b
    JOIN resort_directions d ON d.id = b.direction_id
    ORDER BY d.name ASC, b.name ASC
  `;
}

export async function listServices(baseId) {
  await ensureResortTables();
  if (baseId) {
    return await sql`
      SELECT id, base_id, name, price_adult, price_child
      FROM resort_services
      WHERE base_id = ${baseId}
      ORDER BY id ASC
    `;
  }
  return await sql`
    SELECT s.id, s.base_id, s.name, s.price_adult, s.price_child,
           b.name AS base_name, d.name AS direction_name
    FROM resort_services s
    JOIN resort_bases b ON b.id = s.base_id
    JOIN resort_directions d ON d.id = b.direction_id
    ORDER BY d.name ASC, b.name ASC, s.id ASC
  `;
}
