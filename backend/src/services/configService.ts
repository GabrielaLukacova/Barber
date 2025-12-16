import {
  configModels,
  type OpeningHoursInput,
  type TimeOffInput,
  type BarberShopInput,
  type type PostalCodeInput
} from '../models/configModels';

export class ConfigService {
  // OpeningHours
  listOpeningHours() {
    return configModels.listOpeningHours();
  }
  getOpeningHours(id: number) {
    return configModels.getOpeningHours(id);
  }
  createOpeningHours(input: OpeningHoursInput) {
    return configModels.createOpeningHours(input);
  }
  updateOpeningHours(id: number, input: OpeningHoursInput) {
    return configModels.updateOpeningHours(id, input);
  }
  deleteOpeningHours(id: number) {
    return configModels.deleteOpeningHours(id);
  }

  // TimeOff
  listTimeOff() {
    return configModels.listTimeOff();
  }
  getTimeOff(id: number) {
    return configModels.getTimeOff(id);
  }
  createTimeOff(input: TimeOffInput) {
    return configModels.createTimeOff(input);
  }
  updateTimeOff(id: number, input: TimeOffInput) {
    return configModels.updateTimeOff(id, input);
  }
  deleteTimeOff(id: number) {
    return configModels.deleteTimeOff(id);
  }

  // BarberShop
  listBarberShops() {
    return configModels.listBarberShops();
  }
  getBarberShop(id: number) {
    return configModels.getBarberShop(id);
  }
  createBarberShop(input: BarberShopInput) {
    return configModels.createBarberShop(input);
  }
  updateBarberShop(id: number, input: BarberShopInput) {
    return configModels.updateBarberShop(id, input);
  }
  deleteBarberShop(id: number) {
    return configModels.deleteBarberShop(id);
  }


  // PostalCode
  listPostalCodes() {
    return configModels.listPostalCodes();
  }
  getPostalCode(code: string) {
    return configModels.getPostalCode(code);
  }
  createPostalCode(input: PostalCodeInput) {
    return configModels.createPostalCode(input);
  }
  updatePostalCode(code: string, input: PostalCodeInput) {
    return configModels.updatePostalCode(code, input);
  }
  deletePostalCode(code: string) {
    return configModels.deletePostalCode(code);
  }
}

export const configService = new ConfigService();
