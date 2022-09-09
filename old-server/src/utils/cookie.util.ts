import { Response } from 'express';
export const setCookie = (
  key: string,
  value: string,
  maxAgeMilliseconds: number,
  res: Response,
) => {
  res.cookie(key, value, {
    path: '/',
    maxAge: maxAgeMilliseconds,
    httpOnly: true,
    secure: false,
  });
};

export const clearCookies = (res: Response) => {
  setCookie('email', '', 0, res);
  setCookie('token', '', 0, res);
};
