import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import { IVehicle } from "../model/IVehicle";
import { IDataSW } from "../model/IDataSW";
import { VehiclesService } from "../service/VehiclesService";
import colors from "../config/colors";
import Card from "../UI/Card";
import { NavigationProp } from "@react-navigation/native";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";
import FilterSlider from "../UI/FilterSlider";

interface State {
  data: IVehicle[];
  originalData: IVehicle[];
  isLoading: boolean;
  search: string;
  pickerSelectedValue: string;
  pickerData: string[];
  sliderValue: number;
}

interface IVehiclesProps {
  navigation: NavigationProp<any>;
}
export default class Vehicles extends Component<IVehiclesProps, State> {
  private vehiclesService: VehiclesService;

  constructor(props) {
    super(props);
    this.vehiclesService = new VehiclesService(props.route.params.dataService);

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

  private async getVehicles() {
    try {
      const response: IDataSW<IVehicle[]> =
        await this.vehiclesService.getVehicles();
      this.setState(
        {
          originalData: response.results,
        },
        () => this.getNextPage(response)
      );
      this.filterVehicles();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getNextPage = async (previousResponse: IDataSW<IVehicle[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IVehicle[]> =
          await this.vehiclesService.getMore(previousResponse.next);
        const combinedResults = [...this.state.data, ...response.results];
        this.setState(
          {
            originalData: combinedResults,
            pickerData: [
              ...new Set(combinedResults.map((item) => item.vehicle_class)),
            ],
          },
          () => this.getNextPage(response)
        );
        this.filterVehicles();
      } catch (error) {
        console.log(error);
      }
    }
  };

  private searchVehicle = async () => {
    try {
      const response: IDataSW<IVehicle[]> =
        await this.vehiclesService.searchVehicle(this.state.search);
      this.setState({ data: response.results });
    } catch (error) {
      console.log(error);
    }
  };

  private goToDetails = (clickedItem) => {
    this.props.navigation.navigate("Details", {
      details: clickedItem,
    });
  };

  private onSearchVehicle = (search) => {
    this.setState({ search });
  };

  private onSetPickerSelectedValue = (pickerSelectedValue) => {
    this.setState({ pickerSelectedValue }, this.filterVehicles);
  };

  private filterVehicles = () => {
    let filteredData = this.state.originalData;
    if (this.state.pickerSelectedValue !== "all") {
      filteredData = filteredData.filter(
        (item) =>
          item.vehicle_class.toLowerCase() === this.state.pickerSelectedValue
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
    this.setState({ sliderValue: value[0] }, this.filterVehicles);
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

  private renderCard = (item) => {
    return (
      <Card
        itemName={item.name}
        propertyOne={[
          "Cost in credits",
          !isNaN(Number(item.cost_in_credits))
            ? Number(item.cost_in_credits).toLocaleString()
            : item.cost_in_credits,
        ]}
        propertyTwo={[
          "Length",
          Number(item.length.replace(".", "")).toLocaleString(),
        ]}
        propertyThree={["Crew", item.crew.replace(",", " ")]}
        onClick={() => this.goToDetails(item)}
      ></Card>
    );
  };

  componentDidMount() {
    this.getVehicles();
  }

  render() {
    const { data, isLoading } = this.state;
    const costs: number[] = this.getCosts(data);
    const maxCost = costs.length > 0 ? Math.max(...costs) : 100;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name or model"}
          onSearchInput={this.onSearchVehicle}
          searchItem={this.searchVehicle}
        />
        <Dropdown
          pickerData={["all", ...this.state.pickerData]}
          pickerSelectedValue={this.state.pickerSelectedValue}
          onSetPickerSelectedValue={this.onSetPickerSelectedValue}
        />
        <FilterSlider
          thumbTitle={"Cost in credits"}
          sliderValue={this.state.sliderValue}
          max={maxCost}
          min={0}
          onValueChange={this.onSliderValueChange}
        />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
            data={data}
            keyExtractor={(item) => item.url}
            extraData={data}
            renderItem={({ item }) => this.renderCard(item)}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: colors.mainBackground,
    alignItems: "center",
  },
});
