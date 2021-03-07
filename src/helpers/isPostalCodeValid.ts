import { ResponseCode } from './response/responseCode';

export default (postalCode: string): void => {
  const regex = /(^\d{5}-\d{3}|^\d{2}.\d{3}-\d{3}|\d{8})/;
  if (!postalCode) throw new Error(ResponseCode.E_001_017);
  if (!regex.test(postalCode)) throw new Error(ResponseCode.E_001_025);
};
