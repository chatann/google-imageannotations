import { CreateBucketCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";
import s3 from "./s3Client";

const createBucket = async (bucketName: string) => {
  const createBucketCommand = new CreateBucketCommand({
    Bucket: bucketName,
  });
  await s3.send(createBucketCommand);
};

const deleteBucket = async (bucketName: string) => {
  const deleteBucketCommand = new DeleteBucketCommand({
    Bucket: bucketName,
  });
  await s3.send(deleteBucketCommand);
};

export { createBucket, deleteBucket };
