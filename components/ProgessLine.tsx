import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";

const ProgressLine = ({ progress }: { progress: number }) => {
  const [width, setWidth] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    setProgressWidth(progress * width);
  }, [progress, width]);

  return (
    <View style={styles.container}>
      <View
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        style={styles.lineContainer}
      >
        <View
          style={{
            ...styles.line,
            width: progressWidth,
            backgroundColor:
              progress >= 0.8 ? "green" : progress >= 0.5 ? "#00FAD9" : "red",
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  lineContainer: {
    flex: 1,
    height: 3,
    borderRadius: 5,
    backgroundColor: "#ddd",
    overflow: "hidden",
  },
  line: {
    height: "100%",
  },
});

export default ProgressLine;
