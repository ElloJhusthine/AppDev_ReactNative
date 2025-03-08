import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Switch, CheckBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Complete project", completed: true },
  ]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("darkMode");
      if (savedTheme !== null) setDarkMode(JSON.parse(savedTheme));
    };
    loadTheme();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditedText(task.text);
  };

  const saveEdit = () => {
    setTasks(tasks.map((task) => (task.id === editingTask ? { ...task, text: editedText } : task)));
    setEditingTask(null);
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "All" ? true : filter === "Completed" ? task.completed : !task.completed
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: darkMode ? "#222" : "#FFC0CB" }}>
      {/* Dark Mode Toggle */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 16, color: darkMode ? "#fff" : "#000", marginRight: 10 }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />
      </View>

      <Text style={{ fontSize: 24, fontWeight: "bold", color: darkMode ? "#fff" : "#000" }}>To-Do List</Text>

      <TextInput
        placeholder="Add a task"
        placeholderTextColor={darkMode ? "#ccc" : "#000"}
        value={newTask}
        onChangeText={setNewTask}
        style={{ borderBottomWidth: 1, marginBottom: 10, color: darkMode ? "#fff" : "#000" }}
      />
      <TouchableOpacity onPress={addTask} style={{ backgroundColor: "#8A2BE2", padding: 10, borderRadius: 5, marginBottom: 10 }}>
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Add Task</Text>
      </TouchableOpacity>

      {/* Filter Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        {["All", "Completed", "Pending"].map((type) => (
          <TouchableOpacity key={type} onPress={() => setFilter(type)} style={{ backgroundColor: "#8A2BE2", padding: 5, borderRadius: 5 }}>
            <Text style={{ fontSize: 16, color: "#fff" }}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            {/* Show checkbox only in "All" and "Pending" filters */}
            {(filter === "All" || filter === "Pending") && (
              <CheckBox value={item.completed} onValueChange={() => toggleComplete(item.id)} />
            )}
            {editingTask === item.id ? (
              <TextInput
                value={editedText}
                onChangeText={setEditedText}
                style={{ flex: 1, borderBottomWidth: 1, color: darkMode ? "#fff" : "#000" }}
              />
            ) : (
              <TouchableOpacity onPress={() => toggleComplete(item.id)} style={{ flex: 1 }}>
                <Text style={{ 
                  textDecorationLine: item.completed ? "line-through" : "none", 
                  color: item.completed ? "#8A2BE2" : "#FF0000",
                  fontWeight: "bold"
                }}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            )}
            {editingTask === item.id ? (
              <TouchableOpacity onPress={saveEdit} style={{ backgroundColor: "#8A2BE2", padding: 5, borderRadius: 5 }}>
                <Text style={{ color: "#fff" }}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => startEditing(item)} style={{ backgroundColor: "#8A2BE2", padding: 5, borderRadius: 5 }}>
                <Text style={{ color: "#fff" }}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}
