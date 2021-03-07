import { ResponseCode } from './response/responseCode';

export default (longitude: number): void => {
  if (longitude < -180 || longitude > 180) throw new Error(ResponseCode.E_001_021);
};
