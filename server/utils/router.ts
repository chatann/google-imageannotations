import { Router } from "express";
import { createBucket, deleteBucket } from "./bucketCommands";
import uploadS3 from "./uploadS3";
import webDetection from "./webDetection";

const router = Router();

router.get("/hello", (req, res) => {
  res.send("Hello World!");
});

// upload image to S3
router.post("/upload", async (req, res) => {
  try {
    const bucketName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    await createBucket(bucketName);
    const singleUpload = await uploadS3(bucketName);
    singleUpload(req, res, async (err: any) => {
      if (err) {
        return res.status(422).send({
          errors: [{ title: "Image Upload Error", detail: err.message }],
        });
      } else {
        const result = await webDetection(bucketName);
        res.send({ result });
      }
    });
    await deleteBucket(bucketName);
  } catch (err) {
    console.log(err);
  }
});

export default router;
