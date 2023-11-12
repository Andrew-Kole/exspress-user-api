import { Request, Response } from "express";
import {VotesService} from "../../domain/services/votes.service";
import {HttpStatus} from "../../application/enums/http.status";

export class VotesController{
    constructor(private voteService: VotesService) {}

    async createVote(req: Request, res: Response): Promise<void> {
        try {
            //@ts-ignore
            const voterId = req.user.id;
            const profileId = parseInt(req.params.id, 10);
            const {voteValue} = req.body;
            const vote = await this.voteService.createVote(voterId, profileId, voteValue);
            res.status(HttpStatus.CREATED).json({vote})
        }
        catch (error) {
            //@ts-ignore
            res.status(HttpStatus.BAD_REQUEST).json({error: error.message})
        }
    }

    async updateVote(req: Request, res: Response): Promise<void> {
        const voteId = parseInt(req.params.vote_id, 10);
        const { voteValue } = req.body;
        const existingVote = await this.voteService.getVoteById(voteId);
        // @ts-ignore
        const existingVoteValue = existingVote.vote_value;
        if (existingVoteValue === voteValue) {
            res.status(HttpStatus.BAD_REQUEST).json({error: 'I didnot change anything'});
            return;
        }
        try {
            const updatedVote = await this.voteService.updateVote(voteId, voteValue);
            if (updatedVote) {
                res.status(HttpStatus.OK).json(updatedVote);
            }
            else {
                res.status(HttpStatus.BAD_REQUEST).json({error: 'Vote not found'});
            }
        }
        catch (error) {
            // @ts-ignore
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    async deleteVote(req: Request, res: Response): Promise<void> {
        const voteId = parseInt(req.params.vote_id, 10);
        try{
            await this.voteService.deleteVote(voteId);
            res.status(HttpStatus.NO_CONTENT).send();
        }
        catch (error) {
            // @ts-ignore
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
        }
    }

    async getVoteById(req: Request, res:Response): Promise<void>{
        const voteId = parseInt(req.params.vote_id, 10);
        try{
            const vote = await this.voteService.getVoteById(voteId);
            res.status(HttpStatus.OK).json(vote)
        }
        catch (error) {
            // @ts-ignore
            res.status(HttpStatus.BAD_REQUEST).json({error: error.message});
        }
    }
}