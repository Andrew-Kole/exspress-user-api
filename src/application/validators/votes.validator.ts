import Joi from "joi";

export const validateVoteValue = async (data: number, schema: Joi.ObjectSchema): Promise<boolean>  => {
    const { error } = schema.validate(data);
    return !!error;
};
