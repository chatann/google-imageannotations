import s3 from "./s3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { awsBucketName } from "../config/config";

const getResultFromS3 = async (objectKey: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: `${awsBucketName}-after`,
    Key: `${objectKey}.json`,
  });

  let count = 0;
  try {
    while (count < 3) {
      const getObjectResponse = await s3.send(getObjectCommand);
      if (getObjectResponse.Body) {
        const jsonBody = getObjectResponse.Body;
        const jsonData = JSON.parse(jsonBody.toString());
        return jsonData;
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
      count++;
    }
  } catch (err) {
    console.log("Error retrieving result from S3:", err);
  }

  throw new Error("Failed to retrieving result from S3");
};

export default getResultFromS3;
