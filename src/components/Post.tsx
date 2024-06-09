import { useState } from "react";
import {
  Button,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
} from "react-native";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

type PostType = {
  img: string;
  caption: string;
};

export default function Post({ img, caption }: PostType) {
  const { user } = useAuthenticator((context) => [context.user]);
  console.log(user)
  const [imageHeight, setImageHeight] = useState<number | null>(null);

  Image.getSize(img, (width, height) => {
    const aspectRatio = width / height;
    const screenWidth = Dimensions.get("window").width;
    const calculatedHeight = screenWidth / aspectRatio;
    setImageHeight(calculatedHeight);
  });

  return (
    <View style={styles.post}>
      <Image
        source={{ uri: img }}
        style={[styles.image, { height: imageHeight }]}
      />
      <Text>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "auto",
  },
});
