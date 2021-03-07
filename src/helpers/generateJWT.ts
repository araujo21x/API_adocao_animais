import jwt from 'jsonwebtoken';

export default (id: number, type: string): string => {
  return jwt.sign(
    { id, type },
    `${process.env.SECRET}`,
    { expiresIn: process.env.EXPIRES_TOKEN }
  );
};
