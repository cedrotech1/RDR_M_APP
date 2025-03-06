import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LandingPage = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null); 


  useEffect(() => {
    const loadUserData = async () => {
      const user = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
      if (user) {
        const parsedUser = JSON.parse(user);
      
        setUserId(parsedUser.id);
      }
      if (storedToken) {
        setToken(storedToken); // Set token in state
      }
    };

    loadUserData();
  }, []);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `https://military-lp8n.onrender.com/api/v1/appointment/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setAppointments(data.data);
        } else {
          console.error('Failed to fetch appointments:', data.message);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Appointments</Text>

      {appointments.map((appointment) => (
        <TouchableOpacity
          key={appointment.id}
          style={styles.card}
          onPress={() => navigation.navigate('AppointmentDetail', { id: appointment.id })}
        >
          <Text style={styles.cardTitle}>Mission: {appointment.mission.name}</Text>
          <Text>Status: {appointment.status}</Text>
          <Text>Date: {new Date(appointment.createdAt).toLocaleDateString()}</Text>
          <Text>Assigned By: {appointment.assigner.firstname} {appointment.assigner.lastname}</Text>

          <View style={styles.contactInfo}>
            <Text>Contact:</Text>
            <Text>Location: {appointment.assigner.address}</Text>
            <Text>Email: {appointment.assigner.email}</Text>
            <Text>Phone: {appointment.assigner.phone}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Pagination */}
      <View style={styles.pagination}>
        <Button title="Previous" onPress={() => {}} />
        <Text>Page 1 of 1</Text>
        <Button title="Next" onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactInfo: {
    marginTop: 10,
    backgroundColor: '#e6f7ff',
    padding: 8,
    borderRadius: 6,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LandingPage;
