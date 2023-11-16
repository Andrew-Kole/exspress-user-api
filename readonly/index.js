// The following code was deployed to aws lambda. Trigger is S3 on creating file

const AWS = require("aws-sdk");

const sqs = new AWS.SQS();

exports.handler = async (event) => {
    try {
        const record = event.Records[0];
        const key = record.s3.object.key;

        await sendSqsMessage(key);
        console.log(`SQS message sent for key: ${key}`);
        return {statusCode: 200, body: 'SQS message sent'};
    }
    catch (error) {
        console.error('Error to handle event', error);
        return {statusCode: 500, body: 'Error'};
    }
};

async function sendSqsMessage(key) {
    const sqsParams = {
        QueueUrl: process.env.AWS_SQS_QUEUE_URL,
        MessageBody: JSON.stringify({key}),
    }
    await sqs.sendMessage(sqsParams).promise();
}