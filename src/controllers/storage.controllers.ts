// import { S3Client } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { CatchError, TryError } from "../utils/error";

import { downloadObject, isFileExist, uploadObject } from "../utils/S3";

// const conn = new S3Client({
//   region: process.env.REGION,
//   endpoint: `https://s3-${process.env.REGION}.amazonaws.com`,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const path = req.body?.path;

    if (!path)
      throw TryError(
        "Failed to generate download url because path is missing ",
        400,
      );

    const isExist = await isFileExist(path);

    if (!isExist) throw TryError("File doesn't Exist", 400);

    const url = await downloadObject(path);
    res.json({ url });
  } catch (err) {
    CatchError(err, res, "Failed to generate download url");
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const path = req.body?.path;
    const type = req.body?.type;

    if (!path || !type)
      throw TryError("Invalid request type and path must required", 400);

    const url = await uploadObject(path, type);
    res.json({ url });
  } catch (err) {
    CatchError(err, res, "Failed to generate upload url");
  }
};
