import { IDataService } from "./IDataService";
import { IPerson } from "../model/IPerson";
import { IDataSW } from "../model/IDataSW";

export class PeopleService {
  constructor(private dataService: IDataService) {}

  public getPeople(): Promise<IDataSW<IPerson[]>> {
    return this.dataService.getData("people");
  }

  public getMore(nextURL: string): Promise<IDataSW<IPerson[]>> {
    return this.dataService.getData(nextURL);
  }

  public searchPeople(query: string) {
    return this.dataService.getData("people/?search=" + query);
  }
}
