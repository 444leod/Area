import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl, Animated, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Area } from '@/types/';
import { AreaItem } from '@/components/AreaItem';

export default function DashboardScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [areas, setAreas] = useState<Area[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
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
      if (response.ok) {
        const data = await response.json();
        console.log('AREAs:', JSON.stringify(data));
        setAreas(data);
      } else {
        throw new Error('Erreur lors de la récupération des AREAs');
      }
    } catch (error) {
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

  const renderAreaItem = ({ item }: { item: Area }) => (
    <AreaItem item={item} toggleAreaStatus={toggleAreaStatus} getIconName={getIconName} />
  );

  const toggleAreaStatus = async (areaId: string) => {
    // Implémentez ici la logique pour activer/désactiver une AREA
    console.log('Toggling status for AREA:', areaId);
    // Après avoir changé le statut, rechargez les AREAs
    await fetchAreas();
  };

  const getIconName = (type: string): string => {
    // Ajoutez ici plus de correspondances entre les types et les icônes
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