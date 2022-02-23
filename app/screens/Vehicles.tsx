import React from "react";
import { IVehicle } from "../model/IVehicle";
import { IDataSW } from "../model/IDataSW";
import { VehiclesService } from "../service/VehiclesService";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";
import FilterSlider from "../UI/FilterSlider";
import Base, { BaseState } from "./Base";
import ResetFilterBtn from "../UI/ResetFiltersBtn";

interface State extends BaseState {
  data: IVehicle[];
  originalData: IVehicle[];
  pickerSelectedValue: string;
  pickerData: string[];
  sliderValue: number;
}
export default class Vehicles extends Base<State> {
  protected detailsService: VehiclesService;

  constructor(props) {
    super(props);
    this.detailsService = new VehiclesService(props.route.params.dataService);

    this.state = {
      data: [],
      originalData: [],
      isLoading: true,
      search: "",
      pickerSelectedValue: "all",
      pickerData: [],
      sliderValue: 0,
    };
  }

  protected async getData() {
    try {
      const response: IDataSW<IVehicle[]> =
        await this.detailsService.getVehicles();
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

  protected getNextPage = async (previousResponse: IDataSW<IVehicle[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IVehicle[]> = await this.detailsService.getMore(
          previousResponse.next
        );
        const combinedResults = [...this.state.data, ...response.results];
        this.setState(
          {
            originalData: combinedResults,
            pickerData: [
              ...new Set(
                combinedResults.map((item) => item.vehicle_class.toLowerCase())
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
      const response: IDataSW<IVehicle[]> =
        await this.detailsService.searchVehicle(this.state.search);
      this.setState({ data: response.results });
    } catch (error) {
      console.log(error);
    }
  };

  private onSetPickerSelectedValue = (pickerSelectedValue) => {
    this.setState({ pickerSelectedValue }, this.filterDetails);
  };

  protected filterDetails = () => {
    let filteredData = this.state.originalData;
    if (this.state.pickerSelectedValue !== "all") {
      filteredData = filteredData.filter(
        (filterItem) =>
          filterItem.vehicle_class.toLowerCase() ===
          this.state.pickerSelectedValue
      );
    }
    filteredData = filteredData.filter((item) => {
      if (item.cost_in_credits === "unknown" && this.state.sliderValue === 0)
        return item;
      if (
        Number(item.cost_in_credits.replace(",", "")) >= this.state.sliderValue
      ) {
        return item;
      }
    });
    this.setState({ data: filteredData });
  };

  private onSliderValueChange = (value: number) => {
    this.setState({ sliderValue: value[0] }, this.filterDetails);
  };

  private getCosts(data: IVehicle[]): number[] {
    const costs: number[] = data.reduce((filtered, starship) => {
      const cost = Number(starship.cost_in_credits);
      if (!isNaN(cost)) {
        filtered.push(cost);
      }
      return filtered;
    }, []);
    return costs;
  }

  private maxCost = () => {
    const costs: number[] = this.getCosts(this.state.data);
    const maxCost = costs.length > 0 ? Math.max(...costs) : 100;
    return maxCost;
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

  private resetFilters = () => {
    this.setState({
      data: this.state.originalData,
      search: "",
      pickerSelectedValue: "all",
      sliderValue: 0,
    });
  };

  protected renderCustomFilters() {
    return (
      <>
        <ResetFilterBtn onResetFilters={this.resetFilters} />
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
        <FilterSlider
          thumbTitle={"Cost in credits"}
          sliderValue={this.state.sliderValue}
          max={this.maxCost()}
          min={0}
          onValueChange={this.onSliderValueChange}
        />
      </>
    );
  }
}
