import { ResponseCode } from './response/responseCode';

export default (latitude:number):void => {
  if (latitude < -90 || latitude > 90) throw new Error(ResponseCode.E_001_019);
};
