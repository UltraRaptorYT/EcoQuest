import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import Post from "../components/Post";

type PostType = {
  id: number;
  img: string;
  caption: string;
  user_id: string;
  created_at: string;
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<PostType[]>();

  useEffect(() => {
    async function getPost() {
      const { data, error } = await supabase
        .from("ecoquest_post")
        .select()
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
      }
      setPosts(data || []);
    }
    getPost();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        {posts?.map((e, i) => {
          return <Post img={e.img} caption={e.caption} key={`Post${i}`}></Post>;
        })}
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
  postContainer: {},
});
