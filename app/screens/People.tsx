import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
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

  componentDidMount() {
    this.getPeople();
  }

  render() {
    const { data, isLoading, nextURL } = this.state;

    return (
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.url}
            renderItem={({ item }) => (
              <Text style={styles.item}>{item.name}</Text>
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
    backgroundColor: "#000000",
    color: "#fff",
    alignItems: "center",
  },
  item: {
    textAlign: "center",
    borderColor: "#fff",
    borderWidth: 1,
    width: 200,
    height: 50,
    margin: 6,
    padding: 15,
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
