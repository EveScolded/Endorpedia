import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import colors from "../config/colors";

interface IFilterSliderProps {
  sliderValue: number;
  max?: number;
  min?: number;
  onValueChange: (value) => void;
  thumbTitle: string;
}

export default class FilterSlider extends Component<IFilterSliderProps, {}> {
  constructor(props) {
    super(props);
  }

  private CustomThumb = () => (
    <View style={styles.thumb}>
      <Text>{this.props.thumbTitle}</Text>
    </View>
  );
  render() {
    return (
      <View style={styles.container}>
        <Slider
          value={this.props.sliderValue}
          animateTransitions
          renderThumbComponent={this.CustomThumb}
          trackStyle={styles.track}
          maximumValue={this.props.max}
          minimumValue={this.props.min}
          onValueChange={this.props.onValueChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 354,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 25,
    marginBottom: 25,
    alignItems: "stretch",
    justifyContent: "center",
  },
  thumb: {
    alignItems: "center",
    backgroundColor: colors.mainBanana,
    height: 40,
    justifyContent: "center",
    width: 80,
  },
  track: {
    borderRadius: 2,
    height: 30,
  },
});
