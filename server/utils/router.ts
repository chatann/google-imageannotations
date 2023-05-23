import { Router, Request, Response } from "express";
import multer from "multer";
import uploadS3 from "./uploadS3";

const router = Router();

router.post("/upload", (req, res) => {
  uploadS3(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    return res.status(200).json({ message: "File uploaded successfully" });
  });
});

router.post("/result", (req, res) => {
  const jsonData = req.body;
  if (!jsonData) {
    return res.status(400).json({ error: "No data found" });
  }
  const data = JSON.stringify(jsonData);
  return res.status(200).json({ data });
});

export default router;
