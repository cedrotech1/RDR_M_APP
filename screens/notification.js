import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow } from 'date-fns';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`https://military-lp8n.onrender.com/api/v1/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`https://military-lp8n.onrender.com/api/v1/notification/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      Toast.show({ type: 'error', text1: 'Failed to mark as read' });
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`https://military-lp8n.onrender.com/api/v1/notification/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      Toast.show({ type: 'error', text1: 'Failed to delete notification' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No new notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.notificationCard, item.isRead && styles.readNotification]}>
              <Ionicons name="notifications" size={24} color={item.isRead ? '#aaa' : '#d9534f'} />
              <View style={styles.notificationText}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Text>
              </View>
              <View style={styles.actions}>
                {!item.isRead && (
                  <TouchableOpacity onPress={() => markAsRead(item.id)} style={styles.markReadButton}>
                    <Text style={styles.markReadText}>Read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => deleteNotification(item.id)} style={styles.deleteButton}>
                  <Ionicons name="trash" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  noNotifications: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#777' },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  readNotification: { backgroundColor: '#eaeaea' },
  notificationText: { flex: 1, marginLeft: 10 },
  title: { fontWeight: 'bold', fontSize: 16 },
  message: { fontSize: 14, color: '#555' },
  time: { fontSize: 12, color: '#777', marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  markReadButton: { marginRight: 10, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: 'green', borderRadius: 5 },
  markReadText: { color: 'white', fontSize: 14 },
  deleteButton: { backgroundColor: 'red', padding: 8, borderRadius: 5 },
});

export default NotificationsScreen;
