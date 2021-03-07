/* eslint-disable no-useless-escape */
import { ResponseCode } from './response/responseCode';
class DateValidation {
  public dateForUser (date: string, birthday:Boolean): void {
    if (!date) throw new Error(ResponseCode.E_001_009);
    const newDate = this.ValidateClientDate(date);
    if (birthday) this.isOldEnough(newDate);
  }

  public ConvertClientToServer (dateString: string): Date {
    const matches = dateString.match(/^(\d{2})[\/|\-](\d{2})[\/|\-](\d{4})$/);
    if (!matches) throw new Error(ResponseCode.E_001_026);
    const year = parseInt(matches[3], 10);
    const month = parseInt(matches[2], 10) - 1;
    const day = parseInt(matches[1], 10);
    return new Date(year, month, day);
  }

  public ConvertServerToClient () {

  }

  private ValidateClientDate (dateString: string): string {
    const matches = dateString.match(/^(\d{2})[\/|\-](\d{2})[\/|\-](\d{4})$/);
    if (!matches) throw new Error(ResponseCode.E_001_026);

    const year = parseInt(matches[3], 10);
    const month = parseInt(matches[2], 10) - 1;
    const day = parseInt(matches[1], 10);
    const date = new Date(year, month, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      throw new Error(ResponseCode.E_001_026);
    }

    return `${year}-0${month}-${day}`;
  }

  private isOldEnough (date: string): void {
    const matches = date.match(/^(\d{4})\-(\d{2})\-(\d{2})$/);
    if (!matches) throw new Error(ResponseCode.E_001_026);
    const year = parseInt(matches[1], 10);
    const month = parseInt(matches[2], 10);
    const day = parseInt(matches[3], 10);

    if (new Date(year + 16, month, day) >= new Date()) {
      throw new Error(ResponseCode.E_001_010);
    }
  }
}

export default new DateValidation();
