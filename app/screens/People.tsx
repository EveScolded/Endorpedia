import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import { IPerson } from "../model/IPerson";
import { IDataSW } from "../model/IDataSW";
import { PeopleService } from "../service/PeopleService";
import colors from "../config/colors";
import Card from "../UI/Card";
import { NavigationProp } from "@react-navigation/native";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";

interface State {
  data: IPerson[];
  originalData: IPerson[];
  isLoading: boolean;
  search: string;
  pickerSelectedValue: string;
  pickerData: string[];
}

interface IPeopleProps {
  navigation: NavigationProp<any>;
}
export default class People extends Component<IPeopleProps, State> {
  private peopleService: PeopleService;

  constructor(props) {
    super(props);
    this.peopleService = new PeopleService(props.route.params.dataService);

    this.state = {
      data: [],
      originalData: [],
      isLoading: true,
      search: "",
      pickerSelectedValue: "all",
      pickerData: [],
    };
  }

  private async getPeople() {
    try {
      const response: IDataSW<IPerson[]> = await this.peopleService.getPeople();
      this.setState(
        {
          originalData: response.results,
        },
        () => this.getNextPage(response)
      );
      this.filterPeople(this.state.pickerSelectedValue);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getNextPage = async (previousResponse: IDataSW<IPerson[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IPerson[]> = await this.peopleService.getMore(
          previousResponse.next
        );
        const combinedResults = [...this.state.data, ...response.results];
        this.setState(
          {
            originalData: combinedResults,
            pickerData: [
              ...new Set(combinedResults.map((item) => item.gender)),
            ],
          },
          () => this.getNextPage(response)
        );
        this.filterPeople(this.state.pickerSelectedValue);
      } catch (error) {
        console.log(error);
      }
    }
  };

  private searchPeople = async () => {
    try {
      const response: IDataSW<IPerson[]> =
        await this.peopleService.searchPeople(this.state.search);
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
    this.filterPeople(pickerSelectedValue);
  };

  private filterPeople = (selectedOption) => {
    if (selectedOption !== "all") {
      let filteredData = this.state.originalData.filter(
        (person) => person.gender === selectedOption
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
        propertyOne={["Gender", item.gender]}
        propertyTwo={["Birth year", item.birth_year]}
        propertyThree={["Height", item.height + " cm"]}
        onClick={() => this.goToDetails(item)}
      ></Card>
    );
  };

  componentDidMount() {
    this.getPeople();
  }

  render() {
    const { data, isLoading } = this.state;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={this.onSearchPerson}
          searchItem={this.searchPeople}
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
