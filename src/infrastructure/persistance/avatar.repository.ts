import {IAvatarRepository} from "../../domain/repositories/avatar.repository";
import {Pool, PoolClient, QueryResult} from "pg";
import {connectionDBParams} from "./config/connection.params";

export class AvatarRepository implements IAvatarRepository {
    private pool: Pool;

    constructor() {
        this.pool = new Pool(connectionDBParams);
    }

    async uploadAvatar(userId: number, key: string): Promise<void> {
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'INSERT INTO avatars (user_id, key) VALUES ($1, $2)';
            const values = [userId, key];
            await client.query(query, values);
        }
        finally {
            client.release();
        }
    }

    async getAvatarById(avatarId: number): Promise<string | null> {
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'SELECT key FROM avatars WHERE id = $1';
            const values = [avatarId];
            const result: QueryResult = await client.query(query, values);
            if (result.rows.length > 0) {
                return result.rows[0].key;
            }
            return null;
        }
        finally {
            client.release();
        }
    }
}