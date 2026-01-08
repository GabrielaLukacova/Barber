import {
  configModel,
  type OpeningHoursInput,
  type TimeOffInput,
  type BarberShopInput,
  type PostalCodeInput
} from '../models/configModel';

export class ConfigService {
  // OpeningHours
  listOpeningHours() {
    return configModel.listOpeningHours();
  }
  getOpeningHours(id: number) {
    return configModel.getOpeningHours(id);
  }
  createOpeningHours(input: OpeningHoursInput) {
    return configModel.createOpeningHours(input);
  }
  updateOpeningHours(id: number, input: OpeningHoursInput) {
    return configModel.updateOpeningHours(id, input);
  }
  deleteOpeningHours(id: number) {
    return configModel.deleteOpeningHours(id);
  }

  // TimeOff
  listTimeOff() {
    return configModel.listTimeOff();
  }
  getTimeOff(id: number) {
    return configModel.getTimeOff(id);
  }
  createTimeOff(input: TimeOffInput) {
    return configModel.createTimeOff(input);
  }
  updateTimeOff(id: number, input: TimeOffInput) {
    return configModel.updateTimeOff(id, input);
  }
  deleteTimeOff(id: number) {
    return configModel.deleteTimeOff(id);
  }

  // BarberShop
  listBarberShops() {
    return configModel.listBarberShops();
  }
  getBarberShop(id: number) {
    return configModel.getBarberShop(id);
  }
  createBarberShop(input: BarberShopInput) {
    return configModel.createBarberShop(input);
  }
  updateBarberShop(id: number, input: BarberShopInput) {
    return configModel.updateBarberShop(id, input);
  }
  deleteBarberShop(id: number) {
    return configModel.deleteBarberShop(id);
  }


  // PostalCode
  listPostalCodes() {
    return configModel.listPostalCodes();
  }
  getPostalCode(code: string) {
    return configModel.getPostalCode(code);
  }
  createPostalCode(input: PostalCodeInput) {
    return configModel.createPostalCode(input);
  }
  updatePostalCode(code: string, input: PostalCodeInput) {
    return configModel.updatePostalCode(code, input);
  }
  deletePostalCode(code: string) {
    return configModel.deletePostalCode(code);
  }
}

export const configService = new ConfigService();
