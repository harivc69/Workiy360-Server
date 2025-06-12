const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = 'your-bucket-name'; // Replace with your S3 bucket name

const uploadFile = (fileName, fileContent) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
    };

    return s3.upload(params).promise();
};

const deleteFile = (fileName) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
    };

    return s3.deleteObject(params).promise();
};

const generateSignedUrl = (fileName, expiresIn) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Expires: expiresIn,
    };

    return s3.getSignedUrl('getObject', params);
};

module.exports = {
    uploadFile,
    deleteFile,
    generateSignedUrl,
};