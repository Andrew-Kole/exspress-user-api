import { Pool, PoolClient, QueryResult } from "pg";
import { IVotesModel } from "../../domain/models/votes.model";
import { IVotesRepository } from "../../domain/repositories/votes.repository";
import {connectionDBParams} from "./config/connection.params";

export class VotesRepositoryPostgres implements IVotesRepository {
    private pool: Pool;

    constructor() {
        this.pool = new Pool(connectionDBParams);
    }

    async createVote(vote:IVotesModel): Promise<IVotesModel> {
        const client: PoolClient = await this.pool.connect();
        try {
            const {voterId, profileId, voteValue} = vote;

            const query = 'INSERT INTO votes (voter_id, profile_id, vote_value, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *';
            const values = [voterId, profileId, voteValue];
            const result: QueryResult = await client.query(query, values);
            return result.rows[0];
        }
        finally {
            client.release();
        }
    }

    async getVoteById(voteId: number): Promise<IVotesModel | null> {
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'SELECT * FROM votes WHERE id = $1';
            const values = [voteId];
            const result: QueryResult = await client.query(query, values);
            return result.rows[0] || null;
        }
        finally {
            client.release();
        }
    }

    async getVotesByVoterId(voterId:number): Promise<IVotesModel | null> {
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'SELECT * FROM votes WHERE voter_id = $1';
            const values = [voterId];
            const result: QueryResult = await client.query(query, values);
            return result.rows[0] || null;
        }
        finally {
            client.release();
        }
    }

    async updateVote(voteId:number, voteValue:number): Promise<IVotesModel | null> {
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'UPDATE votes SET vote_value = $1 WHERE id = $2 RETURNING *';
            const values = [voteValue, voteId];
            const result: QueryResult = await client.query(query, values);
            return result.rows[0] || null;
        }
        finally {
            client.release();
        }
    }

    async deleteVote(voteId:number): Promise<void> {
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'DELETE FROM votes WHERE id = $1';
            const values = [voteId];
            await client.query(query, values);
        }
        finally {
            client.release();
        }
    }

    async getVoteByVoterIdAndProfileId(voterId: number, profileId: number): Promise<IVotesModel | null> {
        const client: PoolClient = await this.pool.connect();
        try{
            const query = 'SELECT * FROM votes WHERE voter_id = $1 AND profile_id = $2';
            const values = [voterId, profileId];
            const result: QueryResult = await client.query(query, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        }
        finally {
            client.release();
        }
    }

    async getLastVoteByVoter(voterId:number): Promise<IVotesModel | null> {
        const client: PoolClient = await this.pool.connect();
        try {
            const query = 'SELECT * FROM votes WHERE voter_id = $1 ORDER BY created_at DESC LIMIT 1';
            const values = [voterId];
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
}