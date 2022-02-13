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
import FilterSlider from "../UI/FilterSlider";

interface State {
  data: IStarship[];
  originalData: IStarship[];
  isLoading: boolean;
  search: string;
  pickerSelectedValue: string;
  pickerData: string[];
  sliderValue: number;
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
      sliderValue: 20,
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
    let filteredData = this.state.originalData;
    if (this.state.pickerSelectedValue !== "all") {
      filteredData = filteredData.filter(
        (item) =>
          item.starship_class.toLowerCase() === this.state.pickerSelectedValue
      );
    }
    filteredData = filteredData.filter((item) => {
      if (item.length === "unknown") return item;
      if (Number(item.length.replace(",", "")) >= this.state.sliderValue) {
        return item;
      }
    });
    this.setState({ data: filteredData });
  };

  private onSliderValueChange = (value: number) => {
    this.setState({ sliderValue: value[0] }, this.filterStarship);
  };

  componentDidMount() {
    this.getStarship();
  }

  private getLengths(data: IStarship[]): number[] {
    const lengths: number[] = data.reduce((filtered, vehicle) => {
      const length = Number(vehicle.length);
      if (!isNaN(length)) {
        filtered.push(length);
      }
      return filtered;
    }, []);
    return lengths;
  }

  render() {
    const { data, isLoading } = this.state;
    const lenghts: number[] = this.getLengths(data);
    const maxLength = lenghts.length > 0 ? Math.max(...lenghts) : 100;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={(search) => this.onSearchStarship(search)}
          searchItem={this.searchStarship}
        />
        <Dropdown
          pickerData={["all", ...this.state.pickerData]}
          pickerSelectedValue={this.state.pickerSelectedValue}
          onSetPickerSelectedValue={this.onSetPickerSelectedValue}
        />
        <FilterSlider
          sliderValue={this.state.sliderValue}
          max={maxLength}
          min={0}
          onValueChange={(value) => this.onSliderValueChange(value)}
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
            renderItem={({ item }) => (
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
