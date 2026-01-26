import express, {Express} from "express";
import {db} from "./db/in-memory.db";
import {Driver, DriverStatus} from "./drivers/types/driver";
import {HttpStatus} from "./core/types/http-statuses";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(200).send("Hello world!");
    });

    app.get('/drivers', (req, res) => {
        res.status(200).send(db.drivers)
    })
    app.get('/drivers/:id', (req, res) => {
        const driver = db.drivers.find(el => el.id === +req.params.id);
        if (!driver) {
            return res.status(404).send({message: "Driver not found"})
        }
        return res.status(200).send(driver)
    })
    app.post('/drivers',(req, res) => {
        const newDriver: Driver = {
            id: db.drivers.length ? db.drivers[db.drivers.length - 1].id + 1 : 1,
            status:DriverStatus.Online,
            name: 'Tom Rider',
            phoneNumber: '123-456-7890',
            email: 'tom.rider@example.com',
            vehicleMake: 'BMW',
            vehicleModel: 'Cabrio',
            vehicleYear: 2020,
            vehicleLicensePlate: 'ABC-32145',
            vehicleDescription: null,
            vehicleFeatures: [],
            createdAt: new Date(),
        }
        db.drivers.push(newDriver);
        res.status(HttpStatus.Created).send(newDriver);
    })
    app.delete('/testing/all-data',(req, res)=>{
        db.drivers = [];
        res.sendStatus(HttpStatus.NoContent);
    })
    return app;
};