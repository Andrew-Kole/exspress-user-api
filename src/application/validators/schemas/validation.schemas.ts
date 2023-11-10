import Joi from 'joi';

export const voteValueSchema = Joi.object({
    voteValue: Joi.number().valid(1, -1).required()
});



