import { IDataService } from "./IDataService";
import { IFilm } from "../model/IFilm";
import { IDataSW } from "../model/IDataSW";

export class FilmsService {
  constructor(private dataService: IDataService) {}

  public getFilms(): Promise<IDataSW<IFilm[]>> {
    return this.dataService.getData("films");
  }

  public getMore(nextURL: string): Promise<IDataSW<IFilm[]>> {
    return this.dataService.getData(nextURL);
  }

  public searchFilm(query: string) {
    return this.dataService.getData("films/?search=" + query);
  }
}
