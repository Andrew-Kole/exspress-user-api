import { Request, Response, NextFunction } from "express";
import { VotesService } from "../../../domain/services/votes.service";
import {VotesRepositoryPostgres} from "../../../infrastructure/persistance/votes.repository.postgres";
import {UserRepositoryPostgres} from "../../../infrastructure/persistance/user.repository.postgres";
import {HttpMessage, HttpStatus} from "../../config/http.status";

export async function checkOwnership(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    const authenticatedUser = req.user.id;
    const voteId = parseInt(req.params.vote_id, 10);
    const votesRepository = new VotesRepositoryPostgres();
    const usersRepository = new UserRepositoryPostgres();
    const votesService = new VotesService(votesRepository, usersRepository);
    try {
        const isVoteOwner = await votesService.isVoteOwner(authenticatedUser, voteId);
        if(!isVoteOwner) {
            return res.status(HttpStatus.FORBIDDEN).json(HttpMessage.FORBIDDEN);
        }
        next();
    }
    catch (error) {
        // @ts-ignore
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}