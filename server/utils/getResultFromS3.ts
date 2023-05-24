import s3 from "./s3Client";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { awsBucketName } from "../config/config";
import { Readable } from "stream";

const getResultFromS3 = async (objectKey: string) => {
  return new Promise<string>((resolve, reject) => {
    const params = {
      Bucket: `${awsBucketName}-after`,
      Key: `${objectKey}.json`,
    };
    const headObjectCommand = new HeadObjectCommand(params);

    const interval = setInterval(async () => {
      try {
        const head = await s3.send(headObjectCommand);
        if (head.ContentLength) {
          clearInterval(interval);
          const getObjectCommand = new GetObjectCommand(params);
          const { Body } = await s3.send(getObjectCommand);
          if (!(Body instanceof Readable)) {
            throw new Error("Body is not Readable");
          }
          const chunks: Buffer[] = [];
          for await (const chunk of Body) {
            chunks.push(chunk);
          }
          const result = Buffer.concat(chunks).toString("utf-8");
          resolve(result);
        }
      } catch (err) {
        console.log("Error retrieving result from S3:", err);
      }
    }, 3000);
  });
};

export default getResultFromS3;
