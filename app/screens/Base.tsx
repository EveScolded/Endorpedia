import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import colors from "../config/colors";
import Card from "../UI/Card";
import { NavigationProp } from "@react-navigation/native";
import SearchInput from "../UI/SearchInput";

export interface BaseState {
  data: any[];
  originalData: any[];
  isLoading: boolean;
  search: string;
}

interface BaseStateProps {
  navigation: NavigationProp<any>;
}
export default abstract class Base<T extends BaseState> extends Component<
  BaseStateProps,
  T
> {
  protected abstract detailsService;

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      data: [],
      originalData: [],
      isLoading: true,
      search: "",
    };
  }

  protected abstract getData(): Promise<void>;

  protected abstract searchDetail(): Promise<void>;

  private goToDetails = (clickedItem) => {
    this.props.navigation.navigate("Details", {
      details: clickedItem,
    });
  };

  private onSearchDetail = (search) => {
    this.setState({ search });
  };

  protected abstract renderItemContent(item: any): string[][];

  private renderCard = (item) => {
    return (
      <Card
        itemName={item.name}
        properties={this.renderItemContent(item)}
        onClick={() => this.goToDetails(item)}
      ></Card>
    );
  };

  protected renderCustomFilters() {
    return null;
  }

  public componentDidMount() {
    this.getData();
  }

  public render() {
    const { data, isLoading } = this.state;

    return (
      <View style={styles.container}>
        <SearchInput
          placeholderText={"name"}
          onSearchInput={this.onSearchDetail}
          searchItem={this.searchDetail}
        />
        {this.renderCustomFilters()}
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
