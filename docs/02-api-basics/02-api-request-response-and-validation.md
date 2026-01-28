# Request–Response, App setup и CRUD: как всё связано

Этот документ — **сквозное объяснение**, как работает backend‑приложение
на примере Express + HTTP + валидации DTO.
Цель — связать воедино **frontend → HTTP → backend → validation → response**.

Документ написан как **ментальная модель**, а не сухой справочник.

---

## 1. Что такое APP (Express app) на самом деле

Важно зафиксировать сразу:

> **APP — это НЕ сервер.**

```ts
const app = express()
```

`app` — это **обработчик HTTP‑запросов**:
- принимает уже разобранный HTTP‑запрос (`req`)
- формирует HTTP‑ответ (`res`)
- не слушает порт
- не работает напрямую с сетью

Сервер появляется только здесь:

```ts
app.listen(5001)
```

В e2e‑тестах сервера **нет**, потому что:
- транспорт (порт, сокеты) не влияет на логику
- backend проверяется на уровне обработки запросов

---

## 2. HTTP Request / Response — основа всего

Любое взаимодействие фронта и бэка сводится к цепочке:

```
HTTP Request → Backend logic → HTTP Response
```

### Request состоит из:
- method (`GET`, `POST`, `PUT`, `DELETE`)
- path (`/drivers`, `/drivers/:id`)
- headers (мета‑информация)
- body (данные, если есть)

### Response состоит из:
- status code (`200`, `201`, `400`, `404`)
- body (JSON / текст)
- headers

---

## 3. Как это выглядит на фронте

### Пример POST (создание ресурса)

```ts
fetch('/drivers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'test@mail.com'
  })
})
```

Фронт:
- не знает, как реализован backend
- не знает, есть ли валидация
- просто формирует HTTP‑сообщение

---

## 4. Как этот же запрос обрабатывается backend’ом

```ts
app.post('/drivers', (req, res) => {
  // req — HTTP request
  // res — HTTP response
})
```

На этом этапе:
- сервер уже принял байты
- Express разобрал HTTP
- backend работает с **объектами**, а не с сетью

---

## 5. express.json() — точка входа для body

```ts
app.use(express.json())
```

Этот middleware:
- читает `Content-Type`
- если `application/json` — парсит body
- кладёт результат в `req.body`

Без него:
```ts
req.body === undefined
```

---

## 6. DTO — контракт входных данных

```ts
export type DriverInputDto = {
  name: string
  phoneNumber: string
  email: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
}
```

DTO отвечает на вопрос:

> **Что клиент имеет право прислать?**

DTO:
- не содержит `id`
- не содержит `status`
- не содержит `createdAt`

---

## 7. Валидация — фильтр перед бизнес‑логикой

```ts
const errors = vehicleInputDtoValidation(req.body)

if (errors.length > 0) {
  res.status(400).send(createErrorMessages(errors))
  return
}
```

Логика:
1. Backend получает body
2. Передаёт его валидатору
3. Валидатор проверяет поля
4. Возвращает массив ошибок
5. Роут принимает решение

---

## 8. Как работает валидатор (концептуально)

```ts
const errors = []

if (!name || name.trim().length < 2) {
  errors.push({ field: 'name', message: 'Invalid name' })
}

if (!email.includes('@')) {
  errors.push({ field: 'email', message: 'Invalid email' })
}

return errors
```

Важно:

> **Валидация не решает судьбу запроса — она только сообщает проблемы.**

---

## 9. createErrorMessages — единый контракт ошибок

```ts
createErrorMessages(errors)
```

Возвращает:

```json
{
  "errorMessages": [
    { "field": "name", "message": "Invalid name" }
  ]
}
```

Тесты проверяют **эту форму**, а не реализацию.

---

## 10. CRUD операции целиком

### GET — чтение

Frontend:
```ts
fetch('/drivers')
```

Backend:
```ts
app.get('/drivers', (req, res) => {
  res.status(200).send(db.drivers)
})
```

---

### POST — создание

Frontend:
```ts
fetch('/drivers', { method: 'POST', body })
```

Backend:
1. parse body
2. validate
3. create entity
4. return 201

---

### PUT — обновление

Frontend:
```ts
fetch('/drivers/1', { method: 'PUT', body })
```

Backend:
1. validate id
2. validate body
3. update entity
4. return updated

---

### DELETE — удаление

Frontend:
```ts
fetch('/drivers/1', { method: 'DELETE' })
```

Backend:
1. validate id
2. delete entity
3. return 204

---

## 11. Связь frontend ↔ backend

Backend не знает о:
- кнопках
- инпутах
- UI

Он знает только:
- HTTP‑метод
- путь
- headers
- body

HTTP — это договор между слоями.

---

## 12. Почему подход «по чуть‑чуть» работает

Чередование:
- frontend
- backend
- тестов

помогает мозгу:
- строить связи
- возвращаться к абстракциям
- пересобирать модель

Это **не ошибка**, а **инженерный стиль обучения**.

---

## 13. Финальная фиксация

- Backend = обработка HTTP
- Server = транспорт
- DTO = контракт
- Validation = фильтр
- CRUD = паттерн
- Tests = проверка контракта

Если эта модель сложилась — фундамент есть.
