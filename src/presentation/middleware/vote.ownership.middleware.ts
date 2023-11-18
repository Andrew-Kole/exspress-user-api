import { Request, Response, NextFunction } from "express";
import { VotesRepository } from "../../infrastructure/persistance/votes.repository";
import {HttpMessage, HttpOperationEnums} from "../../application/enums/http.operation.enums";

export async function checkOwnership(req: Request, res: Response, next: NextFunction) {
    try {
        //@ts-ignore
        const authenticatedUser = req.user.id;
        const voteId = parseInt(req.params.vote_id, 10);
        const votesRepository = new VotesRepository();
        const voteData = await votesRepository.getVoteById(voteId);
        //@ts-ignore
        if (voteData && voteData.voter_id === authenticatedUser) {
            next();
        }
        else {
            return res.status(HttpOperationEnums.FORBIDDEN).json(HttpMessage.FORBIDDEN);
        }
    }
    catch (error) {
        // @ts-ignore
        res.status(HttpOperationEnums.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}