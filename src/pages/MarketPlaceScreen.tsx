import { View, Text, StyleSheet } from "react-native";

export default function MarketPlaceScreen() {
  return (
    <View style={styles.container}>
      <Text>MarketPlacePage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
});
