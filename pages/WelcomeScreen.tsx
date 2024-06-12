import { StackScreenProps } from "@react-navigation/stack";
import { View, Text, Button, StyleSheet } from "react-native";
import { RootStackParamList } from "../utils/types";
import React from "react";

type WelcomeScreenProps = StackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>EcoQuest</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <Button title="SignUp" onPress={() => navigation.navigate("SignUp")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    marginTop: 22,
    maxWidth: 500,
    minWidth: 300,
  },
});

export default WelcomeScreen;
