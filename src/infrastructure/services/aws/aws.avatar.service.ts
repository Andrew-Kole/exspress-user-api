import AWS, {SQS} from "aws-sdk";
import {
    AWS_S3_BUCKET_NAME,
    AWS_SQS_QUEUE_URL,
    AWSPresignedUrlParams, s3, sqs
} from "./config/connection.aws";
import {AWSPresignedUrlOperations} from "../../../application/enums/aws.operation.enums";

export class AwsAvatarService {
    private s3: AWS.S3;
    private sqs: AWS.SQS;

    constructor() {
        this.s3 = s3;
        this.sqs = sqs;
    }

    async generatePresignedUrl(key: string) {
        const params = {
            ...AWSPresignedUrlParams,
            Key: key,
        }
        return this.s3.getSignedUrlPromise(AWSPresignedUrlOperations.PutObject, params);
    };


    async receiveAndDeleteFromSQS() {
        for (let i = 0; i < 10; i++) {
            const params = {
                QueueUrl: AWS_SQS_QUEUE_URL,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 1,
            }
            const result = await this.sqs.receiveMessage(params).promise();
            if (result.Messages && result.Messages.length > 0) {
                const message = result.Messages[0];
                const body = message.Body;

                await this.sqs.deleteMessage(<SQS.DeleteMessageRequest>{
                    QueueUrl: AWS_SQS_QUEUE_URL,
                    ReceiptHandle: message.ReceiptHandle,
                }).promise()

                return body;
            }
            else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        return null;
    }

    async getAvatar(key: string) {
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        }
        const data = await this.s3.getObject(params).promise();
        return data.Body;
    }
}