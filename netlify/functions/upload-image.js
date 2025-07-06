const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { fromTemporaryCredentials } = require('@aws-sdk/credential-providers');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const s3 = new S3Client({
        region: process.env.MY_AWS_REGION,
        credentials: fromTemporaryCredentials({
            params: {
                RoleArn: process.env.AWS_ROLE_ARN,
                RoleSessionName: 'netlify-upload-session'
            }
        })
    });

    try {
        const formData = JSON.parse(event.body);
        const fileName = `products/${Date.now()}-${formData.name.replace(/\s+/g, '-')}`;
        const fileData = Buffer.from(formData.file.split(',')[1], 'base64');

        await s3.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: fileName,
            Body: fileData,
            ContentType: formData.type,
            ACL: 'public-read'
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({
                url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`
            }),
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};