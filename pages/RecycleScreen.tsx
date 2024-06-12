import { View, Text, StyleSheet } from "react-native";

export default function RecycleScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
      </View>
      <Text>RecyclePage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    display: "flex",
    marginTop: 26,
    maxWidth: 500,
    minWidth: 300,
  },
  header: {
    display: "flex",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
