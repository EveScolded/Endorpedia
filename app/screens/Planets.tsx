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

interface State {
  data: IPlanet[];
  originalData: IPlanet[];
  isLoading: boolean;
  search: string;
  pickerSelectedValue: string;
  pickerData: string[];
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
      this.filterPlanets(this.state.pickerSelectedValue);
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
        this.filterPlanets(this.state.pickerSelectedValue);
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
    this.setState({ pickerSelectedValue });
    this.filterPlanets(pickerSelectedValue);
  };

  private filterPlanets = (selectedOption) => {
    if (selectedOption !== "all") {
      let filteredData = this.state.originalData.filter(
        (person) => person.climate === selectedOption
      );
      this.setState({ data: filteredData });
    } else {
      this.setState({ data: this.state.originalData });
    }
  };

  componentDidMount() {
    this.getPlanets();
  }

  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={(search) => this.onSearchPlanet(search)}
          searchItem={this.searchPlanet}
        />
        <Dropdown
          pickerData={["all", ...this.state.pickerData]}
          pickerSelectedValue={this.state.pickerSelectedValue}
          onSetPickerSelectedValue={(pickerSelectedValue) =>
            this.onSetPickerSelectedValue(pickerSelectedValue)
          }
        />
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
            data={data.sort((a, b) => Number(b.diameter) - Number(a.diameter))}
            keyExtractor={(item) => item.url}
            extraData={data}
            renderItem={({ item }) => (
              <Card
                itemName={item.name}
                propertyOne={["Diameter", item.diameter]}
                propertyTwo={["Rotation period", item.rotation_period]}
                propertyThree={["Orbital period", item.orbital_period]}
                onClick={() => this.goToDetails(item)}
              ></Card>
            )}
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
