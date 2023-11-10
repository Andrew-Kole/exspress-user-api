import { Request, Response, NextFunction } from "express";
import { validateVoteValue } from "../../../application/validators/votes.validator";
import { voteValueSchema } from "../../../application/validators/schemas/validation.schemas";
import { HttpStatus } from "../../../application/dto/http.status"

export const validateVoteValueMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { voteValue } = req.body;
        const isValidVoteValue = await validateVoteValue(voteValue, voteValueSchema);
        if (!isValidVoteValue){
            res.status(HttpStatus.BAD_REQUEST).json({error: "Invalid vote value"});
            return;
        }
        next();
    }
    catch (error) {
        //@ts-ignore
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
    }
}