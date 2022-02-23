import React from "react";
import { IStarship } from "../model/IStarship";
import { IDataSW } from "../model/IDataSW";
import { StarshipsService } from "../service/StarshipsService";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";
import Base, { BaseState } from "./Base";

interface State extends BaseState {
  data: IStarship[];
  originalData: IStarship[];
  pickerSelectedValue: string;
  pickerData: string[];
}

export default class People extends Base<State> {
  protected detailsService: StarshipsService;

  constructor(props) {
    super(props);
    this.detailsService = new StarshipsService(props.route.params.dataService);

    this.state = {
      data: [],
      originalData: [],
      isLoading: true,
      search: "",
      pickerSelectedValue: "all",
      pickerData: [],
    };
  }

  protected async getData() {
    try {
      const response: IDataSW<IStarship[]> =
        await this.detailsService.getStarship();
      this.setState(
        {
          originalData: response.results,
        },
        () => this.getNextPage(response)
      );
      this.filterDetails();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getNextPage = async (previousResponse: IDataSW<IStarship[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IStarship[]> =
          await this.detailsService.getMore(previousResponse.next);
        const combinedResults = [...this.state.data, ...response.results];
        this.setState(
          {
            originalData: combinedResults,
            pickerData: [
              ...new Set(
                combinedResults.map((item) => item.starship_class.toLowerCase())
              ),
            ],
          },
          () => this.getNextPage(response)
        );
        this.filterDetails();
      } catch (error) {
        console.log(error);
      }
    }
  };

  protected searchDetail = async () => {
    try {
      const response: IDataSW<IStarship[]> =
        await this.detailsService.searchStarship(this.state.search);
      this.setState({ data: response.results });
    } catch (error) {
      console.log(error);
    }
  };

  private onSetPickerSelectedValue = (pickerSelectedValue) => {
    this.setState({ pickerSelectedValue }, this.filterDetails);
  };

  protected filterDetails = () => {
    if (this.state.pickerSelectedValue !== "all") {
      let filteredData = this.state.originalData.filter(
        (filterItem) =>
          filterItem.starship_class.toLowerCase() ===
          this.state.pickerSelectedValue
      );
      this.setState({ data: filteredData });
    } else {
      this.setState({ data: this.state.originalData });
    }
  };

  protected renderItemContent = (item) => {
    return [
      [
        "Cost in credits",
        !isNaN(Number(item.cost_in_credits))
          ? Number(item.cost_in_credits).toLocaleString()
          : item.cost_in_credits,
      ],
      ["Length", Number(item.length.replace(".", "")).toLocaleString()],
      ["Crew", item.crew.replace(",", " ")],
    ];
  };

  protected renderCustomFilters() {
    return (
      <>
        <SearchInput
          placeholderText={"name or model"}
          onSearchInput={this.onSearchDetail}
          searchItem={this.searchDetail}
        />
        <Dropdown
          pickerData={["all", ...this.state.pickerData]}
          pickerSelectedValue={this.state.pickerSelectedValue}
          onSetPickerSelectedValue={this.onSetPickerSelectedValue}
        />
      </>
    );
  }
}
