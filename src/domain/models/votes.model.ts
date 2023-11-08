export interface IVotesModel {
    id?: number,
    voterId: number,
    profileId: number,
    voteValue: number,
    createdAt?: Date
}