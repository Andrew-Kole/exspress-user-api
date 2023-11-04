import {Pool, PoolClient, QueryResult} from "pg";
import {IUserModel} from "../../domain/models/user.model";
import {IUserRepository} from "../../domain/repositories/user.repository";
import * as crypto from "crypto";
import {connectionDBParams} from "./config/connection.params";

/**
 * @class - UserRepository in postgers
 */
export class UserRepositoryPostgres implements IUserRepository {
    private pool: Pool;

    /**
     * @constructor - connection the db definition
     */
    constructor() {
        this.pool = new Pool(connectionDBParams);
    }

    /**
     * creates and stores user in database
     * @method
     * @param user - json format
     */
    async createUser(user:IUserModel): Promise<IUserModel> {
        const client: PoolClient = await this.pool.connect();
        try {
            const {nickname, firstname, lastname, password} = user;
            const hashedPassword = await this.hashPassword(password);

            const query = 'INSERT INTO users (nickname, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [nickname, firstname, lastname, hashedPassword];

            const result: QueryResult = await client.query(query, values);
            return result.rows[0];
        }
        finally {
            client.release();
        }
    }

    /**
     * retrieves user from db by id
     * @method
     * @param id - id of user
     */
    async getUserById(id: number): Promise<IUserModel | null>{
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const result: QueryResult = await client.query(query, [id]);

            if (result.rows.length > 0){
                return result.rows[0];
            }
            return null;
        }
        finally {
            client.release();
        }
    }

    /**
     * retrieves user from db by nick
     * @method
     * @param nickname - nickname of user
     */
    async getUserByNickname(nickname:string): Promise<IUserModel | null>{
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'SELECT * FROM users WHERE nickname = $1';
            const result: QueryResult = await client.query(query, [nickname]);

            if (result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        }
        finally {
            client.release()
        }
    }

    /**
     * updates user info
     * @method
     * @param id - is in db
     * @param updates - json format
     */
    async updateUser(id: number, updates: Partial<IUserModel>): Promise<IUserModel | null> {
        const client: PoolClient = await this.pool.connect();
        try {
            const {nickname, firstname, lastname, password} = updates;
            const hashedPassword = password ? await this.hashPassword(password) : undefined;

            const query = 'UPDATE users SET nickname = COALESCE($2, nickname), first_name = COALESCE($3, first_name), last_name = COALESCE($4, last_name), password = COALESCE($5, password) WHERE id = $1 RETURNING *';
            const values = [id, nickname, firstname, lastname, hashedPassword];

            const result: QueryResult = await client.query(query, values);
            if(result.rows.length > 0){
                return result.rows[0];
            }
            return null;
        }
        finally {
            client.release();
        }
    }

    /**
     * encodes password before storing to db
     * @method
     * @param password - password unhashed
     * @private - it's a method that works with sensetive data
     */
    private async hashPassword(password: string): Promise<string> {
        return await new Promise((resolve, reject) => {
            crypto.pbkdf2(password, 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString('hex'));
            });
        });
    }

    /**
     * validates user before authorization
     * @method
     * @param username - username from provided credentials
     * @param password - password from provided credentials
     */
    async isValidUser(username: string, password: string) {
        const client: PoolClient = await this.pool.connect();
        const hashedPassword = await this.hashPassword(password);
        try {
            const query = 'SELECT * FROM users WHERE nickname = $1 AND password = $2';
            const values = [username, hashedPassword];

            const result: QueryResult = await client.query(query, values);
            return result.rows.length > 0;
        }
        finally {
            client.release();
        }
    }
}