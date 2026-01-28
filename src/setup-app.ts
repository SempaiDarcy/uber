import express, {Express, Request, Response} from 'express';
import {testingRouter} from "./testing/routers/testing.router";
import {driversRouter} from "./drivers/routers/drivers.router";
import {setupSwagger} from "./core/swagger/setup-swagger";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req: Request, res: Response) => {
        res.status(200).send("Hello world!");
    });

    app.use('/api/drivers', driversRouter);

    app.use('/api/testing', testingRouter);
    setupSwagger(app)
    return app;
};