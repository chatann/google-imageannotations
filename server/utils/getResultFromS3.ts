import s3 from "./s3Client";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { awsBucketName } from "../config/config";

const getResultFromS3 = async (objectKey: string) => {
  const params = {
    Bucket: awsBucketName,
    Key: objectKey,
  };
  const headObjectCommand = new HeadObjectCommand(params);

  const interval = setInterval(async () => {
    try {
      const head = await s3.send(headObjectCommand);
      if (head.ContentLength) {
        clearInterval(interval);
        const getObjectCommand = new GetObjectCommand(params);
        const data = await s3.send(getObjectCommand);
        const result = data.Body?.toString();
        return result;
      }
    } catch (err) {
      console.log("Error retrieving result from S3:", err);
    }
  }, 1000);
};

export default getResultFromS3;
