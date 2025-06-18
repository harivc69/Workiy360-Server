const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("./config");
const config = require("../../config/env");

const PROFILE_BUCKET = config.s3.profileBucket;
const APP_BUCKET = config.s3.appBucket;

// Upload for user profile photo
const uploadProfilePhoto = multer({
  storage: multerS3({
    s3,
    bucket: PROFILE_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const username = req.body.username || "anonymous";
      cb(null, `${username}/profileicon.jpg`);
    },
  }),
});

// Upload for app assets (e.g., images used in pages)
const uploadAppAsset = multer({
  storage: multerS3({
    s3,
    bucket: APP_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = file.originalname;
      cb(null, `assets/${filename}`);
    },
  }),
});

module.exports = {
  uploadProfilePhoto,
  uploadAppAsset,
};
