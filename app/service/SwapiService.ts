import { IDataService } from "./IDataService";

export class SwapiService implements IDataService {
  private baseURL: string = "https://swapi.dev/api/";

  public getData = async (endpoint: string) => {
    if (endpoint.indexOf(this.baseURL) === -1) {
      endpoint = this.baseURL + endpoint;
    }
    try {
      const response = await fetch(endpoint);
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
