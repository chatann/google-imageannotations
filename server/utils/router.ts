import { Router, Request, Response } from "express";
import uploadS3 from "./uploadS3";
import getResultFromS3 from "./getResultFromS3";

const router = Router();

router.post(
  "/upload",
  (req, res, next) => {
    uploadS3(req, res, (err) => {
      if (err) {
        return res.status(400).json({ err: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    const reqFile = req.file as Express.MulterS3.File;
    const objectKey = reqFile.key;

    try {
      const result = await getResultFromS3(objectKey);
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.status(200).json(JSON.parse(result));
    } catch (err: any) {
      res.status(400).json({ Error: err.message });
    }
  }
);

export default router;
