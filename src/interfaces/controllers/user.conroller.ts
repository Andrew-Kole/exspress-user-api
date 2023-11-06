import { Request, Response } from "express";
import { UserService } from "../../domain/services/user.service";

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
            res.status(201).json(user);
        }
        catch (error) {
            // @ts-ignore
            res.status(400).json({error: error.message});
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
                res.status(200).json(user);
            }
            else {
                res.status(404).json({error: 'User not found'});
            }
        }
        catch (error) {
            // @ts-ignore
            res.status(500).json({error: error.message});
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
                    res.status(412).json({error: 'Precondition Failed'});
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
                        res.status(200).json(updatedUser);
                    }
                    else {
                        res.status(404).json({error: 'User not found'});
                    }
                }
            }
            else {
                res.status(404).json({error: 'User not found'});
            }
        }
        catch (error) {
            // @ts-ignore
            res.status(500).json({ error:error.message });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id, 10);
        try {
            await this.userService.deleteUser(userId);
            res.status(204).send();
        }
        catch (error) {
            // @ts-ignore
            res.status(500).json({error: error.message});
        }
    }
}