import { Request } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const local: multer.StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    cb(null, path.resolve(__dirname, '..', 'tmp', 'img'));
  },
  filename: (req: Request, file: any, cb: any) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err, 'erro no nome');
      file.filename = `${hash.toString('hex')}-${file.originalname}`;
      cb(null, file.filename);
    });
  }
});

const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];

export default {
  dest: path.resolve(__dirname, '..', 'tmp', 'img'),
  storage: local,
  fileFilter: (req: Request, file: any, cb: any) => {
    if (!allowedMimes.includes(file.mimetype)) cb(new Error('tipo de arquivo invalido!'));
    cb(null, true);
  }

};
