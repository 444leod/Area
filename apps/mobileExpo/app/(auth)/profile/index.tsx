import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button, Text, useTheme, Avatar, Card, Chip, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Area } from '@/types/';

interface UserProfile {
  _id: string;
  first_name: string;
  email: string;
  areas: Area[];
}

const Profile = () => {
  const theme = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchProfile().then(() => setRefreshing(false));
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      const rootSegment = segments[0] === '(auth)' ? '/' : '/';
      router.replace(rootSegment);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const activeAreas = profile.areas.filter(area => area.active).length;
  const totalAreas = profile.areas.length;

  return (
    <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Avatar.Text size={100} label={profile.first_name[0]} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>{profile.first_name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>
        </View>

        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalAreas}</Text>
              <Text style={styles.statLabel}>Total Areas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activeAreas}</Text>
              <Text style={styles.statLabel}>Active Areas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{((activeAreas / totalAreas) * 100).toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Active Rate</Text>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Your Areas</Text>
        {profile.areas.map(area => (
          <Card key={area._id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  {area.action.informations.type} → {area.reaction.informations.type}
                </Text>
                <Chip
                  icon={area.active ? 'check-circle' : 'close-circle'}
                  mode="outlined"
                  style={{
                    backgroundColor: area.active ? theme.colors.success : theme.colors.error,
                  }}
                >
                  {area.active ? 'Active' : 'Inactive'}
                </Chip>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.cardContent}>
                <View style={styles.cardSection}>
                  <MaterialCommunityIcons name="lightning-bolt" size={20} color={theme.colors.primary} />
                  <Text style={styles.sectionText}>Action: {area.action.informations.type}</Text>
                </View>
                <View style={styles.cardSection}>
                  <MaterialCommunityIcons name="arrow-right" size={20} color={theme.colors.secondary} />
                  <Text style={styles.sectionText}>Reaction: {area.reaction.informations.type}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}

        <Button mode="contained" onPress={handleLogout} style={styles.button} labelStyle={styles.buttonText} icon="logout">
          Log Out
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerInfo: {
    marginLeft: 20,
  },
  avatar: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  statsCard: {
    marginBottom: 20,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  divider: {
    marginVertical: 10,
  },
  cardContent: {
    marginTop: 10,
  },
  cardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionText: {
    marginLeft: 5,
    fontSize: 14,
  },
  button: {
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default Profile;
