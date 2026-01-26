# Создание и запуск приложения

В данном разделе описан процесс инициализации backend-приложения
на Node.js с использованием Express и TypeScript.

## 1. Создание проекта

Создаём пустую директорию проекта.
Название должно быть на английском языке, без пробелов и спецсимволов.

Инициализируем проект:

```bash
pnpm init
```

В результате будет создан файл `package.json`.

---

## 2. Установка зависимостей

### Основные зависимости

```bash
pnpm add express
```

**express**  
Основной фреймворк для создания серверных приложений и REST API на Node.js.

---

### Зависимости для разработки

```bash
pnpm add -D typescript @types/express @types/node jest ts-jest @types/jest supertest @types/supertest eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier nodemon
```

## 3. Инициализация TypeScript

```bash
pnpm tsc --init
```

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["__tests__", "dist", "node_modules"]
}
```

## 4. Скрипты package.json

```json
"scripts": {
  "watch": "tsc -w",
  "dev": "nodemon --inspect dist/index.js",
  "test": "jest -i",
  "lint": "eslint --fix .",
  "format": "prettier --write ."
}
```
