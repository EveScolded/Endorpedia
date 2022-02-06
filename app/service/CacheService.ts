import { IDataService } from "./IDataService";
import AsyncStorage from "@react-native-async-storage/async-storage"; // eslint-disable-line

export class CacheService implements IDataService {
  constructor(private baseService: IDataService) {}

  public getData = async (endpoint: string): Promise<any> => {
    const value = await AsyncStorage.getItem(endpoint);
    if (value !== null) {
      return JSON.parse(value);
    }
    const result = await this.baseService.getData(endpoint);
    await AsyncStorage.setItem(endpoint, JSON.stringify(result));
    return result;
  };
}
