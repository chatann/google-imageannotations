import s3 from "./s3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { awsBucketName } from "../config/config";

const getResultFromS3 = async (objectKey: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: `${awsBucketName}-after`,
    Key: `${objectKey}.json`,
  });

  while (true) {
    try {
      const getObjectResponse = await s3.send(getObjectCommand);
      if (!getObjectResponse.Body) {
        throw new Error("No body in response");
      }
      const jsonBody = getObjectResponse.Body;
      const jsonData = JSON.parse(jsonBody.toString());
      return jsonData;
    } catch (err) {
      if (err instanceof Error && err.name !== "NoSuchKey") {
        throw err;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

export default getResultFromS3;
