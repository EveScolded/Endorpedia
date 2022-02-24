import React from "react";
import { ISpecies } from "../model/ISpecies";
import { IDataSW } from "../model/IDataSW";
import { SpeciesService } from "../service/SpeciesService";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";
import Base, { BaseState } from "./Base";
import ResetFilterBtn from "../UI/ResetFiltersBtn";
import { View } from "react-native";

interface State extends BaseState {
  data: ISpecies[];
  originalData: ISpecies[];
  pickerSelectedValue: string;
  pickerData: string[];
}
export default class Species extends Base<State> {
  protected detailsService: SpeciesService;

  constructor(props) {
    super(props);
    this.detailsService = new SpeciesService(props.route.params.dataService);

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
      const response: IDataSW<ISpecies[]> =
        await this.detailsService.getSpecies();
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

  protected getNextPage = async (previousResponse: IDataSW<ISpecies[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<ISpecies[]> = await this.detailsService.getMore(
          previousResponse.next
        );
        const combinedResults = [...this.state.data, ...response.results];
        this.setState(
          {
            originalData: combinedResults,
            pickerData: [
              ...new Set(combinedResults.map((item) => item.classification)),
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
      const response: IDataSW<ISpecies[]> =
        await this.detailsService.searchSpecies(this.state.search);
      this.setState({ data: response.results });
    } catch (error) {
      console.log(error);
    }
  };

  protected onSetPickerSelectedValue = (pickerSelectedValue) => {
    this.setState({ pickerSelectedValue }, this.filterDetails);
  };

  protected filterDetails = () => {
    if (this.state.pickerSelectedValue !== "all") {
      let filteredData = this.state.originalData.filter(
        (filterItem) =>
          filterItem.classification === this.state.pickerSelectedValue
      );
      this.setState({ data: filteredData });
    } else {
      this.setState({ data: this.state.originalData });
    }
  };

  protected renderItemContent = (item) => {
    return [
      ["Classification", item.classification],
      ["Average height", item.average_height],
      ["Average lifespan", item.average_lifespan],
    ];
  };

  private resetFilters = () => {
    this.setState({
      data: this.state.originalData,
      search: "",
      pickerSelectedValue: "all",
    });
  };
  protected renderCustomFilters() {
    return (
      <>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={this.onSearchDetail}
          searchItem={this.searchDetail}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Dropdown
            pickerData={["all", ...this.state.pickerData]}
            pickerSelectedValue={this.state.pickerSelectedValue}
            onSetPickerSelectedValue={this.onSetPickerSelectedValue}
          />
          <ResetFilterBtn onResetFilters={this.resetFilters} />
        </View>
      </>
    );
  }
}
