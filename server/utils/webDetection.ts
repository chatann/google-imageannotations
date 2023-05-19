import s3 from "./s3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const webDetection = async (bucketName: string, objectKey: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: `${bucketName}-after`,
    Key: `${objectKey}.json`,
  });
  try {
    const response = await s3.send(getObjectCommand);
    return response.Body;
  } catch (err) {
    console.log("Error", err);
  }
};

export default webDetection;
