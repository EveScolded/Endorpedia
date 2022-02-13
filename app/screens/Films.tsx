import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import { IFilm } from "../model/IFilm";
import { IDataSW } from "../model/IDataSW";
import { FilmsService } from "../service/FilmsService";
import colors from "../config/colors";
import Card from "../UI/Card";
import { NavigationProp } from "@react-navigation/native";

interface State {
  originalData: IFilm[];
  isLoading: boolean;
}

interface IFilmsProps {
  navigation: NavigationProp<any>;
}
export default class Films extends Component<IFilmsProps, State> {
  private filmsService: FilmsService;

  constructor(props) {
    super(props);
    this.filmsService = new FilmsService(props.route.params.dataService);

    this.state = {
      originalData: [],
      isLoading: true,
    };
  }

  private async getFilms() {
    try {
      const response: IDataSW<IFilm[]> = await this.filmsService.getFilms();
      this.setState(
        {
          originalData: response.results,
        },
        () => this.getNextPage(response)
      );
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private getNextPage = async (previousResponse: IDataSW<IFilm[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IFilm[]> = await this.filmsService.getMore(
          previousResponse.next
        );
        const combinedResults = [
          ...this.state.originalData,
          ...response.results,
        ];
        this.setState({ originalData: combinedResults }, () =>
          this.getNextPage(response)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  private goToDetails = (clickedItem) => {
    this.props.navigation.navigate("Details", {
      details: clickedItem,
    });
  };

  componentDidMount() {
    this.getFilms();
  }

  private romans = [0, "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

  render() {
    const { originalData, isLoading } = this.state;

    return (
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={originalData.sort((a, b) => a.episode_id - b.episode_id)}
            keyExtractor={(item) => item.url}
            extraData={originalData}
            renderItem={({ item }) => (
              <Card
                itemName={item.title}
                propertyOne={[
                  "Episode",
                  this.romans[item.episode_id].toLocaleString(),
                ]}
                propertyTwo={["Director", item.director]}
                propertyThree={["Release date", item.release_date]}
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
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
