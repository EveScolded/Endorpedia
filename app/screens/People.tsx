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
import { Person } from "../model/person";
import { DataSW } from "../model/data";
import { CacheService } from "../service/CacheService";
import { SwapiService } from "../service/SwapiService";
import { PeopleService } from "../service/PeopleService";

interface State {
  data: Person[];
  isLoading: boolean;
  nextURL: string;
  search: string;
}

export default class People extends Component<{}, State> {
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
      const response: DataSW<Person> = await this.peopleService.getPeople();
      this.setState({ data: response.results, nextURL: response.next });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getMore = async () => {
    try {
      const response: DataSW<Person> = await this.peopleService.getMore(
        this.state.nextURL
      );
      const combinedResults = [...this.state.data, ...response.results];
      this.setState({ data: combinedResults, nextURL: response.next });
    } catch (error) {
      console.log(error);
    }
  };

  private getPerson = async () => {
    try {
      const response: DataSW<Person> = await this.peopleService.searchPeople(
        this.state.search
      );
      this.setState({ data: response.results });
    } catch (error) {
      console.log(error);
    }
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
          <TouchableHighlight onPress={this.getPerson}>
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
              <View style={styles.itemsList}>
                <Text style={styles.item}>{item.name}</Text>
                <Text style={styles.item}>Gender: {item.gender}</Text>
                <Text style={styles.item}>Birth year: {item.birth_year}</Text>
                <Text style={styles.item}>Height: {item.height} cm</Text>
              </View>
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
    backgroundColor: "gray",
    width: 200,
    height: 50,
    margin: 6,
    padding: 15,
    fontWeight: "bold",
    color: "#fff",
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
    backgroundColor: "#000000",
    color: "#fff",
    alignItems: "center",
  },
  itemsList: {
    textAlign: "center",
    borderColor: "#fff",
    borderWidth: 1,
    width: "45%",
    height: 100,
    margin: 6,
    padding: 15,
  },
  item: {
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 40,
    padding: 10,
    backgroundColor: "#FFE81F",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
