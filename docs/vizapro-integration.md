# Приём заявок с vizapro.kz (server-to-server, оба на Next.js)

Сторонний сайт **vizapro.kz** (тоже на Next.js) отправляет заявки на наш
эндпоинт **со своего сервера**, с секретом в заголовке. Заявки падают в общую
таблицу `leads` (`kind = 'vizapro'`, `source = 'vizapro.kz'`) и видны в админке
**ozelim-admin2 → Заявки → таб «Vizapro»** наравне с остальными (статусы,
заметки, делегирование модераторам).

## Поток

```
[форма vizapro в браузере]
        │  POST на СВОЙ роут (тот же домен, без CORS)
        ▼
[Next.js API-роут vizapro]  ← здесь живёт секрет (server env, в браузер не уходит)
        │  POST + Authorization: Bearer <СЕКРЕТ>
        ▼
[ozelim2] POST /api/integrations/vizapro  → INSERT в leads + уведомление админам
```

Секрет (один и тот же на обеих сторонах) хранится только в серверном окружении.
В браузере его нет — поэтому утечь неоткуда.

---

## Наш эндпоинт

```
POST https://<домен-ozelim2>/api/integrations/vizapro
Content-Type: application/json
Authorization: Bearer <СЕКРЕТ>        (можно вместо этого X-Api-Key: <СЕКРЕТ>)
```

### Тело запроса (JSON)

| Поле            | Тип    | Обяз.            | Описание |
|-----------------|--------|------------------|----------|
| `name`          | string | **да**           | Имя клиента |
| `phone`         | string | да (или `email`) | Телефон |
| `email`         | string | да (или `phone`) | Email |
| `contactMethod` | string | нет              | `whatsapp` \| `phone` \| `telegram` \| `email` |
| `message`       | string | нет              | Комментарий/текст обращения |
| `externalId`    | string | нет (рекоменд.)  | ID заявки на стороне vizapro — защита от дублей |
| `source`        | string | нет              | Метка источника, по умолчанию `vizapro.kz` |
| `data`          | object | нет              | **Любые** поля анкеты — отрисуются в админке как есть |

Для краткой сводки в списке заявок мы подхватываем, если есть:
`service`, `visaType`, `country`, `destination`. Остальное из `data` показывается
в карточке заявки целиком.

### Ответы

| Код  | Тело | Когда |
|------|------|-------|
| 201  | `{ "ok": true, "lead": { "id": 123, "createdAt": "..." } }` | Создано |
| 200  | `{ "ok": true, "duplicate": true, "lead": {...} }` | `externalId` уже принимался — дубль не создан |
| 400  | `{ "error": "..." }` | Невалидное тело |
| 401  | `{ "error": "Unauthorized" }` | Нет или неверный секрет |
| 503  | `{ "error": "Integration is not configured" }` | На нашей стороне не задан секрет |
| 500  | `{ "error": "Server error" }` | Ошибка БД на нашей стороне |

---

## Что сделать на стороне vizapro (Next.js)

**1. Положить секрет в серверный env** (`.env` / переменные окружения деплоя):

```
OZELIM_WEBHOOK_URL=https://<домен-ozelim2>/api/integrations/vizapro
OZELIM_WEBHOOK_TOKEN=<ТОТ ЖЕ СЕКРЕТ, что и у нас>
```

> Важно: **без** префикса `NEXT_PUBLIC_` — иначе попадёт в браузер.

**2. Создать серверный роут-пересыльщик** `src/app/api/lead-to-ozelim/route.js`.

Форма vizapro уже шлёт плоский JSON с `name` и `phone` наверху + визовые поля.
Наша сторона сама заберёт контакты, а всё остальное сложит в `data`. Поэтому
роут просто пробрасывает тело как есть, добавив `source`:

```js
export async function POST(request) {
  const body = await request.json();

  const res = await fetch(process.env.OZELIM_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OZELIM_WEBHOOK_TOKEN}`,
    },
    body: JSON.stringify({
      ...body,                              // serviceType, country, services, name, phone…
      source: "vizapro.kz",
      externalId: body.externalId,          // если есть свой id — для защиты от дублей
    }),
  });

  const json = await res.json().catch(() => ({}));
  return Response.json(json, { status: res.status });
}
```

**3. Из формы (браузер) слать на свой же роут** — без секретов и без CORS.

> **ВАЖНО про значения выпадающих списков.** Для полей-селектов
> (`serviceType`, `tripPurpose`, `stayDuration`, `rvpBase`, `workType`,
> `contractDuration` и т.п.) слать **русскую подпись выбранного пункта**
> (тот текст, что видит пользователь), а НЕ внутренний код. Тогда в нашей
> админке всё сразу читается по-русски и ничего не нужно синхронизировать.
> Проще говоря — отправлять `option.label`, а не `option.value`.

```js
await fetch("/api/lead-to-ozelim", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    serviceType: "Виза (краткосрочная/долгосрочная)",   // а НЕ "visa"
    country: "Германия",
    tripPurpose: "Туризм",                               // а НЕ "tourism"
    stayDuration: "30–90 дней",                          // а НЕ "30_90"
    rvpBase: "Трудовой договор",                         // а НЕ "work_contract"
    services: ["Заполнение анкеты", "Бронь отеля"],
    name: "Иван",                                        // обязательно
    phone: "+7 (700) 123-45-67"                          // нужен phone или email
    // …любые другие поля анкеты
  }),
});
```

> Обязательны только `name` и `phone` (или `email`). Все прочие поля попадут в
> `data` и покажутся в карточке заявки как есть. Ключи полей (`serviceType`,
> `rvpBase`…) можно оставлять английскими — их подписи мы переводим у себя.
> `email`/`contactMethod` необязательны.

---

## Что настроить на нашей стороне (чек-лист)

1. Применить миграцию `db/migrations/0029_leads_kind_vizapro.sql` к Supabase.
2. Задать в env ozelim2 секрет **`VIZAPRO_INGEST_TOKEN`** (тот же, что отдадим vizapro).
   Сгенерировать: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Задеплоить ozelim2 (добавился роут `/api/integrations/vizapro`).
4. Передать vizapro: URL эндпоинта + секрет + инструкцию выше.
