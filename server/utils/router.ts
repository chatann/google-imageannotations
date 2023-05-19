import { Router } from "express";
import uploadS3 from "./uploadS3";
import webDetection from "./webDetection";
import { awsBucketName } from "../config/config";

const router = Router();

router.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// upload image to S3
router.post("/upload", async (req, res) => {
  try {
    const singleUpload = await uploadS3(awsBucketName);
    const objectKey = await singleUpload(req, res);

    const result = await webDetection(awsBucketName, objectKey);
    res.send({ result });
  } catch (err) {
    console.log(err);
  }
});

export default router;
