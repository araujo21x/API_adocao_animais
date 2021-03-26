/* eslint-disable no-useless-escape */
import { ResponseCode } from './response/responseCode';
class DateValidation {
  public dateForUser (date: string, birthday: Boolean): void {
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

  public ConvertServerToClient (birthday: Date): string {
    const date: Date = new Date(birthday);

    let day: string = date.getDate().toString();
    day = day.length > 1 ? day : `0${day}`;

    let mother: string = date.getMonth().toString();
    mother = `${Number(mother) + 1}`;
    mother = mother.length > 1 ? mother : `0${mother}`;

    const year:string = date.getFullYear().toString();

    return `${day}/${mother}/${year}`;
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

    let daySend: string = date.getDate().toString();
    daySend = daySend.length > 1 ? daySend : `0${daySend}`;

    let mothSend: string = date.getMonth().toString();
    mothSend = mothSend.length > 1 ? mothSend : `0${mothSend}`;

    return `${year}-${mothSend}-${daySend}`;
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
