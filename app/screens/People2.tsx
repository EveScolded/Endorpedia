import React, { Component } from "react";
import { ActivityIndicator, FlatList, View, StyleSheet } from "react-native";
import { IPerson } from "../model/IPerson";
import { IDataSW } from "../model/IDataSW";
import { PeopleService } from "../service/PeopleService";
import colors from "../config/colors";
import Card from "../UI/Card";
import SearchInput from "../UI/SearchInput";
import Dropdown from "../UI/Dropdown";
import Base, { BaseState } from "./Base";

interface State extends BaseState {
  data: IPerson[];
  originalData: IPerson[];
  pickerSelectedValue: string;
  pickerData: string[];
}

export default class People extends Base<State> {
  protected detailsService: PeopleService;

  constructor(props) {
    super(props);
    this.detailsService = new PeopleService(props.route.params.dataService);

    this.state = {
      data: [],
      originalData: [],
      isLoading: true,
      search: "",
      pickerSelectedValue: "all",
      pickerData: [],
    };
  }

  protected async getData() {
    try {
      const response: IDataSW<IPerson[]> =
        await this.detailsService.getPeople();
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

  protected getNextPage = async (previousResponse: IDataSW<IPerson[]>) => {
    if (previousResponse.next) {
      try {
        const response: IDataSW<IPerson[]> = await this.detailsService.getMore(
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

  protected searchDetail = async () => {
    try {
      const response: IDataSW<IPerson[]> =
        await this.detailsService.searchPeople(this.state.search);
      this.setState({ data: response.results });
    } catch (error) {
      console.log(error);
    }
  };

  protected onSetPickerSelectedValue = (pickerSelectedValue) => {
    this.setState({ pickerSelectedValue });
    this.filterPeople(pickerSelectedValue);
  };

  protected filterPeople = (selectedOption) => {
    if (selectedOption !== "all") {
      let filteredData = this.state.originalData.filter(
        (person) => person.gender === selectedOption
      );
      this.setState({ data: filteredData });
    } else {
      this.setState({ data: this.state.originalData });
    }
  };

  protected renderItemContent = (item) => {
    return [
      ["Gender", item.gender],
      ["Birth year", item.birth_year],
      ["Height", item.height + " cm"],
    ];
  };

  protected renderCustomFilters() {
    return (
      <Dropdown
        pickerData={["all", ...this.state.pickerData]}
        pickerSelectedValue={this.state.pickerSelectedValue}
        onSetPickerSelectedValue={this.onSetPickerSelectedValue}
      />
    );
  }
}

//   private renderCard = (item) => {
//     return (
//       <Card
//         itemName={item.name}
//         propertyOne={["Gender", item.gender]}
//         propertyTwo={["Birth year", item.birth_year]}
//         propertyThree={["Height", item.height + " cm"]}
//         onClick={() => this.goToDetails(item)}
//       ></Card>
//     );
// //   };

//   public componentDidMount() {
//     this.getData();
//   }

//   public render() {
//     const { data, isLoading } = this.state;

//     return (
//       <View style={styles.container}>
//         <SearchInput
//           placeholderText={"name"}
//           onSearchInput={this.onSearchPerson}
//           searchItem={this.searchDetail}
//         />
//         <Dropdown
//           pickerData={["all", ...this.state.pickerData]}
//           pickerSelectedValue={this.state.pickerSelectedValue}
//           onSetPickerSelectedValue={this.onSetPickerSelectedValue}
//         />
//         {isLoading ? (
//           <ActivityIndicator />
//         ) : (
//           <FlatList
//             columnWrapperStyle={{ justifyContent: "space-between" }}
//             numColumns={2}
//             data={data}
//             keyExtractor={(item) => item.url}
//             extraData={data}
//             renderItem={({ item }) => this.renderCard(item)}
//           />
//         )}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.mainBackground,
//     alignItems: "center",
//   },
// });
