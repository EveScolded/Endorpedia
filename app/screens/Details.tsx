import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import colors from "../config/colors";
import { IDataSW } from "../model/IDataSW";
import { IDetails } from "../model/IDetails";
import { IFilm } from "../model/IFilm";
import { CacheService } from "../service/CacheService";
import { IDataService } from "../service/IDataService";
import { SwapiService } from "../service/SwapiService";

interface IDetailsProps {
  route: any;
}

interface State {
  newDetails: IDetails;
}

export default class Details extends Component<IDetailsProps, State> {
  private dataService: IDataService;

  constructor(props) {
    super(props);
    this.dataService = new SwapiService();

    this.state = {
      newDetails: {},
    };
  }

  private getDetail = async (url) => {
    try {
      const response = await this.dataService.getData(url);
      return response.name ? response.name : response.title;
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidMount(): Promise<void> {
    const { details } = this.props.route.params;
    const newDetails = { ...details };

    await Promise.all(
      Object.keys(details).map(async (key) => {
        if (details[key].includes("https") && !Array.isArray(details[key])) {
          newDetails[key] = await this.getDetail(details[key]);
        }
        if (Array.isArray(details[key])) {
          await Promise.all(
            details[key].map(
              async (arrayItem, index) =>
                (newDetails[key][index] = await this.getDetail(arrayItem))
            )
          );
        }
      })
    );
    this.setState({ newDetails: newDetails });
  }

  render() {
    return (
      <FlatList
        data={Object.keys(this.state.newDetails)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.details}>
            <Text style={styles.detail}>
              {item[0].toUpperCase() + item.slice(1).replace("_", " ")}:{" "}
              {this.state.newDetails[item]}
            </Text>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  details: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.mainBackground,
    justifyContent: "space-evenly",
  },
  detail: {
    color: colors.textBlue,
    lineHeight: 20,
  },
});
