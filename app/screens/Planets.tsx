import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import { IPlanet } from "../model/IPlanet";
import { IDataSW } from "../model/IDataSW";
import { PlanetsService } from "../service/PlanetsService";
import colors from "../config/colors";
import Card from "../UI/Card";
import { NavigationProp } from "@react-navigation/native";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";
import FilterSlider from "../UI/FilterSlider";

interface State {
  data: IPlanet[];
  originalData: IPlanet[];
  isLoading: boolean;
  search: string;
  pickerSelectedValue: string;
  pickerData: string[];
  sliderValue: number;
}

interface IPlanetsProps {
  navigation: NavigationProp<any>;
}
export default class People extends Component<IPlanetsProps, State> {
  private planetsService: PlanetsService;

  constructor(props) {
    super(props);
    this.planetsService = new PlanetsService(props.route.params.dataService);

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

  private async getPlanets() {
    try {
      const response: IDataSW<IPlanet[]> =
        await this.planetsService.getPlanets();
      this.setState(
        {
          originalData: response.results,
        },
        () => this.getNextPage(response)
      );
      this.filterPlanets();
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getNextPage = async (previousResponse: IDataSW<IPlanet[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IPlanet[]> = await this.planetsService.getMore(
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
        this.filterPlanets();
      } catch (error) {
        console.log(error);
      }
    }
  };

  private searchPlanet = async () => {
    try {
      const response: IDataSW<IPlanet[]> =
        await this.planetsService.searchPlanet(this.state.search);
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

  private onSearchPlanet = (search) => {
    this.setState({ search });
  };

  private onSetPickerSelectedValue = (pickerSelectedValue) => {
    this.setState({ pickerSelectedValue }, this.filterPlanets);
  };

  private filterPlanets = () => {
    let filteredData = this.state.originalData;
    if (this.state.pickerSelectedValue !== "all") {
      filteredData = filteredData.filter(
        (item) => item.climate.toLowerCase() === this.state.pickerSelectedValue
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
    this.setState({ sliderValue: value[0] }, this.filterPlanets);
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

  private renderCard = (item) => {
    return (
      <Card
        itemName={item.name}
        propertyOne={[
          "Diameter",
          !isNaN(Number(item.diameter))
            ? Number(item.diameter).toLocaleString()
            : item.diameter,
        ]}
        propertyTwo={["Rotation period", item.rotation_period]}
        propertyThree={["Orbital period", item.orbital_period]}
        onClick={() => this.goToDetails(item)}
      ></Card>
    );
  };

  public componentDidMount() {
    this.getPlanets();
  }

  public render() {
    const { data, isLoading } = this.state;
    const diameter: number[] = this.getDiameter(data);
    const maxDiameter = diameter.length > 0 ? Math.max(...diameter) : 100;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={this.onSearchPlanet}
          searchItem={this.searchPlanet}
        />
        <Dropdown
          pickerData={["all", ...this.state.pickerData]}
          pickerSelectedValue={this.state.pickerSelectedValue}
          onSetPickerSelectedValue={this.onSetPickerSelectedValue}
        />
        <FilterSlider
          thumbTitle={"Diameter"}
          sliderValue={this.state.sliderValue}
          max={maxDiameter}
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
    backgroundColor: colors.mainBackground,
    alignItems: "center",
  },
});
