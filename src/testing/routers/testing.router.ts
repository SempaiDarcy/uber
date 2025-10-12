import {Router, Request, Response} from "express";
import {HttpStatus} from "../../core/types/http-statuses";
import {db} from "../../db/in-memory-db";

export const testingRouter = Router({})

testingRouter
    .delete('/all-data', (
        req: Request<{}, void, {}, {}>,
        res: Response<void>
    ) => {
        db.drivers = [];
        res.sendStatus(HttpStatus.NoContent);
    })