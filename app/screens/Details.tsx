import { RouteProp } from "@react-navigation/native";
import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import colors from "../config/colors";
import { IDetails } from "../model/IDetails";
import { CacheService } from "../service/CacheService";
import { IDataService } from "../service/IDataService";
import { SwapiService } from "../service/SwapiService";

interface IDetailsProps {
  route: RouteProp<any>;
}

interface State {
  newDetails: IDetails;
}

export default class Details extends Component<IDetailsProps, State> {
  private dataService: IDataService;

  constructor(props) {
    super(props);
    this.dataService = new CacheService(new SwapiService());

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
      <View style={styles.detailsContainer}>
        <FlatList
          data={Object.keys(this.state.newDetails)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.details}>
              <Text style={styles.detailName}>
                {item[0].toUpperCase() + item.slice(1).replace("_", " ")}:{" "}
              </Text>
              {Array.isArray(this.state.newDetails[item]) ? (
                this.state.newDetails[item].length > 0 ? (
                  <FlatList
                    data={this.state.newDetails[item]}
                    keyExtractor={(_arrayItem, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Text style={styles.detailValue}>{item}</Text>
                    )}
                  />
                ) : (
                  <Text style={styles.detailValue}>{"n/a"}</Text>
                )
              ) : (
                <Text style={styles.detailValue}>
                  {this.state.newDetails[item]}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: colors.mainBackground,
  },
  details: {
    flex: 1,
    padding: 10,
    paddingLeft: 25,
    borderBottomColor: "rgba(161, 161, 161, 0.4)",
    borderBottomWidth: 1,
  },
  detailName: {
    color: colors.textBlue,
    fontWeight: "bold",
    lineHeight: 20,
  },
  detailValue: {
    color: colors.textBlue,
    lineHeight: 20,
  },
});
