import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDistanceToNow } from "date-fns";
import { REACT_APP_BASE_URL } from '@env';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(
            `${REACT_APP_BASE_URL}/api/v1/notification/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setNotifications(response.data.data || []);
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setNotifications([]);
          Alert.alert("Error", "Failed to fetch notifications.");
        }
      };
      fetchNotifications();
    }
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${REACT_APP_BASE_URL}/api/v1/notification/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Alert.alert("Error", "Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `${REACT_APP_BASE_URL}/api/v1/notification/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      Alert.alert("Error", "Failed to delete notification");
    }
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.card, item.isRead ? styles.readCard : styles.unreadCard]}>
      <View style={styles.cardHeader}>
        <Ionicons
          name={item.isRead ? "notifications-outline" : "notifications"}
          size={24}
          color={item.isRead ? "#7f8c8d" : "#f39c12"}
        />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </Text>
      <View style={styles.cardFooter}>
        {!item.isRead && (
          <TouchableOpacity
            style={styles.readButton}
            onPress={() => markAsRead(item.id)}
          >
            <Text style={styles.readButtonText}>Mark as Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     
         <View style={styles.headerNotification}>
         <Text style={styles.header}>
        <Ionicons name="notifications" size={28} color="" /> Notifications
        </Text>
        </View>
     
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No new notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#c7fcd0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginBottom: 16,
  },
  headerNotification: {
    fontSize: 24,
    backgroundColor:'white',
    fontWeight: 'bold',
    // textAlign: 'center',
    marginBottom: 20,
    padding: 16,
    color:'green',
    width:'100%'
  },
  noNotifications: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "lightgreen", // Subtle background color for the card
  },
  unreadCard: {
    backgroundColor: "#f9f9f9", // Slightly darker background for unread notifications
  },
  readCard: {
    backgroundColor: "#ffffff", // Lighter background for read notifications
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    // backgroundColor:'white'
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#2c3e50", // Darker title color
  },
  message: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#95a5a6",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  readButton: {
    backgroundColor: "#27ae60", // Green button for 'Mark as Read'
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  readButtonText: {
    color: "white",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#e74c3c", // Red button for 'Delete'
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 14,
  },
});

export default Notifications;
