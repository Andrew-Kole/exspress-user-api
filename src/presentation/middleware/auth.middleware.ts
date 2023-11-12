import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET_KEY} from "../config/jwt.config";
import {UserRoles} from "../../domain/models/roles.enum";
import {HttpMessage, HttpStatus} from "../../application/enums/http.status";

/**
 * Middleware for auth
 * @function
 * @param req
 * @param res
 * @param next
 */
export async function jwtAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({message: HttpMessage.UNAUTHORIZED});
    }

    try {
        // @ts-ignore
        req.user = jwt.verify(token, JWT_SECRET_KEY) as { id: number, role: UserRoles };
        next();
    }
    catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).json({error: HttpMessage.UNAUTHORIZED});
    }
}