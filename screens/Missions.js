import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const MissionScreen = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  const fetchMissions = async () => {
    try {
      const response = await axios.get('https://military-lp8n.onrender.com/api/v1/mission/', {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQxMTg3OTg5LCJleHAiOjE3NDM3Nzk5ODl9.ItO_SzaQC6xNOo6reI_HdXX3M_i1q01PFXlzkF5Eq08',
        },
      });
      setMissions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching missions', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // Render each mission item
  const renderMissionItem = ({ item }) => (
    <TouchableOpacity style={styles.missionContainer} activeOpacity={0.7}>
      <View style={styles.card}>
        <Image
          source={{ uri: item.country.flag_url }}
          style={styles.countryFlag}
        />
        <View style={styles.cardContent}>
          <Text style={styles.missionName}>{item.name}</Text>
          <Text style={styles.missionLocation}>{item.location}</Text>
          <Text style={styles.missionStatus}>Status: {item.status}</Text>
          <Text style={styles.missionDescription}>{item.description}</Text>
          <Text style={styles.missionDates}>
            From: {new Date(item.start_date).toLocaleDateString()} To: {new Date(item.end_date).toLocaleDateString()}
          </Text>
          <Text style={styles.creatorName}>
            Created by: {item.creator.firstname} {item.creator.lastname}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMissionItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#777',
    marginTop: 50,
  },
  missionContainer: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    width: 60,
    height: 40,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardContent: {
    flex: 1,
  },
  missionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  missionLocation: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  missionStatus: {
    fontSize: 16,
    color: '#4CAF50', // Green for "active" or "completed" status
    marginBottom: 5,
  },
  missionDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
    lineHeight: 20,
  },
  missionDates: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  creatorName: {
    fontSize: 14,
    color: '#444',
  },
});

export default MissionScreen;
