import React from "react";
import { IPerson } from "../model/IPerson";
import { IDataSW } from "../model/IDataSW";
import { PeopleService } from "../service/PeopleService";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";
import Base, { BaseState } from "./Base";

interface State extends BaseState {
  data: IPerson[];
  originalData: IPerson[];
  pickerSelectedValue: string;
  pickerData: string[];
}

export default class People extends Base<State> {
  protected detailsService: PeopleService;

  constructor(props) {
    super(props);
    this.detailsService = new PeopleService(props.route.params.dataService);

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
      const response: IDataSW<IPerson[]> =
        await this.detailsService.getPeople();
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

  protected getNextPage = async (previousResponse: IDataSW<IPerson[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IPerson[]> = await this.detailsService.getMore(
          previousResponse.next
        );
        const combinedResults = [...this.state.data, ...response.results];
        this.setState(
          {
            originalData: combinedResults,
            pickerData: [
              ...new Set(combinedResults.map((item) => item.gender)),
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
      const response: IDataSW<IPerson[]> =
        await this.detailsService.searchPeople(this.state.search);
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
        (filterItem) => filterItem.gender === this.state.pickerSelectedValue
      );
      this.setState({ data: filteredData });
    } else {
      this.setState({ data: this.state.originalData });
    }
  };

  protected renderItemContent = (item) => {
    return [
      ["Gender", item.gender],
      ["Birth year", item.birth_year],
      ["Height", item.height + " cm"],
    ];
  };

  protected renderCustomFilters() {
    return (
      <>
        <SearchInput
          placeholderText={"name"}
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
