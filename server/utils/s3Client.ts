import { S3Client } from "@aws-sdk/client-s3";
import { awsAccessKeyId, awsSecretAccessKey } from "../config/config";

const s3 = new S3Client({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

export default s3;
