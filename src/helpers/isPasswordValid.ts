import { ResponseCode } from './response/responseCode';

export default (password: string): void => {
  if (!password) throw new Error(ResponseCode.E_001_006);
  if (password.length < 8) throw new Error(ResponseCode.E_001_007);
};
