import '../helpers/env';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface TokenPayload {
  id: number;
  type: string;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, process.env.SECRET as string);
    const { id, type } = data as TokenPayload;
    req.userId = id;
    req.userType = type;
    return next();
  } catch {
    return res.status(401).send({ error: 'token error' });
  }
};
