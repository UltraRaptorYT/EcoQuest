import { Button, View, StyleSheet, Text } from "react-native";

type PostType = {
  img: string;
  heart: string;
};

export const Post = ({ img }: PostType) => {
  return (
    <View style={styles.signOutButton}>
      <Text>{img}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: "flex-end",
  },
});
