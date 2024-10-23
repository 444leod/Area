import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Area } from '@/types/';
import { AreaItem } from '@/components/AreaItem';
import { AreaDetailsModal } from '@/components/AreaDetailsModal';

export default function DashboardScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [areas, setAreas] = useState<Area[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const router = useRouter();
  const theme = useTheme();

  const fetchAreas = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/areas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAreas(data);
      } else {
        throw new Error('Erreur lors de la récupération des AREAs');
      }
    } catch (error:any) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de récupérer vos AREAs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAreas();
    setRefreshing(false);
  }, [fetchAreas]);

  const toggleAreaStatus = async (areaId: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/areas/${areaId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAreas();
      } else if (response.status === 401) {
        throw new Error('Unauthorized: Invalid token');
      } else if (response.status === 404) {
        throw new Error('AREA not found');
      } else {
        throw new Error('Failed to toggle AREA status');
      }
    } catch (error) {
      console.error('Error toggling AREA status:', error);
      Alert.alert('Error', error.message || 'Failed to toggle AREA status');
    }
  };

  const deleteArea = async (areaId: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/areas/${areaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAreas();
      } else if (response.status === 401) {
        throw new Error('Unauthorized: Invalid token');
      } else if (response.status === 404) {
        throw new Error('AREA not found');
      } else {
        throw new Error('Failed to delete AREA');
      }
    } catch (error) {
      console.error('Error deleting AREA:', error);
      Alert.alert('Error', error.message || 'Failed to delete AREA');
    }
  };

  const getIconName = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'email':
        return 'email';
      case 'calendar':
        return 'calendar';
      case 'weather':
        return 'weather-cloudy';
      default:
        return 'puzzle';
    }
  };

  const openModal = (area: Area) => {
    setSelectedArea(area);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedArea(null);
  };

  const renderAreaItem = ({ item }: { item: Area }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <AreaItem item={item} toggleAreaStatus={toggleAreaStatus} getIconName={getIconName} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={areas}
        renderItem={renderAreaItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="inbox-outline" size={64} color={theme.colors.disabled} />
            <Paragraph style={styles.emptyText}>Aucune AREA trouvée. Créez-en une nouvelle !</Paragraph>
          </View>
        }
      />
      <AreaDetailsModal 
        visible={modalVisible} 
        hideModal={closeModal} 
        area={selectedArea} 
        toggleAreaStatus={toggleAreaStatus}
        deleteArea={deleteArea}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardStatus: {
    marginTop: 4,
  },
  cardButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#888',
  },
});