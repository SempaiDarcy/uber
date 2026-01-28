# Jest expect matchers

Этот документ описывает основные **Jest matchers** — методы,
которые используются после `expect(...)` для проверки результатов тестов
(в том числе e2e и integration тестов backend-приложений).

Matcher отвечает на вопрос:

> **Какое утверждение мы делаем о полученном значении?**

Общий синтаксис:

```ts
expect(received).matcher(expected?)
```

---

## 1. Строгое равенство

### `toBe`

```ts
expect(value).toBe(expected)
```

**Что проверяет:**
- строгое равенство (`===`)

**Использовать когда:**
- примитивы (`number`, `string`, `boolean`)
- точные значения

**Примеры:**
```ts
expect(res.status).toBe(200)
expect(isActive).toBe(true)
```

---

## 2. Глубокое сравнение объектов

### `toEqual`

```ts
expect(value).toEqual(expected)
```

**Что проверяет:**
- глубокое сравнение объектов и массивов
- сравнивает структуру и значения, а не ссылки

**Использовать когда:**
- JSON-ответы
- объекты DTO
- массивы данных

**Пример:**
```ts
expect(res.body).toEqual({
  name: 'Valentin',
  age: 25
})
```

---

## 3. Проверка типа / класса

### `toBeInstanceOf`

```ts
expect(value).toBeInstanceOf(Constructor)
```

**Что проверяет:**
- является ли объект экземпляром класса

**Использовать когда:**
- проверка массивов
- проверка Date, Error и т.п.

**Примеры:**
```ts
expect(res.body).toBeInstanceOf(Array)
expect(error).toBeInstanceOf(Error)
```

---

## 4. Числовые сравнения

### `toBeGreaterThan`

```ts
expect(value).toBeGreaterThan(number)
```

**Что проверяет:**
- значение больше указанного

---

### `toBeGreaterThanOrEqual`

```ts
expect(value).toBeGreaterThanOrEqual(number)
```

**Что проверяет:**
- значение больше или равно указанному

**Типичный кейс:**
```ts
expect(drivers.length).toBeGreaterThanOrEqual(2)
```

---

### `toBeLessThan`

```ts
expect(value).toBeLessThan(number)
```

---

### `toBeLessThanOrEqual`

```ts
expect(value).toBeLessThanOrEqual(number)
```

---

## 5. Проверка наличия значения

### `toBeDefined`

```ts
expect(value).toBeDefined()
```

**Что проверяет:**
- значение не `undefined`

---

### `toBeUndefined`

```ts
expect(value).toBeUndefined()
```

---

### `toBeNull`

```ts
expect(value).toBeNull()
```

---

### `toBeTruthy` / `toBeFalsy`

```ts
expect(value).toBeTruthy()
expect(value).toBeFalsy()
```

**Проверяет приведение к boolean**

---

## 6. Проверка строк

### `toContain`

```ts
expect(string).toContain(substring)
```

**Пример:**
```ts
expect(res.text).toContain('Hello')
```

---

### `toMatch`

```ts
expect(string).toMatch(regex)
```

**Пример:**
```ts
expect(email).toMatch(/@example.com$/)
```

---

## 7. Проверка массивов

### `toContain`

```ts
expect(array).toContain(item)
```

---

### `toHaveLength`

```ts
expect(array).toHaveLength(number)
```

---

## 8. Проверка объектов

### `toHaveProperty`

```ts
expect(obj).toHaveProperty(path, value?)
```

**Пример:**
```ts
expect(driver).toHaveProperty('id')
expect(driver).toHaveProperty('status', 'online')
```

---

## 9. Частичное сравнение

### `expect.objectContaining`

```ts
expect(obj).toEqual(expect.objectContaining({...}))
```

**Использовать когда:**
- объект содержит больше полей, чем нужно проверить

**Пример:**
```ts
expect(res.body).toEqual(
  expect.objectContaining({
    name: 'Valentin'
  })
)
```

---

## 10. Универсальные ассерты

### `expect.any`

```ts
expect.any(Constructor)
```

**Пример:**
```ts
expect(res.body).toEqual({
  id: expect.any(Number),
  createdAt: expect.any(String)
})
```

---

## 11. Проверка ошибок

### `toThrow`

```ts
expect(fn).toThrow()
```

```ts
expect(fn).toThrow(Error)
```

---

## 12. Отрицания

### `.not`

```ts
expect(value).not.toBe(null)
expect(value).not.toEqual({})
```

---

## Инженерное правило

> **Тест должен проверять поведение, а не реализацию.**

- `toBe` — точное значение
- `toEqual` — структура
- `toBeGreaterThanOrEqual` — инвариант
- `expect.any` — допустимый тип

---

## Рекомендации для backend e2e

- HTTP status → `toBe`
- JSON body → `toEqual` / `objectContaining`
- массивы → `toBeInstanceOf(Array)` + length
- даты / id → `expect.any(...)`
