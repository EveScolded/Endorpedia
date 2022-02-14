import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import { ISpecies } from "../model/ISpecies";
import { IDataSW } from "../model/IDataSW";
import { SpeciesService } from "../service/SpeciesService";
import colors from "../config/colors";
import Card from "../UI/Card";
import { NavigationProp } from "@react-navigation/native";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";

interface State {
  data: ISpecies[];
  originalData: ISpecies[];
  isLoading: boolean;
  search: string;
  pickerSelectedValue: string;
  pickerData: string[];
}

interface ISpeciesProps {
  navigation: NavigationProp<any>;
}
export default class Species extends Component<ISpeciesProps, State> {
  private speciesService: SpeciesService;

  constructor(props) {
    super(props);
    this.speciesService = new SpeciesService(props.route.params.dataService);

    this.state = {
      data: [],
      originalData: [],
      isLoading: true,
      search: "",
      pickerSelectedValue: "all",
      pickerData: [],
    };
  }

  private async getSpecies() {
    try {
      const response: IDataSW<ISpecies[]> =
        await this.speciesService.getSpecies();
      this.setState(
        {
          originalData: response.results,
        },
        () => this.getNextPage(response)
      );
      this.filterSpecies(this.state.pickerSelectedValue);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getNextPage = async (previousResponse: IDataSW<ISpecies[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<ISpecies[]> = await this.speciesService.getMore(
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
        this.filterSpecies(this.state.pickerSelectedValue);
      } catch (error) {
        console.log(error);
      }
    }
  };

  private searchSpecies = async () => {
    try {
      const response: IDataSW<ISpecies[]> =
        await this.speciesService.searchSpecies(this.state.search);
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

  private onSearchPerson = (search) => {
    this.setState({ search });
  };

  private onSetPickerSelectedValue = (pickerSelectedValue) => {
    this.setState({ pickerSelectedValue });
    this.filterSpecies(pickerSelectedValue);
  };

  private filterSpecies = (selectedOption) => {
    if (selectedOption !== "all") {
      let filteredData = this.state.originalData.filter(
        (item) => item.classification === selectedOption
      );
      this.setState({ data: filteredData });
    } else {
      this.setState({ data: this.state.originalData });
    }
  };

  private renderCard = (item) => {
    return (
      <Card
        itemName={item.name}
        propertyOne={["Classification", item.classification]}
        propertyTwo={["Average height", item.average_height]}
        propertyThree={["Average lifespan", item.average_lifespan]}
        onClick={() => this.goToDetails(item)}
      ></Card>
    );
  };

  public componentDidMount() {
    this.getSpecies();
  }

  public render() {
    const { data, isLoading } = this.state;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={this.onSearchPerson}
          searchItem={this.searchSpecies}
        />
        <Dropdown
          pickerData={["all", ...this.state.pickerData]}
          pickerSelectedValue={this.state.pickerSelectedValue}
          onSetPickerSelectedValue={this.onSetPickerSelectedValue}
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
