import { Request, Response, NextFunction } from "express";
import { VotesService } from "../../../domain/services/votes.service";
import {VotesRepositoryPostgres} from "../../../infrastructure/persistance/votes.repository.postgres";
import {UserRepositoryPostgres} from "../../../infrastructure/persistance/user.repository.postgres";
import {HttpMessage, HttpStatus} from "../../config/http.status";

export async function votesValidator(req: Request, res: Response, next: NextFunction){
    //@ts-ignore
    const voterId = req.user.id;
    const profileId = parseInt(req.params.id, 10);
    const votesRepository = new VotesRepositoryPostgres();
    const userRepository = new UserRepositoryPostgres();
    const voteService = new VotesService(votesRepository, userRepository);
    try {
        if(voterId === profileId){
            return res.status(HttpStatus.BAD_REQUEST).json({error: 'You cannot vote for yourself'});
        }
        const hasVotedForProfile = await voteService.hasVotedForProfile(voterId, profileId);
        if(hasVotedForProfile) {
            return res.status(HttpStatus.BAD_REQUEST).json({error: 'You have already voted for this profile.'});
        }

        const hasVotedRecently = await voteService.hasVotedRecently(voterId);
        if (hasVotedRecently){
            return res.status(HttpStatus.BAD_REQUEST).json({error: 'You cannot vote more often than once an hour.'});
        }
        next();
    }
    catch (error) {
        // @ts-ignore
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message})
    }
}

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