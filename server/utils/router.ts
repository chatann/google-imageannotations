import { Router, Request, Response } from "express";
import multer from "multer";
import uploadS3 from "./uploadS3";
import getResultFromS3 from "./getResultFromS3";

const router = Router();

router.post("/upload", (req, res) => {
  uploadS3(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    const reqFile = req.file as Express.MulterS3.File;
    const objectKey = reqFile.key;
    const result = getResultFromS3(objectKey);
    return res.status(200).json(result);
  });
});

export default router;
