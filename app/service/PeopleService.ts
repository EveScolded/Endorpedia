import { IDataService } from "./IDataService";
import { Person } from "../model/person";
import { DataSW } from "../model/data";

export class PeopleService {
  constructor(private dataService: IDataService) {}

  public getPeople(): Promise<DataSW<Person>> {
    return this.dataService.getData("people");
  }

  public getMore(nextURL: string): Promise<DataSW<Person>> {
    return this.dataService.getData(nextURL);
  }

  public searchPeople(query: string) {
    return this.dataService.getData("people/?search=" + query);
  }
}
