import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import { IStarship } from "../model/IStarship";
import { IDataSW } from "../model/IDataSW";
import { StarshipsService } from "../service/StarshipsService";
import colors from "../config/colors";
import Card from "../UI/Card";
import { NavigationProp } from "@react-navigation/native";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";

interface State {
  data: IStarship[];
  originalData: IStarship[];
  isLoading: boolean;
  search: string;
  pickerSelectedValue: string;
  pickerData: string[];
}

interface IStarshipProps {
  navigation: NavigationProp<any>;
}
export default class People extends Component<IStarshipProps, State> {
  private starshipsService: StarshipsService;

  constructor(props) {
    super(props);
    this.starshipsService = new StarshipsService(
      props.route.params.dataService
    );

    this.state = {
      data: [],
      originalData: [],
      isLoading: true,
      search: "",
      pickerSelectedValue: "all",
      pickerData: [],
    };
  }

  private async getStarship() {
    try {
      const response: IDataSW<IStarship[]> =
        await this.starshipsService.getStarship();
      this.setState(
        {
          originalData: response.results,
        },
        () => this.getNextPage(response)
      );
      this.filterStarship();
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
          await this.starshipsService.getMore(previousResponse.next);
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
        this.filterStarship();
      } catch (error) {
        console.log(error);
      }
    }
  };

  private searchStarship = async () => {
    try {
      const response: IDataSW<IStarship[]> =
        await this.starshipsService.searchStarship(this.state.search);
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

  private onSearchStarship = (search) => {
    this.setState({ search });
  };

  private onSetPickerSelectedValue = (pickerSelectedValue) => {
    this.setState({ pickerSelectedValue }, this.filterStarship);
  };

  private filterStarship = () => {
    if (this.state.pickerSelectedValue !== "all") {
      let filteredData = this.state.originalData.filter(
        (item) =>
          item.starship_class.toLowerCase() === this.state.pickerSelectedValue
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
    this.getStarship();
  }

  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name or model"}
          onSearchInput={this.onSearchStarship}
          searchItem={this.searchStarship}
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
