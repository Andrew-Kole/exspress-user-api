export class VoteNotFoundError extends Error {
    constructor(voteId: number){
        super(`Vote with id ${voteId} not found`);
        this.name = 'VoteNotFoundError';
    }
}

export class SelfVoteError extends Error {
    constructor() {
        super('You cannot vote for yourself');
        this.name = 'SelfVoteError';
    }
}

export class DoubleVoteError extends Error {
    constructor() {
        super('Already voted for this user');
        this.name = 'DoubleVoteError';
    }
}

export class VotedRecentlyError extends Error {
    constructor() {
        super('Already voted last hour');
        this.name = 'VotedRecentlyError';
    }
}