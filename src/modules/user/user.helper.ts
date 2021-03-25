import { Request } from 'express';
import { ResponseCode } from '../../helpers/response/responseCode';
import { getRepository } from 'typeorm';

import User from '../../database/entity/User.entity';
import Address from '../../database/entity/Address.entity';

import isEmailValid from '../../helpers/isEmailValid';
import isPasswordValid from '../../helpers/isPasswordValid';
import isUFValid from '../../helpers/isUFValid';
import isPostalCodeValid from '../../helpers/isPostalCodeValid';
import dateValidation from '../../helpers/DateValidations';
import isLatitudeValid from '../../helpers/isLatitudeValid';
import isLongitudeValid from '../../helpers/isLongitudeValid';
import hashPassword from '../../helpers/hashPassword';
import { uploadCloud } from '../../helpers/cloudinary';

class UserHelper {
  public isOngValid (req: Request): void {
    this.userFieldsIsValid(req);
    this.addressFieldsIsValid(req.body);
    this.ongAddressIsValid(req.body);
  }

  public isCommonValid (req: Request): void {
    this.userFieldsIsValid(req);
    this.commonFieldsIsValid(req.body);
    this.addressFieldsIsValid(req.body);
  }

  public isLoginFieldsValid (body: any): void {
    const { email, password } = body;
    isEmailValid(email);
    isPasswordValid(password);
  }

  public recoverFactory (): any {
    const newPassword: string = Math.random().toString(36).slice(-15);
    const userChanges: any = {};
    userChanges.passwordChange = true;
    userChanges.passwordChangeDate = new Date().toISOString();
    userChanges.password = hashPassword(newPassword);
    return { userChanges, newPassword };
  }

  public isOngValidEdit (req: Request): void {
    this.userFieldsIsValidEdit(req.body);
    this.addressFieldsIsValidEdit(req.body);
    this.ongAddressIsValidEdit(req.body);
  }

  public isCommonValidEdit (req: Request): void {
    this.userFieldsIsValidEdit(req.body);
    this.commonFieldsIsValidEdit(req.body);
    this.addressFieldsIsValidEdit(req.body);
  }

  public async ongFactory (req: Request): Promise<User> {
    const { name, type, whatsApp, telephone, email, password } = req.body;
    const photo: any = await uploadCloud(req, 'User');
    const user: User = new User();
    user.name = name;
    user.type = type;
    user.email = email;
    user.password = password;
    user.photoProfile = photo[0].url;
    user.idPhotoProfile = photo[0].idPhoto;
    if (telephone !== undefined) {
      user.telephone = telephone;
    }
    if (whatsApp !== undefined) {
      user.whatsApp = whatsApp;
    }
    return user;
  }

  public async ongFactoryEdit (req: Request): Promise<any> {
    const { name, whatsApp, telephone, email, password } = req.body;
    const user: any = {};
    if (req.file) {
      const photo: any = await uploadCloud(req, 'User');
      user.photoProfile = photo[0].url;
      user.idPhotoProfile = photo[0].idPhoto;
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = hashPassword(password);
    if (telephone) user.telephone = telephone;
    if (whatsApp) user.whatsApp = whatsApp;
    return user;
  }

  public ongAddressFactory (req: Request, user: User): Address {
    const { uf, city, postalCode, addressNumber, street, district, latitude, longitude, complement } = req.body;
    const address: Address = new Address();
    address.user = user;
    address.uf = uf;
    address.city = city;
    address.postalCode = postalCode;
    address.street = street;
    address.district = district;
    address.latitude = latitude;
    address.longitude = longitude;
    if (addressNumber !== undefined) {
      address.addressNumber = addressNumber;
    }
    if (complement !== undefined) {
      address.complement = complement;
    }
    return address;
  }

  public ongAddressFactoryEdit (req: Request): any {
    const { uf, city, postalCode, addressNumber, street, district, latitude, longitude, complement } = req.body;
    const address: any = {};
    if (uf) address.uf = uf;
    if (city) address.city = city;
    if (postalCode) address.postalCode = postalCode;
    if (street) address.street = street;
    if (district) address.district = district;
    if (latitude) address.latitude = latitude;
    if (longitude) address.longitude = longitude;
    if (addressNumber) address.addressNumber = addressNumber;
    if (complement) address.complement = complement;
    return address;
  }

  public async commonFactory (req: Request): Promise<User> {
    const { name, type, whatsApp, telephone, email, password, lastName, birthday } = req.body;
    const photo: any = await uploadCloud(req, 'User');
    const user: User = new User();
    user.photoProfile = photo[0].url;
    user.idPhotoProfile = photo[0].idPhoto;
    user.name = name;
    user.lastName = lastName;
    user.birthday = dateValidation.ConvertClientToServer(birthday);
    user.type = type;
    user.email = email;
    user.password = password;
    if (telephone !== undefined) {
      user.telephone = telephone;
    }
    if (whatsApp !== undefined) {
      user.whatsApp = whatsApp;
    }
    return user;
  }

  public async commonFactoryEdit (req: Request): Promise<any> {
    const { name, whatsApp, telephone, email, password, lastName, birthday } = req.body;
    const user: any = {};
    if (req.file) {
      const photo: any = await uploadCloud(req, 'User');
      user.photoProfile = photo[0].url;
      user.idPhotoProfile = photo[0].idPhoto;
    }
    if (name) user.name = name;
    if (lastName) user.lastName = lastName;
    if (birthday) user.birthday = dateValidation.ConvertClientToServer(birthday);
    if (email) user.email = email;
    if (password) user.password = hashPassword(password);
    if (telephone) user.telephone = telephone;
    if (whatsApp) user.whatsApp = whatsApp;
    return user;
  }

  public commonAddressFactory (req: Request, user: User): Address {
    const { uf, city, postalCode, addressNumber, street, district, complement } = req.body;
    const address: Address = new Address();
    address.user = user;
    address.uf = uf;
    address.city = city;
    address.postalCode = postalCode;
    address.street = street;
    address.district = district;
    if (addressNumber !== undefined) {
      address.addressNumber = addressNumber;
    }
    if (complement !== undefined) {
      address.complement = complement;
    }
    return address;
  }

  public commonAddressFactoryEdit (req: Request): any {
    const { uf, city, postalCode, addressNumber, street, district, complement } = req.body;
    const address: any = {};
    if (uf) address.uf = uf;
    if (city) address.city = city;
    if (postalCode) address.postalCode = postalCode;
    if (street) address.street = street;
    if (district) address.district = district;
    if (addressNumber) address.addressNumber = addressNumber;
    if (complement) address.complement = complement;
    return address;
  }

  public isNeedUserOng (ongFields: any): boolean {
    const { name, whatsApp, telephone, email, password } = ongFields;
    if (name || whatsApp || telephone || email || password) {
      return true;
    } else {
      return false;
    }
  }

  public isNeedAddressOng (ongAddressFields: any): boolean {
    const { uf, city, postalCode, addressNumber, street, district, latitude, longitude, complement } = ongAddressFields;
    if (uf || city || postalCode || addressNumber || street || district || latitude || longitude || complement) {
      return true;
    } else {
      return false;
    }
  }

  public isNeedUserCommon (commonFields: any): boolean {
    const { name, whatsApp, telephone, email, password, lastName, birthday } = commonFields;
    if (name || whatsApp || telephone || email || password || lastName || birthday) {
      return true;
    } else {
      return false;
    }
  }

  public isNeedAddressCommon (commonAddressFields: any): boolean {
    const { uf, city, postalCode, addressNumber, street, district, complement } = commonAddressFields;
    if (uf || city || postalCode || addressNumber || street || district || complement) {
      return true;
    } else {
      return false;
    }
  }

  private userFieldsIsValid (req: Request): void {
    const { name, whatsApp, telephone, email, password } = req.body;
    if (!name) throw new Error(ResponseCode.E_001_001);
    if (telephone) {
      if (!/\(\d{2}\)\s9\s\d{4}-\d{4}/g.test(telephone)) throw new Error(ResponseCode.E_001_023);
    }
    if (whatsApp) {
      if (!/\(\d{2}\)\s9\s\d{4}-\d{4}/g.test(whatsApp)) throw new Error(ResponseCode.E_001_024);
    }
    if (!req.file) throw new Error(ResponseCode.E_001_011);
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

  private userFieldsIsValidEdit (userFields: any): void {
    const { whatsApp, telephone, email, password } = userFields;
    if (telephone) {
      if (!/\(\d{2}\)\s9\s\d{4}-\d{4}/g.test(telephone)) throw new Error(ResponseCode.E_001_023);
    }
    if (whatsApp) {
      if (!/\(\d{2}\)\s9\s\d{4}-\d{4}/g.test(whatsApp)) throw new Error(ResponseCode.E_001_024);
    }
    if (email) isEmailValid(email);
    if (password) isPasswordValid(password);
  }

  private commonFieldsIsValidEdit (commonFields: any): void {
    const { birthday } = commonFields;
    if (birthday) dateValidation.dateForUser(birthday, true);
  }

  private addressFieldsIsValidEdit (addressFields: any): void {
    const { uf, postalCode } = addressFields;
    if (uf) isUFValid(uf);
    if (postalCode) isPostalCodeValid(postalCode);
  }

  private ongAddressIsValidEdit (ongAddresssFields: any): void {
    const { latitude, longitude } = ongAddresssFields;
    if (latitude) isLatitudeValid(latitude);
    if (longitude) isLongitudeValid(longitude);
  }
}

export default new UserHelper();
