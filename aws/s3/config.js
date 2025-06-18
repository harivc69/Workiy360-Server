const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "ap-south-1",
  signatureVersion: "v4",
});

module.exports = s3;
