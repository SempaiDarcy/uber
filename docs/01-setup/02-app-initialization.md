# Инициализация Express-приложения

В данном разделе описывается создание Express-приложения,
его базовая конфигурация и запуск HTTP-сервера.

---

## Структура файлов

```text
src/
├─ index.ts
└─ setup-app.ts
```

- `index.ts` — точка входа приложения, отвечает за запуск сервера
- `setup-app.ts` — конфигурация Express-приложения (middleware и маршруты)

---

## index.ts — запуск приложения

```ts
import express from "express";
import { setupApp } from "./setup-app";

const app = express();
setupApp(app);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
```

### Назначение

- создаётся экземпляр Express-приложения
- выполняется конфигурация приложения
- сервер запускается на указанном порту

---

## setup-app.ts — конфигурация приложения

```ts
import express, { Express } from "express";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });

  return app;
};
```

### Назначение

- регистрация middleware
- регистрация маршрутов
- функция не запускает сервер

---

## Архитектурное разделение

Конфигурация приложения и запуск сервера разделены намеренно:

- упрощает тестирование без использования `listen`
- улучшает читаемость точки входа
- облегчает дальнейшее расширение приложения

Такой подход является архитектурным решением,
а не обязательным требованием Express.
