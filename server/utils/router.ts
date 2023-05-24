import { Router, Request, Response } from "express";
import uploadS3 from "./uploadS3";
import getResultFromS3 from "./getResultFromS3";

const router = Router();

router.post(
  "/upload",
  (req, res, next) => {
    uploadS3(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ err: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const reqFile = req.file as Express.MulterS3.File;
    const objectKey = reqFile.key;

    const result = await getResultFromS3(objectKey);

    return res.status(200).json(result);
  }
);

export default router;
