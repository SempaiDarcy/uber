# Express + TypeScript: Полное руководство по Request и Response Generics

## 1. Введение

При работе с Express и TypeScript важно чётко типизировать запросы и ответы.  
Express предоставляет интерфейсы `Request` и `Response`, которые принимают дженерики (обобщённые типы).  
Они помогают IDE и компилятору понимать, какие данные приходят в `req` и уходят через `res`.

---

## 2. Общая сигнатура

### Request<TParams, TResBody, TReqBody, TReqQuery>

| Параметр | Что описывает | Пример | Примечание |
|-----------|----------------|---------|-------------|
| **TParams** | Параметры пути (`req.params`) | `{ id: string }` | Используется при `:id`, `:userId` и т.п. |
| **TResBody** | Тип данных, который возвращает сервер | `Driver` | Используется редко, чаще в `Response` |
| **TReqBody** | Тело запроса (`req.body`) | `CreateDriverDto` | Важно для `POST`, `PUT`, `PATCH` |
| **TReqQuery** | Query-параметры (`req.query`) | `{ limit: number; page: number }` | Для фильтрации, пагинации и т.д. |

### Response<TResBody>

| Параметр | Что описывает | Пример |
|-----------|----------------|---------|
| **TResBody** | Тип данных, отправляемый клиенту через `res.send()` | `Driver` |

---

## 3. Примеры

### GET /drivers/:id
```ts
app.get(
  "/drivers/:id",
  (
    req: Request<{ id: string }, Driver, {}, {}>,
    res: Response<Driver | null>
  ) => {
    const driver = db.drivers.find(d => d.id === +req.params.id);
    if (!driver) {
      return res.sendStatus(404);
    }
    res.status(200).send(driver);
  }
);
```

**Разбор:**
- `TParams = { id: string }` — параметр из URL (`/drivers/1` → `req.params.id = "1"`)
- `TResBody = Driver | null` — сервер возвращает либо объект водителя, либо `null`
- `TReqBody = {}` — GET-запрос не имеет тела
- `TReqQuery = {}` — не используются query-параметры

---

### POST /drivers
```ts
app.post(
  "/drivers",
  (
    req: Request<{}, Driver, CreateDriverDto, {}>,
    res: Response<Driver>
  ) => {
    const body = req.body; // тип: CreateDriverDto
    const newDriver: Driver = { ...body, id: 1, createdAt: new Date() };
    res.status(201).send(newDriver);
  }
);
```

**Разбор:**
- `TParams = {}` — в пути нет параметров
- `TResBody = Driver` — сервер вернёт нового водителя
- `TReqBody = CreateDriverDto` — тело запроса описывает создаваемый объект
- `TReqQuery = {}` — без query

**Почему важно:**  
Типизация тела запроса (`CreateDriverDto`) позволяет IDE подсказывать поля и предотвращает ошибки при отправке данных.

---

### PUT /drivers/:id
```ts
app.put(
  "/drivers/:id",
  (
    req: Request<{ id: string }, Driver, UpdateDriverDto, {}>,
    res: Response<Driver | null>
  ) => {
    const { id } = req.params;
    const update = req.body; // тип: UpdateDriverDto
    // обновляем данные...
    res.status(200).send(updatedDriver);
  }
);
```

**Разбор:**
- `TParams = { id: string }` — идентификатор водителя
- `TResBody = Driver | null` — возвращается обновлённый водитель или `null`
- `TReqBody = UpdateDriverDto` — частичная структура для обновления
- `TReqQuery = {}` — не используется

---

### DELETE /drivers/:id
```ts
app.delete(
  "/drivers/:id",
  (
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response<void>
  ) => {
    const { id } = req.params;
    // удаляем водителя...
    res.sendStatus(204);
  }
);
```

**Разбор:**
- `TParams = { id: string }` — идентификатор ресурса
- `TResBody = void` — сервер ничего не возвращает
- `TReqBody = {}` — тело не используется
- `TReqQuery = {}` — без query

---

## 4. Полезные советы

### 1. Если параметры не нужны — ставь `{}`  
Это делает код чище и явным.

### 2. Для частичных обновлений используй `Partial<T>`  
```ts
type UpdateDriverDto = Partial<CreateDriverDto>;
```

### 3. Типизируй query-параметры  
```ts
req: Request<{}, {}, {}, { limit: number; page?: number }>
```

### 4. Для ответов с ошибками можно использовать объединения  
```ts
Response<Driver | { error: string }>
```

---

## 5. Пример полного контроллера

```ts
app.get(
  "/drivers",
  (
    req: Request<{}, Driver[], {}, { limit?: number; search?: string }>,
    res: Response<Driver[]>
  ) => {
    const { limit, search } = req.query;
    const filtered = db.drivers.filter(d =>
      !search ? true : d.name.includes(search)
    );
    res.status(200).send(limit ? filtered.slice(0, +limit) : filtered);
  }
);
```

**Здесь:**
- `req.query.limit` и `req.query.search` типизированы.
- Возвращается `Driver[]`, строго типизированный массив.

---

## 6. Итог

| Что типизируется | Где используется | Пример |
|------------------|------------------|---------|
| Параметры пути | `TParams` | `{ id: string }` |
| Тело запроса | `TReqBody` | `CreateDriverDto` |
| Query-параметры | `TReqQuery` | `{ limit?: number }` |
| Тело ответа | `Response<T>` | `Response<Driver[]>` |

---

## 7. Заключение

Использование дженериков в Express с TypeScript делает код безопаснее, понятнее и предотвращает множество ошибок.  
Это особенно важно в проектах с чёткой архитектурой (Controller → Service → Repository).

Правильно заданные типы `Request` и `Response` позволяют IDE точно понимать структуру данных, облегчая навигацию и автодополнение.
