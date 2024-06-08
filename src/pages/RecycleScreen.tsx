import { View, Text, StyleSheet } from "react-native";

export default function RecycleScreen() {
  return (
    <View style={styles.container}>
      <Text>RecyclePage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
});
