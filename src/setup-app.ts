import express, { Express, Request, Response } from 'express';
import {db} from "./db/in-memory.db";
import {Driver, DriverStatus} from "./drivers/types/driver";
import {HttpStatus} from "./core/types/http-statuses";
import {vehicleInputDtoValidation} from "./drivers/validation/vehicleInputDtoValidation";
import {createErrorMessages} from "./core/utils/error.utils";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req: Request, res: Response) => {
        res.status(200).send("Hello world!");
    });

    app.get('/drivers', (req: Request, res: Response) => {
        res.status(200).send(db.drivers)
    })

    app.get('/drivers/:id', (req: Request, res: Response) => {
        const driver = db.drivers.find(el => el.id === +req.params.id);
        if (!driver) {
            return res.status(404).send(createErrorMessages([{field: 'id', message: "Driver not found"}]))
        }
        return res.status(200).send(driver)
    })

    app.post('/drivers', (req: Request, res: Response) => {
        const errors = vehicleInputDtoValidation(req.body)

        if (errors.length > 0) {
            res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
            return
        }

        const newDriver: Driver = {
            id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
            status: DriverStatus.Online,
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            vehicleMake: req.body.vehicleMake,
            vehicleModel: req.body.vehicleModel,
            vehicleYear: req.body.vehicleYear,
            vehicleLicensePlate: req.body.vehicleLicensePlate,
            vehicleDescription: req.body.vehicleDescription,
            vehicleFeatures: req.body.vehicleFeatures,
            createdAt: new Date(),
        }
        db.drivers.push(newDriver);
        res.status(HttpStatus.Created).send(newDriver);
    })

    app.get('/testing', (req: Request, res: Response) => {
        res.status(200).send('testing url');
    });

    app.delete('/testing/all-data', (req: Request, res: Response) => {
        db.drivers = [];
        res.sendStatus(HttpStatus.NoContent);
    })
    return app;
};