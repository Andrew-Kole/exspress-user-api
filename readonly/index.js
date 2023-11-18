exports.handler = async (event) => {
    try{
        console.log('Received event:', JSON.stringify(event, null, 2));
        if (event.Records && event.Records.length > 0) {
            const s3Record = event.Records[0];
            const key  = s3Record.s3.object.key;
            console.log('Key extracted', key);

            return {
                statusCode: 200,
                body: JSON.stringify({key}),
            };
        }
        else {
            console.warn('No records');
            return {
                statusCode: 204,
                body: JSON.stringify({message: 'No records'}),
            };
        }
    }
    catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: error.message}),
        }
    }
};