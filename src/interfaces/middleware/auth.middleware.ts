import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET_KEY} from "../config";

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
        return res.status(401).json({message: 'Access denied!'});
    }

    try {
        // @ts-ignore
        req.user = jwt.verify(token, JWT_SECRET_KEY) as { id: number, role: 'basic' | 'moderator' | 'admin' };
        next();
    }
    catch (error) {
        res.status(401).json({error: "Invalid token"});
    }
}