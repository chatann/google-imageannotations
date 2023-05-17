import dotenv from "dotenv";

dotenv.config();

const clientOrigin = process.env.CLIENT_ORIGIN || "";

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
const awsBucketName = process.env.AWS_BUCKET_NAME || "";

export { clientOrigin, awsAccessKeyId, awsSecretAccessKey, awsBucketName };
