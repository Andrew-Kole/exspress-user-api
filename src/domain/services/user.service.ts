import {IUserModel} from "../models/user.model";
import {IUserRepository} from "../repositories/user.repository";

/**
 * @class - User service
 */
export class UserService {
    constructor(private userRepository: IUserRepository) {}

    /**
     * Create a new user
     * @param user - json format of user
     */
    async createUser(user: IUserModel): Promise<IUserModel> {
        const existingUser = await this.userRepository.getUserByNickname(user.nickname);
        if(existingUser) {
            throw new Error('User with this nick is already exist');
        }

        const newUser: IUserModel = {
            nickname: user.nickname,
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password,
        };
        return await this.userRepository.createUser(newUser);
    }

    /**
     * Get user by Id
     * @param id - id in db
     */
    async getUserById(id: number): Promise<IUserModel | null>{
        return await this.userRepository.getUserById(id);
    }

    async getUserByNickname(nickname: string): Promise<IUserModel | null>{
        return await this.userRepository.getUserByNickname(nickname);
    }

    /**
     * updating user info
     * @param id - id in db
     * @param updates - json format
     */
    async updateUser(id: number, updates: Partial<IUserModel>): Promise<IUserModel | null> {
        const existingUser = await this.userRepository.getUserById(id);
        if(!existingUser){
            throw new Error('There is no such user');
        }
        if(updates.nickname) {
            const userByNickname = await this.userRepository.getUserByNickname(updates.nickname);
            if(userByNickname && userByNickname.id !== id) {
                throw new Error('Nickname already exists');
            }
        }

        const updatedUser: IUserModel = {
            ...existingUser,
            ...updates,
        };
        return await this.userRepository.updateUser(id, updatedUser);
    }

    async deleteUser(id: number): Promise<void> {
        const existingUser = await this.userRepository.getUserById(id);
        if(!existingUser){
            throw new Error('User not found');
        }
        await this.userRepository.deleteUser(id);
    }
}