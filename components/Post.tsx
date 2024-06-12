import React, { useState, useEffect, useContext } from "react";
import {
  Pressable,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { PostType } from "../utils/types";
import { Ionicons } from "@expo/vector-icons";
import supabase from "../utils/supabase";
import { UserContext } from "../context/UserContext";
import Toast from "react-native-toast-message";

export default function Post({
  id,
  caption,
  img,
  created_at,
  user_id,
  category,
  ecoquest_user,
  liked = false,
}: PostType) {
  const [imgHeight, setImgHeight] = useState(0);
  const [isLiked, setIsLiked] = useState(liked ? true : false);
  const userContext = useContext(UserContext);

  // Function to calculate the height of the image
  useEffect(() => {
    Image.getSize(
      img,
      (width, height) => {
        const screenWidth = Dimensions.get("window").width;
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImgHeight(imageHeight);
      },
      (error) => {
        console.error(`Unable to determine image dimensions: ${error}`);
      }
    );
  }, [img]);

  function getTimeDifference(isoDateString: string) {
    const targetTime = new Date(isoDateString);
    const currentTime = new Date();

    const differenceInMillis = currentTime.getTime() - targetTime.getTime();
    const differenceInSeconds = Math.floor(differenceInMillis / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (Math.abs(differenceInDays) >= 1) {
      return `${differenceInDays} d`;
    } else if (Math.abs(differenceInHours) >= 1) {
      return `${differenceInHours} h`;
    } else if (Math.abs(differenceInMinutes) >= 1) {
      return `${differenceInMinutes} m`;
    } else if (Math.abs(differenceInSeconds) >= 1) {
      return `${differenceInSeconds} s`;
    } else {
      return `${Math.abs(differenceInMillis)} ms`;
    }
  }

  async function addLike(user_id: number | undefined, post_id: number) {
    if (!user_id) {
      return;
    }
    let response;
    if (isLiked) {
      response = await supabase
        .from("ecoquest_likes")
        .delete()
        .eq("user_id", user_id)
        .eq("post_id", post_id);
    } else {
      response = await supabase
        .from("ecoquest_likes")
        .insert({ user_id, post_id });
    }
    if (response.error) {
      console.error(response.error);
    }
    setIsLiked((prev) => !prev);
  }

  return (
    <View style={styles.post}>
      <View style={styles.author}>
        <Image source={{ uri: ecoquest_user.pfp }} style={styles.author_pfp} />
        <View style={styles.authorNameContainer}>
          <Text style={styles.authorName}>{ecoquest_user.name}</Text>
          <Text style={styles.authorUserName}>@{ecoquest_user.username}</Text>
        </View>
      </View>
      <View style={styles.imgContainer}>
        {/* Ensure image is visible by setting height dynamically */}
        <Image
          source={{ uri: img }}
          style={[styles.image, { height: imgHeight }]}
        />
      </View>
      <View style={styles.utils}>
        <Pressable
          onPress={() => {
            addLike(userContext?.user.id, id);
          }}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={26}
            color={isLiked ? "#e60013" : "black"}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            // addLike(userContext?.user.id, id);
          }}
        >
          <Ionicons
            name={"chatbubble-outline"}
            size={26}
            color={"black"}
            style={{ paddingBottom: 1 }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            Toast.show({
              type: "success",
              text1: "Link copied!",
              visibilityTime: 1000,
            });
          }}
        >
          <Ionicons name={"arrow-redo-outline"} size={26} color={"black"} />
        </Pressable>
      </View>
      <Text>
        <Text style={styles.authorUserNameCaption}>
          {ecoquest_user.username}
        </Text>{" "}
        <Text style={styles.time}>• {getTimeDifference(created_at)}</Text>{" "}
        <Text>{caption}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: 10,
  },
  post: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 20,
    gap: 7.5,
  },
  image: {
    width: "100%",
  },
  author: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  author_pfp: {
    width: 35,
    height: 35,
    borderRadius: 9999,
  },
  authorNameContainer: {
    marginLeft: 10, // Adjust spacing to align with design
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  authorUserName: {
    fontSize: 12,
    color: "#696969",
  },
  imgContainer: {
    borderRadius: 15,
    overflow: "hidden",
  },
  utils: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  authorUserNameCaption: {
    fontWeight: "bold",
  },
});
