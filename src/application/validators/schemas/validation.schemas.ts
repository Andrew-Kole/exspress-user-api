import Joi from 'joi';

export const voteValueSchema = Joi.object({
    voteValue: Joi.number().valid(1, -1).required()
});

export const avatarUploadSchema = Joi.object({
   size: Joi.number().max(5 * 1024 * 1024).required(),
   mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
}).unknown(true);