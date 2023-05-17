import vision from "@google-cloud/vision";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3 from "./s3Client";

const getBucketObjects = async (bucketName: string) => {
  const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucketName });
  const { Contents } = await s3.send(listObjectsCommand);

  const objects = [];
  for (const content of Contents || []) {
    const objectKey = content.Key;
    const objectUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
    if (objectKey) {
      objects.push({ key: objectKey, url: objectUrl });
    }
  }
  return objects;
};

const webDetection = async (bucketName: string) => {
  try {
    const client = new vision.ImageAnnotatorClient();

    const objects = await getBucketObjects(bucketName);

    const request = {
      image: { source: { imageUri: objects[0].url } },
      imageContext: {
        webDetectionParams: { includeGeoResults: true },
      },
    };

    const [result] = await client.webDetection(request);
    console.log(result);
    const webDetection = result.webDetection;

    return webDetection?.webEntities;
  } catch (err) {
    console.log(err);
  }
};

export default webDetection;
