import { View, Text, StyleSheet } from "react-native";

export default function QuestScreen() {
  return (
    <View style={styles.container}>
      <Text>QuestPage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
});
