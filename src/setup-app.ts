import express, {Request, Response, Express} from "express";
import {db} from "./db/in-memory-db";
import {Driver} from "./drivers/types/driver";
import {HttpStatus} from "./core/http-statuses";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req: Request, res: Response) => {
        res.status(HttpStatus.Ok).send("Hello world!");
    });

    app.get('/drivers', (
        req: Request,
        res: Response<Driver[]>) => {
        res.status(HttpStatus.Ok).send(db.drivers);
    });

    app.get('/drivers/:id', (
        req: Request<{ id: string }, Driver, {}, {}>,
        res: Response<Driver | null>
    ) => {
        const driver = db.drivers.find(el => el.id === +req.params.id)
        if (!driver) {
            res.status(404);
            return; // Если не поставить return, то после отправки 404 Express попробует ещё раз отправить 200 → и ты получишь ошибку
        }
        res.status(HttpStatus.Ok).send(driver);
    });

    app.post('/drivers', (
        req: Request<{}, Driver, Omit<Driver, "id" | "createdAt">>,
        res: Response<Driver>) => {
        const {
            name,
            phoneNumber,
            email,
            vehicleMake,
            vehicleModel,
            vehicleYear,
            vehicleLicensePlate,
            vehicleDescription,
            vehicleFeatures
        } = req.body;
        //1) проверяем приходящие данные на валидность

        //2) создаем newDriver
        const newDriver: Driver = {
            id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
            name,
            phoneNumber,
            email,
            vehicleMake,
            vehicleModel,
            vehicleYear,
            vehicleLicensePlate,
            vehicleDescription,
            vehicleFeatures,
            createdAt: new Date(),
        }
        //3) добавляем newDriver в БД
        db.drivers.push(newDriver);
        res.status(HttpStatus.Created).send(newDriver);
    });

    app.get('/testing', (req: Request, res: Response) => {
        res.status(HttpStatus.Ok).send('testing url')
    });

    app.delete('/testing/all-data',
        (
            req: Request<{}, void, {}, {}>,
            res: Response<void>
        ) => {
            db.drivers = [];
            res.sendStatus(HttpStatus.NoContent)
        })
    return app;
};