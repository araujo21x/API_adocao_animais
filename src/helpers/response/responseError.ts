import { Response } from 'express';
import { ResponseCode } from './responseCode';
import ResponseHelper, { ResponseType } from './responseHelper';

export default (res: Response, code?: ResponseCode, status: number = 500) => {
  if (code === ResponseCode.E_000_404) {
    return res.status(404).jsonp(
      ResponseHelper({
        type: ResponseType.ERROR,
        code: ResponseCode.E_000_404
      })
    );
  }

  return res.status(status).jsonp(
    ResponseHelper({
      type: ResponseType.ERROR,
      code: code || ResponseCode.E_000_404
    })
  );
};
