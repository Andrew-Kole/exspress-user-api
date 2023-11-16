import * as dotenv from "dotenv";
dotenv.config();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const AWS_REGION = process.env.AWS_REGION || '';


// noinspection JSDeprecatedSymbols
export const AWSConnctionParams = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    region: AWS_REGION,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
}



export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
export const AWS_SQS_QUEUE_URL = process.env.AWS_SQS_QUEUE_URL || '';