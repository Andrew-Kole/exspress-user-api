import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../application/enums/http.status"
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            //@ts-ignore
            res.status(HttpStatus.BAD_REQUEST).json({error: error.message});
        }
    }
}
