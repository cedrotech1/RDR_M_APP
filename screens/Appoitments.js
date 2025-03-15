import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, ActivityIndicator,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from '@env';

const LandingPage = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); 

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error retrieving token', error);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;  // Prevent fetching if there's no token

      try {
        const response = await fetch(
          `${REACT_APP_BASE_URL}/api/v1/appoitment/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Log the raw response for debugging
        const text = await response.text();
        console.log('Raw Response:', text);

        // Check if the response is JSON
        try {
          const data = JSON.parse(text);
          if (data.success) {
            setAppointments(data.data);
          } else {
            console.error('Failed to fetch appointments:', data.message);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          // If it's not JSON, handle it accordingly (e.g., show an error message)
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);  // Dependency on token to refetch when token changes

  if (loading) {
    return <Text><ActivityIndicator size="large" color="green" style={styles.loader} /></Text>;
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
    flex: 1,
    backgroundColor: "#c7fcd0",
  },
  header: {
    fontSize: 24,
    backgroundColor:'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    padding: 16,
    color:'green'
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
 
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
