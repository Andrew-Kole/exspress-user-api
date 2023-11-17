import AWS from "aws-sdk";
import {AWS_S3_BUCKET_NAME, AWSPresignedUrlParams, s3} from "./config/connection.aws";
import {AWSPresignedUrlOperations} from "../../../application/enums/aws.operation.enums";

export class AwsAvatarService {
    private s3: AWS.S3;
    // private lambda: AWS.Lambda;

    constructor() {
        this.s3 = s3;
        // this.lambda = lambda;
    }

    async generatePresignedUrl(key: string) {
        const params = {
            ...AWSPresignedUrlParams,
            Key: key,
        }
        return this.s3.getSignedUrlPromise(AWSPresignedUrlOperations.PutObject, params);
    };

    async getAvatar(key: string) {
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        }
        const data = await this.s3.getObject(params).promise();
        return data.Body;
    }

    // async getKeyFromLambda() {
    //     try {
    //         const res = await this.lambda.invoke(AWSLambdaParams).promise();
    //
    //         // @ts-ignore
    //         const payload = JSON.parse(res.Payload);
    //         return res.Payload.key;
    //     }
    //     catch (error) {
    //         throw error;
    //     }
    // }
}