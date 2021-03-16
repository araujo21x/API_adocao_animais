import { Request } from 'express';
import { config } from 'dotenv';
import fs from 'fs';
import cloudinary from 'cloudinary';

import { ResponseCode } from './response/responseCode';
config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export const upload = async (file: string, folder: string, fileName: string): Promise<any> => {
  try {
    const value = await cloudinary.v2.uploader.upload(file
      , { public_id: `Adoption/${folder}/${fileName}` });
    return { url: value.url, idPhoto: value.public_id };
  } catch (err) { throw new Error(ResponseCode.E_004_001); }
};

export const deleteCloudinary = async (publicIdPhoto: string): Promise<void> => {
  const { result } = await cloudinary.v2.uploader.destroy(publicIdPhoto);
  if (result !== 'ok') throw new Error(ResponseCode.E_004_002);
};

export const uploadCloud = async (req: Request, folder: string) => {
  const files: any = req.files ?? [req.file];

  const filesPromises = files.map(async (file: any) => {
    const UploadedPhoto = await upload(file.path, folder, cutType(file.filename));
    fs.unlinkSync(file.path);
    return UploadedPhoto;
  });

  return await Promise.all(filesPromises);
};

const cutType = (fileName: string): string => {
  return fileName.slice(0, (fileName.length - 4));
};
