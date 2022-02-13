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

interface State {
  data: IVehicle[];
  originalData: IVehicle[];
  isLoading: boolean;
  search: string;
  pickerSelectedValue: string;
  pickerData: string[];
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
      this.filterVehicles(this.state.pickerSelectedValue);
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
        this.filterVehicles(this.state.pickerSelectedValue);
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
    this.setState({ pickerSelectedValue });
    this.filterVehicles(pickerSelectedValue);
  };

  private filterVehicles = (selectedOption) => {
    if (selectedOption !== "all") {
      let filteredData = this.state.originalData.filter(
        (person) => person.vehicle_class === selectedOption
      );
      this.setState({ data: filteredData });
    } else {
      this.setState({ data: this.state.originalData });
    }
  };

  componentDidMount() {
    this.getVehicles();
  }

  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={(search) => this.onSearchVehicle(search)}
          searchItem={this.searchVehicle}
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
            data={data.sort(
              (a, b) => Number(b.cost_in_credits) - Number(a.cost_in_credits)
            )}
            keyExtractor={(item) => item.url}
            extraData={data}
            renderItem={({ item }) => (
              <Card
                itemName={item.name}
                propertyOne={["Cost in credits", item.cost_in_credits]}
                propertyTwo={["Length", item.length]}
                propertyThree={["Crew", item.crew]}
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
