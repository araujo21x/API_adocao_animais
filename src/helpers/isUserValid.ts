import { ResponseCode } from './response/responseCode';

export default (type: string): void => {
  const valid: Array<String> = ['ong', 'common'];

  if (!valid.includes(type)) throw new Error(ResponseCode.E_001_002);
};
