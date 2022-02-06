export interface IDataService {
  getData: (endpoint: string) => Promise<any>;
}
