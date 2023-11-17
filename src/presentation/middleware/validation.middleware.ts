import { Request, Response, NextFunction } from "express";
import { HttpOperationEnums } from "../../application/enums/http.operation.enums"
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            //@ts-ignore
            res.status(HttpOperationEnums.BAD_REQUEST).json({error: error.message});
        }
    }
}
