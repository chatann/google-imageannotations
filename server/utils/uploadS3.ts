import path from "path";
import s3 from "./s3Client";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request, Response } from "express";
import { awsBucketName } from "../config/config";

const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: awsBucketName,
    metadata: function (req: Request, file: Express.Multer.File, cb: Function) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
      const objectKey = file.fieldname + "-" + uniqueSuffix;
      cb(null, objectKey);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file");

function checkFileType(file: Express.Multer.File, cb: Function) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Images Only Allowed");
  }
}

export default uploadS3;
