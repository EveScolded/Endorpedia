import React from "react";
import { IFilm } from "../model/IFilm";
import { IDataSW } from "../model/IDataSW";
import { FilmsService } from "../service/FilmsService";
import Base, { BaseState } from "./Base";

interface State extends BaseState {
  data: IFilm[];
}

export default class Films extends Base<State> {
  protected detailsService: FilmsService;

  constructor(props) {
    super(props);
    this.detailsService = new FilmsService(props.route.params.dataService);

    this.state = {
      data: [],
      isLoading: true,
    };
  }

  protected async getData() {
    try {
      const response: IDataSW<IFilm[]> = await this.detailsService.getFilms();
      this.setState(
        {
          data: response.results,
        },
        () => this.getNextPage(response)
      );
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }
  protected searchDetail = () => {
    return null;
  };

  protected getNextPage = async (previousResponse: IDataSW<IFilm[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IFilm[]> = await this.detailsService.getMore(
          previousResponse.next
        );
        const combinedResults = [...this.state.data, ...response.results];
        this.setState({ data: combinedResults }, () =>
          this.getNextPage(response)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  private romans = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

  protected renderItemContent = (item) => {
    return [
      ["Episode", this.romans[item.episode_id].toLocaleString()],
      ["Director", item.director],
      ["Release date", item.release_date],
    ];
  };
}
