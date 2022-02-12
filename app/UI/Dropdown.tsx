import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../config/colors";

import React, { Component } from "react";

interface PickerProps {
  pickerData: string[];
  pickerSelectedValue: string;
  onSetPickerSelectedValue: (pickerSelectedValue) => void;
}

export default class Dropdown extends Component<PickerProps, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    let pickerOptions = this.props.pickerData.map(function (item) {
      return <Picker.Item key={item} value={item} label={item} />;
    });

    return (
      <View style={styles.container}>
        <Picker
          selectedValue={this.props.pickerSelectedValue}
          style={styles.picker}
          onValueChange={this.props.onSetPickerSelectedValue}
        >
          {pickerOptions}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    color: "white",
  },
  picker: { height: 50, width: 170, backgroundColor: colors.picker },
});
