
require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
const MyError = require("../exception/MyError");
const BucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// const FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE);

class AwsS3Upload {
  async uploadFile(file, bucketName = BucketName) {
    const fileStream = fs.readFileSync(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: `gavroche-${Date.now()}-${file.originalname}`,
    };

    const { mimetype } = file;
    if (
      mimetype === "image/jpeg" ||
      mimetype === "image/png" ||
      mimetype === "image/gif" ||
      mimetype === "video/mp3" ||
      mimetype === "video/mp4"
    )
      uploadParams.ContentType = mimetype;

    try {
      const { Location } = await s3.upload(uploadParams).promise();

      return Location;
    } catch (err) {
      console.log("err: ", err);
      throw new MyError("Upload file Aws S3 failed");
    }
  }

  // downloads a file from s3
  async getFileStream(url, bucketName = BucketName) {
    const urlSplit = url.split("/");
    const key = urlSplit[urlSplit.length - 1];
    const downloadParams = {
      Key: key,
      Bucket: BucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
  }

  async deleteFile(url, bucketName = BucketName) {
    const urlSplit = url.split("/");
    const key = urlSplit[urlSplit.length - 1];

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (err) {
      throw new MyError("Delete file Aws S3 failed");
    }
  }
}

module.exports = new AwsS3Upload();
