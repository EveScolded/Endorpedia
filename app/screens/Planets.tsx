import React from "react";
import { IPlanet } from "../model/IPlanet";
import { IDataSW } from "../model/IDataSW";
import { PlanetsService } from "../service/PlanetsService";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";
import FilterSlider from "../UI/FilterSlider";
import Base, { BaseState } from "./Base";
import ResetFilterBtn from "../UI/ResetFiltersBtn";
import { View } from "react-native";

interface State extends BaseState {
  data: IPlanet[];
  originalData: IPlanet[];
  pickerSelectedValue: string;
  pickerData: string[];
  sliderValue: number;
}
export default class People extends Base<State> {
  protected detailsService: PlanetsService;

  constructor(props) {
    super(props);
    this.detailsService = new PlanetsService(props.route.params.dataService);

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
      const response: IDataSW<IPlanet[]> =
        await this.detailsService.getPlanets();
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

  protected getNextPage = async (previousResponse: IDataSW<IPlanet[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IPlanet[]> = await this.detailsService.getMore(
          previousResponse.next
        );
        const combinedResults = [...this.state.data, ...response.results];
        this.setState(
          {
            originalData: combinedResults,
            pickerData: [
              ...new Set(combinedResults.map((item) => item.climate)),
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
      const response: IDataSW<IPlanet[]> =
        await this.detailsService.searchPlanet(this.state.search);
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
          filterItem.climate.toLowerCase() === this.state.pickerSelectedValue
      );
    }
    filteredData = filteredData.filter((item) => {
      if (item.diameter === "unknown" && this.state.sliderValue === 0)
        return item;
      if (Number(item.diameter.replace(",", "")) >= this.state.sliderValue) {
        return item;
      }
    });
    this.setState({ data: filteredData });
  };

  private onSliderValueChange = (value: number) => {
    this.setState({ sliderValue: value[0] }, this.filterDetails);
  };

  private getDiameter(data: IPlanet[]): number[] {
    const diameters: number[] = data.reduce((filtered, planet) => {
      const diameter = Number(planet.diameter);
      if (!isNaN(diameter)) {
        filtered.push(diameter);
      }
      return filtered;
    }, []);
    return diameters;
  }

  private maxDiameter = () => {
    const diameter: number[] = this.getDiameter(this.state.data);
    const maxDiameter = diameter.length > 0 ? Math.max(...diameter) : 100;
    return maxDiameter;
  };

  protected renderItemContent = (item) => {
    return [
      [
        "Diameter",
        !isNaN(Number(item.diameter))
          ? Number(item.diameter).toLocaleString()
          : item.diameter,
      ],
      ["Rotation period", item.rotation_period],
      ["Orbital period", item.orbital_period],
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
        <SearchInput
          placeholderText={"name"}
          onSearchInput={this.onSearchDetail}
          searchItem={this.searchDetail}
        />

        <FilterSlider
          thumbTitle={"Diameter"}
          sliderValue={this.state.sliderValue}
          max={this.maxDiameter()}
          min={0}
          onValueChange={this.onSliderValueChange}
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
