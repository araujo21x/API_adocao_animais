import { ResponseCode } from './response/responseCode';

export default (email: string): void => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email) throw new Error(ResponseCode.E_001_004);
  if (!regex.test(email)) throw new Error(ResponseCode.E_001_005);
};
