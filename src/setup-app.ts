import express, {Request, Response, Express} from "express";
import {db} from "./db/in-memory-db";
import {HttpStatus} from "./core/types/http-statuses";
import {driversRouter} from "./drivers/routers/drivers.router";
import {testingRouter} from "./testing/routers/testing.router";

export const setupApp = (app: Express) => {
    app.use(express.json());

    app.use('/drivers', driversRouter)


    app.use('/testing',testingRouter)
    return app;
};