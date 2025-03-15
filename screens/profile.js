import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from '@env';
import { Ionicons } from "@expo/vector-icons";
import DepartmentCard from './department'; // Adjust the import path based on your file structure

const ProfilePage = ({ navigation, route }) => {
  const { onLogout } = route.params || {};
  const [isLoading, setIsLoading] = React.useState(false);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      const user = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      if (user) {
        const parsedUser = JSON.parse(user);
        setFormData({
          firstname: parsedUser.firstname || '',
          lastname: parsedUser.lastname || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
        });
        setUserId(parsedUser.id);
      }
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadUserData();
  }, []);

  const handlePasswordChange = async () => {
    if (!token) {
      Alert.alert('Error', 'User is not authenticated.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/users/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        Alert.alert('Success', res.message);
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setLoading(false);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message);
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again later.');
      setLoading(false);
      console.error(error);
    }
  };

  const handleLogout = async () => {
            onLogout();
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <Text style={styles.header}>
          <Ionicons name="person" size={28} color="green" /> My Profile
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Information</Text>
          <Text style={styles.cardText}>Name: {formData.firstname} {formData.lastname}</Text>
          <Text style={styles.cardText}>Email: {formData.email}</Text>
          <Text style={styles.cardText}>Phone: {formData.phone}</Text>
          <DepartmentCard />
        </View>

        {/* Change Password Section */}
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChangeText={(text) => setPasswordData({ ...passwordData, oldPassword: text })}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={passwordData.newPassword}
          onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={passwordData.confirmPassword}
          onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
          secureTextEntry
        />

        {/* Submit Button for Password Change */}
        <Button color="green" title="Change Password" onPress={handlePasswordChange} disabled={loading} />

        {/* Loading Spinner */}
        {loading && <ActivityIndicator size="large" color="green" style={styles.loadingIndicator} />}

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c7fcd0',
  },
  fixedHeader: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 10,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  scrollViewContent: {
    paddingTop: 80, // Adjust based on the height of your header
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: 'lightgreen',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfilePage;
