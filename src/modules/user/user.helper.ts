import { ResponseCode } from '../../helpers/response/responseCode';
import { getRepository } from 'typeorm';

import User from '../../database/entity/User.entity';

import isEmailValid from '../../helpers/isEmailValid';
import isPasswordValid from '../../helpers/isPasswordValid';
import isUFValid from '../../helpers/isUFValid';
import isPostalCodeValid from '../../helpers/isPostalCodeValid';
import dateValidation from '../../helpers/DateValidations';
import isLatitudeValid from '../../helpers/isLatitudeValid';
import isLongitudeValid from '../../helpers/isLongitudeValid';

class UserHelper {
  public isOngValid (body: any): void {
    this.userFieldsIsValid(body);
    this.addressFieldsIsValid(body);
    this.ongAddressIsValid(body);
  }

  public isCommonValid (body: any): void {
    this.userFieldsIsValid(body);
    this.commonFieldsIsValid(body);
    this.addressFieldsIsValid(body);
  }

  private userFieldsIsValid (userFields: any): void {
    const { name, whatsApp, telephone, email, password } = userFields;
    if (!name) throw new Error(ResponseCode.E_001_001);
    if (telephone !== undefined) {
      if (telephone.length !== 11) throw new Error(ResponseCode.E_001_023);
    }
    if (whatsApp !== undefined) {
      if (whatsApp.length !== 11) throw new Error(ResponseCode.E_001_024);
    }
    isEmailValid(email);
    isPasswordValid(password);
  }

  private commonFieldsIsValid (commonFields: any): void {
    const { lastName, birthday } = commonFields;
    if (!lastName) throw new Error(ResponseCode.E_001_008);
    dateValidation.dateForUser(birthday, true);
  }

  private addressFieldsIsValid (addressFields: any): void {
    const { uf, city, postalCode, street, district } = addressFields;
    if (!city) throw new Error(ResponseCode.E_001_014);
    if (!street) throw new Error(ResponseCode.E_001_015);
    if (!district) throw new Error(ResponseCode.E_001_016);
    isUFValid(uf);
    isPostalCodeValid(postalCode);
  }

  private ongAddressIsValid (ongAddressFields: any): void {
    const { latitude, longitude } = ongAddressFields;
    if (!latitude) throw new Error(ResponseCode.E_001_018);
    if (!longitude) throw new Error(ResponseCode.E_001_020);
    isLatitudeValid(latitude);
    isLongitudeValid(longitude);
  }

  public async existingEmail (email: string): Promise<void> {
    const existingEmail = await getRepository(User).findOne({ email });
    if (existingEmail) throw new Error(ResponseCode.E_001_022);
  }
}

export default new UserHelper();
