import path from "path";
import s3 from "./s3Client";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";

const uploadS3 = async (bucketName: string) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      metadata: function (
        req: Request,
        file: Express.Multer.File,
        cb: Function
      ) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        const uniqueSuffix =
          Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
        cb(null, file.fieldname + "-" + uniqueSuffix);
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
