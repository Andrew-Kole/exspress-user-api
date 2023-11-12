import {IVotesModel} from "../models/votes.model";

export interface IVotesRepository {
    createVote(vote: IVotesModel): Promise<IVotesModel>;
    getVoteById(voteId: number): Promise<IVotesModel | null>;
    getVotesByVoterId(voterId: number): Promise<IVotesModel | null>;
    updateVote(voteId: number, voteValue: number): Promise<IVotesModel | null>;
    deleteVote(voterId: number): Promise<void>;
    getVoteByVoterIdAndProfileId(voterId: number, profileId: number): Promise<IVotesModel | null>;
    getLastVoteByVoter(voterId: number): Promise<IVotesModel | null>;
}