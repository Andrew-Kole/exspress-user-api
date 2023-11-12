import {IVotesRepository} from "../repositories/votes.repository";
import {IUserRepository} from "../repositories/user.repository";
import {IVotesModel} from "../models/votes.model";
import {DoubleVoteError, SelfVoteError, VotedRecentlyError, VoteNotFoundError} from "../../application/exceptions";

const PROFILE_RATING_MULTIPLIER_AFTER_UPDATE = 2;
const PROFILE_RATING_MULTIPLIER_AFTER_DELETE = -1;

export class VotesService {
    constructor(private votesRepository: IVotesRepository, private userRepository: IUserRepository) {}

    async createVote(authenticatedUserId: number, profileId: number, voteValue: number): Promise<IVotesModel> {
        if(authenticatedUserId === profileId){
            throw new SelfVoteError();
        }
        const hasVotedForProfile = await this.hasVotedForProfile(authenticatedUserId, profileId);
        if(hasVotedForProfile) {
            throw new DoubleVoteError();
        }
        const hasVotedRecently = await this.hasVotedRecently(authenticatedUserId);
        if(hasVotedRecently){
            throw new VotedRecentlyError();
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

    async updateVote(voteId: number, voteValue: number): Promise<IVotesModel | null> {
        const existingVote = await this.votesRepository.getVoteById(voteId);
        if (!existingVote){
            throw new VoteNotFoundError(voteId);
        }
        // @ts-ignore
        const profileId = existingVote.profile_id;
        const updatedRatingValue = voteValue * PROFILE_RATING_MULTIPLIER_AFTER_UPDATE;
        await this.userRepository.updateRating(profileId, updatedRatingValue);
        return await this.votesRepository.updateVote(voteId, voteValue);
    }

    async deleteVote(voteId: number): Promise<void> {
        const existingVote = await this.votesRepository.getVoteById(voteId);
        if(!existingVote){
            throw new VoteNotFoundError(voteId);
        }
        // @ts-ignore
        const profileId = existingVote.profile_id;
        // @ts-ignore
        const voteValue = existingVote.vote_value * PROFILE_RATING_MULTIPLIER_AFTER_DELETE;
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

    async getVoteById(voteId: number): Promise<IVotesModel | null> {
        return await this.votesRepository.getVoteById(voteId);
    }
}