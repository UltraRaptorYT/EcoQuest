import { View, Text, StyleSheet } from "react-native";
import { SignOutButton } from "../components/SignOutButton";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <SignOutButton />
      <Text>ProfilePage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
});
