import React from "react";
import { View, StyleSheet } from "react-native";

const DottedLine = ({
  length,
  dotSize,
  dotSpacing,
  dotColor,
}: {
  length: number;
  dotSize: number;
  dotSpacing: number;
  dotColor: string;
}) => {
  // Calculate the number of dots
  const numberOfDots = Math.floor(length / (dotSize + dotSpacing));
  const dots = Array.from({ length: numberOfDots }).map((_, index) => (
    <View
      key={index}
      style={[
        styles.dot,
        {
          width: dotSize * (index % 8 == 0 ? 15 : index % 4 == 0 ? 1 : 0),
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: dotColor,
          marginRight: dotSpacing,
        },
      ]}
    />
  ));

  return <View style={styles.line}>{dots}</View>;
};

const styles = StyleSheet.create({
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {},
});

export default DottedLine;
