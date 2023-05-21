import { Router, Request, Response } from "express";
import multer from "multer";
import uploadS3 from "./uploadS3";
import webDetection from "./webDetection";
import { awsBucketName, lambdaUrl } from "../config/config";
import path from "path";
import fs from "fs";

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

  // Generate a unique filename
  const filename = Date.now() + ".json";

  // Define the path where the file will be saved
  const filePath = path.join(__dirname, "public", filename);

  // Write the JSON data to the file
  fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {
    if (err) {
      // An error occurred while saving the file
      console.error(err);
      return res.status(500).json({ error: "Failed to save the file" });
    }

    // File saved successfully
    return res.status(200).json({ message: "File saved successfully" });
  });
});

export default router;
