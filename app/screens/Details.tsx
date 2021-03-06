import { RouteProp } from "@react-navigation/native";
import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import colors from "../config/colors";
import { IDetails } from "../model/IDetails";
import { CacheService } from "../service/CacheService";
import { IDataService } from "../service/IDataService";
import { SwapiService } from "../service/SwapiService";
import Icon from "react-native-vector-icons/FontAwesome";

interface IDetailsProps {
  route: RouteProp<any>;
  navigation: any;
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
      return (
        <Text
          style={styles.detailValue}
          onPress={() =>
            this.props.navigation.push("Details", {
              details: response,
            })
          }
        >
          <Text>
            {(response.name ? response.name : response.title) + "   "}
          </Text>
          <Icon style={{ fontSize: 16 }} name={"arrow-circle-right"}></Icon>
        </Text>
      );
    } catch (error) {
      console.log(error);
    }
  };

  private renderMultilineProperty = (array) => {
    return array.length > 0 ? (
      <FlatList
        data={array}
        keyExtractor={(_arrayItem, index) => index.toString()}
        renderItem={({ item }) => <View>{item}</View>}
      />
    ) : (
      <Text style={styles.detailValue}>{"n/a"}</Text>
    );
  };

  private renderDetail = (propName: string) => {
    const header =
      propName[0].toUpperCase() + propName.slice(1).replaceAll("_", " ");
    if (propName.toLowerCase() === "url") return <></>;

    return (
      <View style={styles.details}>
        <Text style={styles.detailName}>{header}:</Text>
        {Array.isArray(this.state.newDetails[propName]) ? (
          this.renderMultilineProperty(this.state.newDetails[propName])
        ) : (
          <Text style={styles.detailValue}>
            {this.state.newDetails[propName]}
          </Text>
        )}
      </View>
    );
  };

  public async componentDidMount(): Promise<void> {
    const { details } = this.props.route.params;
    const newDetails = { ...details };

    await Promise.all(
      Object.keys(details).map(async (key) => {
        if (
          details[key].toString().includes("https") &&
          !Array.isArray(details[key])
        ) {
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

  public render() {
    return (
      <View style={styles.detailsContainer}>
        <FlatList
          data={Object.keys(this.state.newDetails)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => this.renderDetail(item)}
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
