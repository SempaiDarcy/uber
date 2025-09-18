import express from "express";
import { setupApp } from "./setup-app";

// создание приложения
const app = express();
setupApp(app);

// порт приложения
const PORT = process.env.PORT || 5001;

// запуск приложения
// ф-ия listen - запускает сервер и начинает прослушивать входящие запросы на указанном порту.
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});