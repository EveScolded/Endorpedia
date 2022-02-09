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
import { CacheService } from "../service/CacheService";
import { SwapiService } from "../service/SwapiService";
import { PeopleService } from "../service/PeopleService";
import colors from "../config/colors";
import Card from "../UI/Card";

interface State {
  data: IPerson[];
  isLoading: boolean;
  nextURL: string;
  search: string;
}

interface IPeopleProps {
  navigation: any;
}
export default class People extends Component<IPeopleProps, State> {
  private peopleService: PeopleService;

  constructor(props) {
    super(props);
    this.peopleService = new PeopleService(
      new CacheService(new SwapiService())
    );

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

  componentDidMount() {
    this.getPeople();
  }

  render() {
    const { data, isLoading, nextURL } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="name"
            style={styles.inputStyle}
            onChangeText={(search) => this.setState({ search })}
          />
          <TouchableHighlight onPress={this.searchPeople}>
            <Image
              style={styles.imageStyle}
              source={require("../assets/searchIcon.png")}
            />
          </TouchableHighlight>
        </View>

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
                item={item}
                itemName={item.name}
                propertyOneName={"Gender"}
                propertyOneValue={item.gender}
                propertyTwoName={"Birth year"}
                propertyTwoValue={item.birth_year}
                propertyThreeName={"Height"}
                propertyThreeValue={item.height}
                onClick={this.goToDetails}
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
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    backgroundColor: colors.searchWindow,
    width: 200,
    height: 50,
    margin: 6,
    padding: 15,
    fontWeight: "bold",
  },
  inputStyle: { flex: 1 },
  imageStyle: {
    margin: 3,
    height: 15,
    width: 15,
    resizeMode: "stretch",
    alignItems: "center",
  },
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
