import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  TouchableHighlight,
} from "react-native";
import { IPerson } from "../model/IPerson";
import { IDataSW } from "../model/IDataSW";
import { PeopleService } from "../service/PeopleService";
import colors from "../config/colors";
import Card from "../UI/Card";
import { NavigationProp } from "@react-navigation/native";
import SearchInput from "../UI/SearchInput";

interface State {
  data: IPerson[];
  isLoading: boolean;
  nextURL: string;
  search: string;
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
      isLoading: true,
      nextURL: "",
      search: "",
    };
  }

  private async getPeople() {
    try {
      const response: IDataSW<IPerson[]> = await this.peopleService.getPeople();
      this.setState({ data: response.results, nextURL: response.next });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getMore = async () => {
    try {
      const response: IDataSW<IPerson[]> = await this.peopleService.getMore(
        this.state.nextURL
      );
      const combinedResults = [...this.state.data, ...response.results];
      this.setState({ data: combinedResults, nextURL: response.next });
    } catch (error) {
      console.log(error);
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

  componentDidMount() {
    this.getPeople();
  }

  render() {
    const { data, isLoading, nextURL } = this.state;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={(search) => this.onSearchPerson(search)}
          searchPeople={this.searchPeople}
        />

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
            data={data}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <Card
                itemName={item.name}
                propertyOne={["Gender", item.gender]}
                propertyTwo={["Birth year", item.birth_year]}
                propertyThree={["Height", item.height + " cm"]}
                onClick={() => this.goToDetails(item)}
              ></Card>
            )}
          />
        )}
        {nextURL ? (
          <TouchableOpacity style={styles.button} onPress={this.getMore}>
            <Text style={styles.buttonText}>More</Text>
          </TouchableOpacity>
        ) : null}
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
  button: {
    width: "100%",
    height: 40,
    padding: 10,
    backgroundColor: colors.mainBanana,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
