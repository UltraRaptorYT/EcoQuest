import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import supabase from "../utils/supabase";
import { UserContext } from "../context/UserContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userContext = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <View style={styles.inputItems}>
        <Text style={styles.subhead}>Email Address</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholderTextColor="black"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputItems}>
        <Text style={styles.subhead}>Password</Text>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          secureTextEntry={true}
          placeholderTextColor="black"
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
      </View>
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
  subhead: {
    color: "#6E548C",
  },
  inputItems: {},
  input: {},
});
