import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

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

const DashboardScreen = ({ navigation }) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
    <Card style={styles.card}>
      <Card.Content>
        <Title>{`${item.action.informations.type} → ${item.reaction.informations.type}`}</Title>
        <Paragraph>{`Statut: ${item.active ? 'Actif' : 'Inactif'}`}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => toggleAreaStatus(item._id)}>
          {item.active ? 'Désactiver' : 'Activer'}
        </Button>
      </Card.Actions>
    </Card>
  );

  const toggleAreaStatus = async (areaId: string) => {
    // Implémentez ici la logique pour activer/désactiver une AREA
    console.log('Toggling status for AREA:', areaId);
    // Après avoir changé le statut, rechargez les AREAs
    await fetchAreas();
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Mes AREAs</Title>
      <FlatList
        data={areas}
        renderItem={renderAreaItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('NewArea')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 80, // Pour laisser de l'espace pour le FAB
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;