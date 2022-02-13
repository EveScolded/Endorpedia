import { IDataService } from "./IDataService";
import { ISpecies } from "../model/ISpecies";
import { IDataSW } from "../model/IDataSW";

export class SpeciesService {
  constructor(private dataService: IDataService) {}

  public getSpecies(): Promise<IDataSW<ISpecies[]>> {
    return this.dataService.getData("species");
  }

  public getMore(nextURL: string): Promise<IDataSW<ISpecies[]>> {
    return this.dataService.getData(nextURL);
  }

  public searchSpecies(query: string) {
    return this.dataService.getData("species/?search=" + query);
  }
}
