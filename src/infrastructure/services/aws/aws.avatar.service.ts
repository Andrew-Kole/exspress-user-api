import AWS, {SQS} from "aws-sdk";
import {AWS_S3_BUCKET_NAME, AWS_SQS_QUEUE_URL, AWSConnctionParams} from "./config/connection.aws";

export class AwsAvatarService {
    private s3: AWS.S3;
    private sqs: AWS.SQS;

    constructor() {
        this.s3 = new AWS.S3(AWSConnctionParams);
        this.sqs = new AWS.SQS(AWSConnctionParams);
    }

    async generatePresignedUrl(key: string) {
        const params = {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
            Expires: 300,
        };
        return this.s3.getSignedUrlPromise('putObject', params);
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