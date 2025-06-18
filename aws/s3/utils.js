// aws/s3/utils.js
const getS3BaseUrl = (bucketName) => {
  const region = process.env.AWS_REGION || "ap-south-1";
  return `https://${bucketName}.s3.${region}.amazonaws.com/`;
};

// For example: getFullImageUrl("users-profile-photo", "wtsy/profileicon.jpg")
const getFullImageUrl = (bucketName, key) => {
  if (!bucketName || !key) return "";
  return getS3BaseUrl(bucketName) + key.replace(/^\/+/, "");
};

module.exports = {
  getS3BaseUrl,
  getFullImageUrl,
};
