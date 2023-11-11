import { Request, Response, NextFunction } from "express";
import { UserRoles } from "../../domain/models/roles.enum";
import {HttpMessage, HttpStatus} from "../../application/enums/http.status";

export function rolesMiddleware(allowedRoles: UserRoles[]){
    return async (req: Request, res: Response, next: NextFunction) => {
        //@ts-ignore
        const loggedInUserRole = req.user.role;
        //@ts-ignore
        const loggedInUserId = req.user.id;
        const userId = parseInt(req.params.id, 10);
        if(!allowedRoles.includes(loggedInUserRole) && userId !== loggedInUserId) {
            return res.status(HttpStatus.FORBIDDEN).json({error: HttpMessage.FORBIDDEN});
        }
        next();
    };
}