import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";
import ProgressLine from "../components/ProgessLine";

function validatePassword(password: string) {
  // minimum 8 characters
  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  // check for mix of letters, numbers, and symbols
  let hasLetters = false;
  let hasNumbers = false;
  let hasSymbols = false;
  let letters = /[A-Za-z]/;
  let numbers = /[0-9]/;
  let symbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

  for (let i = 0; i < password.length; i++) {
    if (password[i].match(letters)) {
      hasLetters = true;
    } else if (password[i].match(numbers)) {
      hasNumbers = true;
    } else if (password[i].match(symbols)) {
      hasSymbols = true;
    }
  }

  if (!hasLetters || !hasNumbers || !hasSymbols) {
    return {
      isValid: false,
      error: "Password must contain a mix of letters, numbers, and symbols",
    };
  }

  return {
    isValid: true,
    error: "",
  };
}

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const userContext = useContext(UserContext);

  useEffect(() => {
    const passwordValidationResult = validatePassword(password);
    if (!passwordValidationResult.isValid) {
      setPasswordError(passwordValidationResult.error);
    } else {
      setPasswordError("");
    }
  });

  async function createUser(
    username: string,
    name: string,
    email: string,
    password: string
  ) {
    console.log("IDK");
    const response = await fetch(
      "https://e7eg0soi49.execute-api.ap-southeast-1.amazonaws.com/default/supabase_signup",
      {
        method: "POST",
        body: JSON.stringify({
          username,
          name,
          email,
          password,
        }),
      }
    );
    const data = await response.json();
    if (data && "error" in data) {
      throw new Error(data.error);
    }
    console.log(data);
  }

  const onHandleSignUp = async () => {
    setError("");
    if (
      email.trim() !== "" &&
      password.trim() !== "" &&
      username.trim() !== "" &&
      name.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      isPasswordMatch &&
      error == ""
    ) {
      try {
        const userinfo = await createUser(username, name, email, password);
        userContext?.setUser(userinfo);
        navigation.navigate("BottomBar");
      } catch (error) {
        console.log((error as Error).message);
        if (
          error &&
          (error as Error).message &&
          (error as Error).message ==
            `duplicate key value violates unique constraint "ecoquest_user_email_key"`
        ) {
          setError("Email already exist");
        } else if (
          error &&
          (error as Error).message &&
          (error as Error).message ==
            `duplicate key value violates unique constraint "ecoquest_user_username_key"`
        ) {
          setError("Username already exist");
        } else {
          setError((error as Error).message);
        }
      }
    } else {
      setError("Fill up required fields");
    }
  };

  const calculatePasswordStrength = (password: string) => {
    // Minimum password length
    const MIN_LENGTH = 8;

    // Check if password length is less than 8
    if (password.length < MIN_LENGTH) {
      return 0.1;
    }

    // Check for mix of letters, numbers, and symbols
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLetters || !hasSymbols) {
      return 0.3;
    }

    if (!hasLetters || !hasNumbers || !hasSymbols) {
      return 0.7;
    }

    return 1;
  };

  const handlePasswordChange = (text: string) => {
    setError("");
    setPassword(text);
    setPasswordStrength(calculatePasswordStrength(text));
  };

  const handleconfirmPasswordChange = (text: string) => {
    setError("");
    setconfirmPassword(text);
    setIsPasswordMatch(password === text);
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 80 }}>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Name</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            placeholderTextColor="white"
            autoCapitalize="none"
            value={name}
            onChangeText={(text) => {
              setError("");
              setName(text);
            }}
          ></TextInput>
        </View>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Username</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            placeholderTextColor="white"
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => {
              setError("");
              setUsername(text);
            }}
          ></TextInput>
        </View>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Email Address</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            placeholderTextColor="black"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setError("");
              setEmail(text);
            }}
          ></TextInput>
        </View>
        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Password</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            secureTextEntry={true}
            placeholderTextColor="black"
            autoCapitalize="none"
            value={password}
            onChangeText={handlePasswordChange}
          />
        </View>

        <View style={styles.inputItems}>
          <Text style={styles.subhead}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={""}
            secureTextEntry={true}
            placeholderTextColor="black"
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={handleconfirmPasswordChange}
          />
        </View>
        <View style={styles.line}>
          <ProgressLine progress={passwordStrength} />
        </View>
        {passwordError !== "" && (
          <Text style={styles.errorMsg}>{passwordError}</Text>
        )}
        {error !== "" && <Text style={styles.errorMsg}>{error}</Text>}
        {!isPasswordMatch && (
          <Text style={styles.errorMsg}>Passwords do not match</Text>
        )}
      </View>
      <View style={{ alignItems: "center" }}>
        <Button title="Register" onPress={onHandleSignUp}></Button>
        <Text style={{ marginTop: 30, marginBottom: 40 }}>
          Do you have already an account?
        </Text>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
        ></Button>
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
  line: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 330,
    marginTop: 10,
    marginBottom: 10,
  },
  errorMsg: {
    color: "red",
    margin: 10,
    textAlign: "left",
    width: 330,
  },
});
