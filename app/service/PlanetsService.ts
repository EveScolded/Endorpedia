import { IDataService } from "./IDataService";
import { IPlanet } from "../model/IPlanet";
import { IDataSW } from "../model/IDataSW";

export class PlanetsService {
  constructor(private dataService: IDataService) {}

  public getPlanets(): Promise<IDataSW<IPlanet[]>> {
    return this.dataService.getData("planets");
  }

  public getMore(nextURL: string): Promise<IDataSW<IPlanet[]>> {
    return this.dataService.getData(nextURL);
  }

  public searchPlanet(query: string) {
    return this.dataService.getData("planet/?search=" + query);
  }
}
