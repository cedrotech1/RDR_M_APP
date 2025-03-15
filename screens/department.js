import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, Image, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_BASE_URL } from "@env";
const DepartmentCard = () => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMembers, setShowMembers] = useState(false);
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
    const fetchDepartment = async () => {
      try {
        const response = await fetch(`${REACT_APP_BASE_URL}/api/v1/department/user`, {
          method: 'GET',
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch department details');
        }

        const data = await response.json();
        setDepartment(data); // Set the entire response as department data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDepartment();
    }
  }, [token]);

  if (loading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  const handleShowMembers = () => setShowMembers(true);
  const handleCloseMembers = () => setShowMembers(false);

  const renderMemberList = () => {
    return department.members.map((member) => (
      <View key={member.id} style={{ flexDirection: 'row', marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {member.firstname} {member.lastname}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'gray' }}>{member.role}</Text>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 1 }}>
      <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Department Information</Text>
        <Text style={{ color: 'blue', marginBottom: 10, fontSize: 16 }}>{department.name}</Text>
        <Text style={{ color: 'gray' }}>{department.description}</Text>

        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          <View style={{ width: 80, height: 80, marginRight: 10 }}>
            <Image
              source={{ uri: department.reader.image || '/assets/img/images (3).png' }}
              style={{ width: '100%', height: '100%', borderRadius: 50 }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Department Leader </Text>
            <Text>Name: {department.reader.firstname} {department.reader.lastname}</Text>
            <Text>Email: {department.reader.email}</Text>
            <Text>Phone: {department.reader.phone}</Text>
            <Text>Gender: {department.reader.gender}</Text>
            <Text>Role: {department.reader.role}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Department Members</Text>
        <Text>Total Members: {department.members.length}</Text>
        <Button title="View All Members" onPress={handleShowMembers} />
      </View>

      <Modal visible={showMembers} animationType="slide" onRequestClose={handleCloseMembers}>
        <View style={{ marginTop: 20, padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Department Members</Text>
          {renderMemberList()}
          <Button title="Close" onPress={handleCloseMembers} />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default DepartmentCard;
