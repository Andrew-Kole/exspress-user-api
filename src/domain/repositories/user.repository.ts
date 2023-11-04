import {IUserModel} from "../models/user.model";

/**
 * Designed actions with user
 * @interface IUserRepository
 */
export interface IUserRepository {
    createUser(user: IUserModel): Promise<IUserModel>;
    getUserById(id: number): Promise<IUserModel | null>;
    getUserByNickname(nickname: string): Promise<IUserModel | null>;
    updateUser(id: number, updates: Partial<IUserModel>): Promise<IUserModel | null>;
}