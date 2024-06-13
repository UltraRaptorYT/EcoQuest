import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import supabase from "../utils/supabase";
import { useEffect, useState, useContext } from "react";
import Task from "../components/Task";
import { UserContext } from "../context/UserContext";

export type TaskType = {
  id: number;
  title: string;
  description: string;
  points: number;
  type: string;
};

export default function QuestScreen() {
  const userContext = useContext(UserContext);
  const [tasks, setTasks] = useState<TaskType[]>();
  const [points, setPoints] = useState<number>(0);
  async function getCompletedTasks() {
    const { data, error } = await supabase
      .from("ecoquest_user_tasks")
      .select()
      .eq("user_id", userContext?.user.id);

    if (error) {
      console.error(error);
      return [];
    }
    return data.map((e) => e.task_id);
  }
  async function getTasks() {
    setTasks([]);
    let { data, error } = await supabase.from("ecoquest_tasks").select();

    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      const completedTasks: number[] = await getCompletedTasks();
      setPoints(
        completedTasks.reduce((p, i) => {
          return p + data?.filter((e) => e.id == i)[0].points;
        }, 0)
      );
      console.log(completedTasks, data);
      data = (data as TaskType[]).filter((e) => !completedTasks.includes(e.id));
    }

    setTasks(data || []);
  }

  useEffect(() => {
    getTasks();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>EcoQuest</Text>
        <Text style={styles.heading}>{points}</Text>
      </View>
      <ScrollView style={styles.taskContainer}>
        {tasks?.map((e) => {
          return <Task task={e} key={`Task${e.id}`} rerun={getTasks}></Task>;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    display: "flex",
    marginTop: 26,
    maxWidth: 500,
    minWidth: 300,
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
  taskContainer: {
    padding: 15,
    gap: 15,
  },
});
