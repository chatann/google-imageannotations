import s3 from "./s3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const webDetection = async (bucketName: string, objectKey: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: `${bucketName}-after`,
    Key: `${objectKey}.json`,
  });
  try {
    const response = await s3.send(getObjectCommand);
    const body = response.Body;

    if (body instanceof Readable) {
      let data = "";
      body.setEncoding("utf8");
      for await (const chunk of body) {
        data += chunk;
      }
      return data;
    } else {
      return body?.toString();
    }
  } catch (err) {
    console.log("Error", err);
  }
};

export default webDetection;
