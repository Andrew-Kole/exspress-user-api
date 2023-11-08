import {IVotesRepository} from "../repositories/votes.repository";
import {IUserRepository} from "../repositories/user.repository";
import {IVotesModel} from "../models/votes.model";

export class VotesService {
    constructor(private votesRepository: IVotesRepository, private userRepository: IUserRepository) {}

    async createVote(authenticatedUserId: number, profileId: number, voteValue: number): Promise<IVotesModel> {
        if (voteValue !== 1 && voteValue !== -1) {
            throw new Error('Invalid vote value');
        }
        const vote: IVotesModel = {
            voterId: authenticatedUserId,
            profileId: profileId,
            voteValue: voteValue,
        }

        const createdVote = await this.votesRepository.createVote(vote);
        await this.userRepository.updateRating(profileId, voteValue);
        return createdVote;
    }

    async getVotesByVoterId(voterId: number): Promise<IVotesModel | null> {
        return await this.votesRepository.getVotesByVoterId(voterId);
    }

    async updateVote(voteId: number, voteValue: number): Promise<IVotesModel | null> {
        const existingVote = await this.votesRepository.getVoteById(voteId);
        if (!existingVote){
            throw new Error('This vote does not exist');
        }
        //@ts-ignore
        if (existingVote.vote_value !== voteValue && (voteValue == 1 || voteValue == -1)){
            // @ts-ignore
            const profileId = existingVote.profile_id;
            const updatedRatingValue = voteValue * 2;
            await this.userRepository.updateRating(profileId, updatedRatingValue);
            return await this.votesRepository.updateVote(voteId, voteValue);
        }
        else {
            throw new Error('Invalid vote value or you have not change it');
        }
    }

    async deleteVote(voteId: number): Promise<void> {
        const existingVote = await this.votesRepository.getVoteById(voteId);
        if(!existingVote){
            throw new Error('Vote was not found');
        }
        // @ts-ignore
        const profileId = existingVote.profile_id;
        // @ts-ignore
        const voteValue = existingVote.vote_value * -1;
        await this.votesRepository.deleteVote(voteId);
        await this.userRepository.updateRating(profileId, voteValue);
    }

    async hasVotedForProfile(voterId: number, profileId: number): Promise<boolean>{
        const existingVote = await this.votesRepository.getVoteByVoterIdAndProfileId(voterId, profileId);
        return !!existingVote;
    }

    async hasVotedRecently(voterId: number): Promise<boolean> {
        const lastVote = await this.votesRepository.getLastVoteByVoter(voterId);
        if(lastVote){
            const oneHourAgo = new Date()
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);
            // @ts-ignore
            return lastVote.createdAt > oneHourAgo;
        }
        return false;
    }

    async isVoteOwner(authenticatedUserId: number, voteId: number): Promise<boolean> {
        const vote = await this.votesRepository.getVoteById(voteId);
        // @ts-ignore
        return !!(vote && vote.voter_id === authenticatedUserId);
    }

    async getVoteById(voteId: number): Promise<IVotesModel | null> {
        return await this.votesRepository.getVoteById(voteId);
    }
}