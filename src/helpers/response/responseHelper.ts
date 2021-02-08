/* eslint-disable no-unused-vars */
import { Lang } from './langHelper';
import { ResponseCode } from './responseCode';
import { ResponseMessages } from './responseMessages';

export enum ResponseType {
  SUCCESS = 'S',
  ERROR = 'E',
}

interface IResponseHelper {
  code: ResponseCode
  type: ResponseType
  lang?: Lang
}

export default (params: IResponseHelper) => {
  const getLang = params.lang || Lang.ptBR;
  return {
    result: {
      code: params.code,
      type: params.type,
      mensagem: ResponseMessages[params.code][getLang]
    }
  };
}
;
