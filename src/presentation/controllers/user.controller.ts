import { Request, Response } from "express";
import { UserService } from "../../domain/services/user.service";
import jwt from "jsonwebtoken";
import {UserRepository} from "../../infrastructure/persistance/user.repository";
import {JWT_SECRET_KEY} from "../config/jwt.config";
import {HttpMessage, HttpStatus} from "../../application/enums/http.status";

/**
 * @class - controller for users
 */
export class UserController {
    constructor(private userService: UserService) {}

    /**
     * works on request for user creating
     * @method
     * @param req
     * @param res
     */
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { nickname, firstname, lastname, password } = req.body;
            const user = await this.userService.createUser({ nickname, firstname, lastname, password });
            res.status(HttpStatus.CREATED).json(user);
        }
        catch (error) {
            // @ts-ignore
            res.status(HttpStatus.BAD_REQUEST).json({error: error.message});
        }
    }

    /**
     * works on request for user getting by id
     * @method
     * @param req
     * @param res
     */
    async getUserById(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id, 10);
        try {
            const user = await this.userService.getUserById(userId);
            if(user) {
                res.setHeader('Last_Modified', user.updated_at?.toUTCString() || '');
                res.status(HttpStatus.OK).json(user);
            }
            else {
                res.status(HttpStatus.NOT_FOUND).json({error: HttpMessage.NOT_FOUND});
            }
        }
        catch (error) {
            // @ts-ignore
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    /**
     * works on request for user updates
     * @method
     * @param req
     * @param res
     */
    async updateUser(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id, 10);

        const ifUnmodifiedSinceHeader = req.headers['if-unmodified-since'];
        try {
            const user = await this.userService.getUserById(userId);
            if (user){
                // @ts-ignore
                if (ifUnmodifiedSinceHeader && new Date(ifUnmodifiedSinceHeader) < user.updated_at){
                    res.status(HttpStatus.PRECONDITION_FAILED).json({error: HttpMessage.PRECONDITION_FAILED});
                }
                else {
                    const { nickname, firstname, lastname, password } = req.body;
                    const updatedUser = await this.userService.updateUser(userId, {
                        nickname,
                        firstname,
                        lastname,
                        password,
                    });
                    if(updatedUser) {
                        res.status(HttpStatus.OK).json(updatedUser);
                    }
                    else {
                        res.status(HttpStatus.NOT_FOUND).json({error: HttpMessage.NOT_FOUND});
                    }
                }
            }
            else {
                res.status(HttpStatus.NOT_FOUND).json({error: HttpMessage.NOT_FOUND});
            }
        }
        catch (error) {
            // @ts-ignore
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error:error.message });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id, 10);

        try {
            await this.userService.deleteUser(userId);
            res.status(HttpStatus.NO_CONTENT).send();
        }
        catch (error) {
            // @ts-ignore
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        const { nickname, password } = req.body;
        const user = await this.userService.getUserByNickname(nickname);
        const isValidCredentials = await new UserRepository().isValidUser(nickname, password);
        if(user && isValidCredentials) {
            const token = jwt.sign({id: user.id, role: user.role}, JWT_SECRET_KEY, {expiresIn: '24h'});
            res.status(HttpStatus.OK).json({token});
        }
        else {
            res.status(HttpStatus.UNAUTHORIZED).json({error: HttpMessage.UNAUTHORIZED});
        }
    }
}