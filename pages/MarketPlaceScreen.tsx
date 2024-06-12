import { View, Text, StyleSheet } from "react-native";

export default function MarketPlaceScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
      </View>
      <Text>MarketPlacePage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    marginTop: 22,
    maxWidth: 500,
    minWidth: 300,
  },
  header: {
    display: "flex",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
