import { View, Text, StyleSheet } from "react-native";
import { SignOutButton } from "../components/SignOutButton";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

export default function ProfileScreen() {
  const { user } = useAuthenticator((context) => [context.user]);
  return (
    <View style={styles.container}>
      <SignOutButton />
      <Text>ProfilePage {JSON.stringify(user)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
  },
});
