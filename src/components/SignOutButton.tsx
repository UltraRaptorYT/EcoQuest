import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Button, View, StyleSheet, SafeAreaView } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: "flex-end",
  },
});
