import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext, useCallback } from "react";
import supabase from "../utils/supabase";
import Post from "../components/Post";
import { FontAwesome } from "@expo/vector-icons";
import { RootStackParamList } from "../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { UserContext } from "../context/UserContext";
import * as ImagePicker from "expo-image-picker";
import Pill from "../components/Pill";
import { Dropdown } from "react-native-element-dropdown";

import { PostType, LikeType } from "../utils/types";
import Toast from "react-native-toast-message";

const HomeScreen = () => {
  const userContext = useContext(UserContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<PostType[]>();
  const [likes, setLikes] = useState<LikeType[]>();
  const [refreshing, setRefreshing] = useState(false);

  const [categories, setCategories] = useState<string[]>();
  const [selectedCate, setSelectedCate] = useState<string>("Recent");

  const [image, setImage] = useState<string | undefined>(undefined);
  const [caption, setCaption] = useState<string>();

  const [loadingPost, setLoadingPost] = useState<boolean>(true);

  const [value, setValue] = useState<string>();
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const [error, setError] = useState<string>();

  async function getCategories() {
    const { data, error } = await supabase.from("ecoquest_categories").select();
    if (error) {
      console.error(error);
      return;
    }
    setCategories(["Recent", ...data.map((e) => e.category)]);
  }

  async function getLikes() {
    const { data, error } = await supabase.from("ecoquest_likes").select();
    if (error) {
      console.error(error);
    }
    return { data: data, error: error };
  }

  async function getPost(selectedCate = "Recent") {
    setLoadingPost(true);
    setLikes([]);
    setPosts([]);
    let { data, error } = await supabase
      .from("ecoquest_post")
      .select("*, ecoquest_user!ecoquest_post_user_id_fkey(*)")
      .order("created_at", { ascending: false });
    const likeData = await getLikes();
    if (error || likeData.error) {
      console.error(error || likeData.error);
      return;
    }
    setLikes(likeData.data || []);
    if (selectedCate != "Recent") {
      data = (data as PostType[]).filter((e) => e.category == selectedCate);
    }
    setPosts(data || []);
    setLoadingPost(false);
  }

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getPost(selectedCate);
  }, [selectedCate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getPost();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Function to convert local URI to Blob
  async function uriToBlob(uri: string) {
    // Fetch the file
    const response = await fetch(uri);

    // Convert the response to a Blob
    const blob = await response.blob();

    return blob;
  }

  useEffect(() => {
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });


      if (!result.canceled) {
        const { uri, fileName } = result.assets[0];
        setImage(uri);
        let file = await uriToBlob(uri);
        let filePath = `${String(new Date().getTime())}_${fileName}`;
        const { data, error } = await supabase.storage
          .from("ecoquest")
          .upload(filePath, file);
        if (error) {
          return console.error(error);
        }
        setImage(
          process.env.EXPO_PUBLIC_SUPABASE_URL +
            "/storage/v1/object/public/ecoquest/" +
            data.path
        );
      } else {
        pickImage();
      }
    };

    if (modalVisible) {
      pickImage();
    }
  }, [modalVisible]);

  async function createPost() {
    if (caption?.trim() == "") {
      setError("");
      return;
    }
    let { error } = await supabase.from("ecoquest_post").insert({
      caption: caption,
      img: image,
      user_id: userContext?.user.id,
      category: value,
    });

    if (error) {
      setError(error.message);
      return console.error(error);
    }

    return;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
        <Pressable
          onPress={() => {
            setCaption("");
            setImage("");
            setModalVisible(true);
          }}
        >
          <FontAwesome name="plus-square-o" size={26} color="black" />
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <FontAwesome name="times" size={16} color="#B0B0B0" />
            </Pressable>
            {image && <Image source={{ uri: image }} style={styles.img} />}
            <TextInput
              placeholder="Write a caption"
              style={styles.textInput}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setCaption(text)}
              value={caption}
            ></TextInput>
            <Text style={styles.label}>Category</Text>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={
                categories
                  ?.filter((e) => e != "Recent")
                  .map((e) => {
                    return { label: e, value: e };
                  }) || []
              }
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select category" : "..."}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValue(item.value);
                setIsFocus(false);
              }}
            />
            {error !== "" && <Text style={styles.errorMsg}>{error}</Text>}
            <Pressable
              style={styles.button}
              onPress={async () => {
                await createPost();
                setModalVisible(!modalVisible);
                Toast.show({
                  type: "success",
                  text1: "Post Successful",
                  visibilityTime: 1000,
                });
                getPost();
              }}
            >
              <Text style={styles.textStyle}>Post</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
        <FlatList
          horizontal={true}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pill
              isSelected={selectedCate == item}
              onPress={() => setSelectedCate(item)}
            >
              {item}
            </Pill>
          )}
        />
      </View>
      <ScrollView
        style={styles.postContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loadingPost ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size={50} color="#0000ff" />
          </View>
        ) : posts?.length == 0 ? (
          <View style={styles.activityIndicator}>
            <Text style={{ textAlign: "center", fontSize: 24 }}>
              No Posts Found
            </Text>
          </View>
        ) : (
          posts?.map((post, i) => {
            return (
              <Post
                {...(post as PostType)}
                key={i}
                liked={
                  likes?.filter(
                    (e) =>
                      e.post_id == post.id && e.user_id == userContext?.user.id
                  ).length == 1
                }
              ></Post>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    display: "flex",
    marginTop: 26,
    maxWidth: 500,
    minWidth: 300,
    width: "100%",
  },
  postContainer: {
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    gap: 10,
  },
  header: {
    display: "flex",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 20,
  },

  // Modal
  centeredView: {
    flex: 1,
  },
  modalView: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    paddingTop: 32,
    alignItems: "center",
    height: "100%",
    zIndex: 5,
    gap: 10,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  img: {
    width: 300,
    aspectRatio: 1,
    height: 300,
    marginRight: "auto",
    marginLeft: "auto",
    padding: 5,
  },
  closeButton: {
    alignSelf: "flex-start",
  },
  textInput: {
    width: "100%",
    padding: 10,
    fontSize: 16,
  },
  activityIndicator: {
    height: 600,
    justifyContent: "center",
  },

  button: {
    width: "100%",
    borderRadius: 15,
    height: "auto",
  },

  // DropDown
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: "100%",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    fontSize: 14,
    textAlign: "left",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorMsg: {
    color: "red",
    margin: 10,
    textAlign: "left",
    width: 330,
  },
});

export default HomeScreen;
