import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";

const MissionScreen = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error retrieving token", error);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (token) fetchMissions();
  }, [token]);

  const fetchMissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${REACT_APP_BASE_URL}/api/v1/mission/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMissions(response.data.data);
    } catch (error) {
      setError("Failed to load missions. Please try again.");
      console.error("Error fetching missions", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "#4CAF50",
      pending: "#FFC107",
      completed: "#2196F3",
    };
    return colors[status.toLowerCase()] || "#777";
  };

  const renderMissionItem = ({ item }) => (
    <View style={styles.missionContainer}>
      <View style={styles.card}>
      
        <View style={styles.cardContent}>
          <Text style={styles.missionName}>{item.name}</Text>
          <Text style={styles.missionLocation}>{item.location}</Text>
          <Text style={[styles.missionStatus, { color: getStatusColor(item.status) }]}>
            Status: {item.status}
          </Text>
          <Text style={styles.missionDescription}>{item.description}</Text>
          <Text style={styles.missionDates}>
            From: {new Date(item.start_date).toLocaleDateString()} To: {new Date(item.end_date).toLocaleDateString()}
          </Text>
          <Text style={styles.creatorName}>
            Created by: {item.creator.firstname} {item.creator.lastname}
          </Text>
          {/* Button to open modal */}
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              setSelectedCountry(item.country);
              setModalVisible(true);
            }}
          >
            <Text style={styles.infoButtonText}>View Country Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
       <Text style={styles.header}>Missions</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMissionItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal for country info */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedCountry && (
              <>
                <Text style={styles.modalTitle}>{selectedCountry.common_name}</Text>
                <Image source={{ uri: selectedCountry.flag_url }} style={styles.modalFlag} />
                <Text style={styles.modalText}>Official Name: {selectedCountry.official_name}</Text>
                <Text style={styles.modalText}>Region: {selectedCountry.region}</Text>
                <Text style={styles.modalText}>Capital: {selectedCountry.capital}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    padding: 12,
    flex: 1,
    backgroundColor: "#c7fcd0",
  },
    header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginBottom: 16,
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
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginTop: 20,
  },
  missionContainer: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 60,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardContent: {
    flex: 1,
  },
  missionName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  missionLocation: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  missionStatus: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  missionDescription: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
    lineHeight: 20,
  },
  missionDates: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  infoButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#c7fcd0",
    borderRadius: 8,
    alignItems: "center",
  },
  infoButtonText: {
    color: "green",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalFlag: {
    width: 80,
    height: 50,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#ff4444",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MissionScreen;
