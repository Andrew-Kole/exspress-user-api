import { Request,Response,NextFunction } from "express";
import { UserRepositoryPostgres } from "../../infrastructure/persistance/user.repository.postgres";

/**
 * Middleware for auth
 * @function
 * @param req
 * @param res
 * @param next
 */
export async function basicAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({message: 'Access denied!'});
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    const isValid = await new UserRepositoryPostgres().isValidUser(username, password);

    if (isValid) {
        next();
    }
    else {
        res.status(401).json({message: 'Invalid credentials!'});
    }
}