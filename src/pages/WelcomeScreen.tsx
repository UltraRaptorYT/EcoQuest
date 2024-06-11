import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView, Text, Button, StyleSheet } from "react-native";
import { RootStackParamList } from "../utils/types";
import React from "react";

type WelcomeScreenProps = StackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>asda</Text>
      <Button title="test" onPress={() => navigation.navigate("BottomBar")} />
    </SafeAreaView>
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
