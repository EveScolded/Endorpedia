import { IDataService } from "./IDataService";
import { IVehicle } from "../model/IVehicle";
import { IDataSW } from "../model/IDataSW";

export class VehiclesService {
  constructor(private dataService: IDataService) {}

  public getVehicles(): Promise<IDataSW<IVehicle[]>> {
    return this.dataService.getData("vehicles");
  }

  public getMore(nextURL: string): Promise<IDataSW<IVehicle[]>> {
    return this.dataService.getData(nextURL);
  }

  public searchVehicle(query: string) {
    return this.dataService.getData("vehicles/?search=" + query);
  }
}
