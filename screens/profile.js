import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null); // To store the token
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load user data from AsyncStorage and token on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const user = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
      if (user) {
        const parsedUser = JSON.parse(user);
        setFormData({
          firstname: parsedUser.firstname || '',
          lastname: parsedUser.lastname || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || '',
        });
        setUserId(parsedUser.id);
      }
      if (storedToken) {
        setToken(storedToken); // Set token in state
      }
    };

    loadUserData();
  }, []);

  // Handle form submission to update user data
  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error', 'User is not authenticated.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://military-lp8n.onrender.com/api/v1/users/update/' + userId, { // Replace with your API URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use the stored token
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const res = await response.json();
        Alert.alert('Success', res.message); // Show success message
        await AsyncStorage.setItem('user', JSON.stringify(formData)); // Save updated user data to AsyncStorage
        setLoading(false);
        navigation.goBack(); // Navigate back after successful update
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message); // Show error message
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update user profile. Please try again later.'); // Show error message
      setLoading(false);
      console.error(error); // Log the error for debugging purposes
    }
  };

  // Change Password Functionality
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
      const response = await fetch('https://military-lp8n.onrender.com/api/v1/users/changePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use the stored token
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      if (response.ok) {
        const res = await response.json();
        Alert.alert('Success', res.message); // Show success message
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setLoading(false);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message); // Show error message
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again later.'); // Show error message
      setLoading(false);
      console.error(error); // Log the error for debugging purposes
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => {
            await AsyncStorage.clear(); // Clear AsyncStorage data
            // navigation.navigate('Login'); // Navigate to Login screen
        }},
      ],
      { cancelable: false }
    );
    await AsyncStorage.removeItem('token');
await AsyncStorage.removeItem('user');

  };
  

  return (
    <View style={{ padding: 20 }}>
      {/* Profile Card */}
      <View style={{ padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Profile Information</Text>
        <Text>Name: {formData.firstname} {formData.lastname}</Text>
        <Text>Email: {formData.email}</Text>
        <Text>Phone: {formData.phone}</Text>
        <Text>Address: {formData.address}</Text>
      </View>

      {/* Change Password Section */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Change Password</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Old Password"
        value={passwordData.oldPassword}
        onChangeText={(text) => setPasswordData({ ...passwordData, oldPassword: text })}
        secureTextEntry
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="New Password"
        value={passwordData.newPassword}
        onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
        secureTextEntry
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        placeholder="Confirm New Password"
        value={passwordData.confirmPassword}
        onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
        secureTextEntry
      />


      {/* Submit Button for Password Change */}
      <Button title="Change Password" onPress={handlePasswordChange} disabled={loading} />

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePage;
