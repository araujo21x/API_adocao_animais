import { ResponseCode } from './response/responseCode';

export default (uf: string): void => {
  const regex = /^(ac|AC|al|AL|am|AM|ap|AP|ba|BA|ce|CE|df|DF|es|ES|go|GO|ma|MA|mg|MG|ms|MS|mt|MT|pa|PA|pb|PB|pe|PE|pi|PI|pr|PR|rj|RJ|rn|RN|ro|RO|rr|RR|rs|RS|sc|SC|se|SE|sp|SP|to|TO)$/;
  if (!uf) throw new Error(ResponseCode.E_001_012);
  if (!regex.test(uf)) throw new Error(ResponseCode.E_001_013);
};
