import {Request, Response, Router} from "express";
import {Driver} from "../types/driver";
import {HttpStatus} from "../../core/types/http-statuses";
import {db} from "../../db/in-memory-db";
import {createErrorMessages} from "../../core/utils/error.utils";
import {ValidationError} from "../types/validationError";
import {vehicleInputDtoValidation} from "../validation/vehicleInputDtoValidation";

export const driversRouter = Router({});

driversRouter
    .get('/', (
        req: Request,
        res: Response<Driver[]>) => {
        res.status(HttpStatus.Ok).send(db.drivers)
    })
    .get('/:id', (
        req: Request<{ id: string }, Driver, {}, {}>,
        res: Response<Driver | {
            errorsMessages: ValidationError[]
        }>) => {
        const driver = db.drivers.find(el => el.id === +req.params.id)

        if (!driver) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{field: 'id', message: 'Driver not found'}]),
                );
            return;
        }
        res.status(200).send(driver);
    })
    .post('/', (
        req: Request<{}, Driver, Omit<Driver, "id" | "createdAt">>,
        res: Response<Driver | { errorsMessages: ValidationError[] }>) => {
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
        const errors = vehicleInputDtoValidation(req.body)
        if (errors.length > 0) {
            return res.status(HttpStatus.BadRequest).send(createErrorMessages(errors))
        }
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
        };
        db.drivers.push(newDriver);
        res.status(HttpStatus.Created).send(newDriver);
    })
    .put('/:id', (
        req: Request<{ id: string }>,
        res: Response
    ) => {
        const id = parseInt(req.params.id);
        const index = db.drivers.findIndex((v) => v.id === id);

        if (index === -1) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{field: 'id', message: 'Vehicle not found'}]),
                );
            return;
        }

        const errors = vehicleInputDtoValidation(req.body);

        if (errors.length > 0) {
            res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
            return;
        }

        const driver = db.drivers[index];

        driver.name = req.body.name;
        driver.phoneNumber = req.body.phoneNumber;
        driver.email = req.body.email;
        driver.vehicleMake = req.body.vehicleMake;
        driver.vehicleModel = req.body.vehicleModel;
        driver.vehicleYear = req.body.vehicleYear;
        driver.vehicleLicensePlate = req.body.vehicleLicensePlate;
        driver.vehicleDescription = req.body.vehicleDescription;
        driver.vehicleFeatures = req.body.vehicleFeatures;

        res.sendStatus(HttpStatus.NoContent);
    })
    .delete('/:id', (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        //ищет первый элемент, у которого функция внутри возвращает true и возвращает
        // индекс этого элемента в массиве, если id ни у кого не совпал, то findIndex вернёт -1.
        const index = db.drivers.findIndex((v) => v.id === id);

        if (index === -1) {
            res
                .status(HttpStatus.NotFound)
                .send(
                    createErrorMessages([{field: 'id', message: 'Vehicle not found'}]),
                );
            return;
        }

        db.drivers.splice(index, 1);
        res.sendStatus(HttpStatus.NoContent);
    })