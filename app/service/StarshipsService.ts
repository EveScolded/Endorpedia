import { IDataService } from "./IDataService";
import { IStarship } from "../model/IStarship";
import { IDataSW } from "../model/IDataSW";

export class StarshipsService {
  constructor(private dataService: IDataService) {}

  public getStarship(): Promise<IDataSW<IStarship[]>> {
    return this.dataService.getData("starships");
  }

  public getMore(nextURL: string): Promise<IDataSW<IStarship[]>> {
    return this.dataService.getData(nextURL);
  }

  public searchStarship(query: string) {
    return this.dataService.getData("starships/?search=" + query);
  }
}
