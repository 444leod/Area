import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl, Animated, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Area = {
  _id: string;
  action: {
    service_id: string;
    informations: {
      type: string;
      [key: string]: any;
    };
  };
  reaction: {
    service_id: string;
    informations: {
      type: string;
      [key: string]: any;
    };
  };
  active: boolean;
};

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

  const renderAreaItem = ({ item, index }: { item: Area; index: number }) => {
    const translateY = new Animated.Value(50);
    const opacity = new Animated.Value(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    return (
      <Animated.View style={[styles.cardContainer, { opacity, transform: [{ translateY }] }]}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name={getIconName(item.action.informations.type)} size={24} color={theme.colors.primary} />
              <Title style={styles.cardTitle}>{`${item.action.informations.type} → ${item.reaction.informations.type}`}</Title>
            </View>
            <Paragraph style={styles.cardStatus}>
              Statut: <Paragraph style={{ color: item.active ? theme.colors.primary : theme.colors.error }}>{item.active ? 'Actif' : 'Inactif'}</Paragraph>
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => toggleAreaStatus(item._id)} style={styles.cardButton}>
              {item.active ? 'Désactiver' : 'Activer'}
            </Button>
          </Card.Actions>
        </Card>
      </Animated.View>
    );
  };

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
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => router.push('/(app)/newArea')}
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