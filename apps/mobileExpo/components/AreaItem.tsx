import React, { useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Area } from '@/types/';
import { StyleSheet } from 'react-native';

export const AreaItem = React.memo(({ item, toggleAreaStatus, getIconName }: { item: Area; toggleAreaStatus: (id: string) => void; getIconName: (type: string) => string }) => {
  const theme = useTheme();
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.cardContainer, { opacity, transform: [{ translateY }] }]}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name={getIconName(item.action.informations.type)} size={24} color={theme.colors.primary} />
            <Title style={styles.cardTitle}>{`${item.action.informations.type} → ${item.reaction.informations.type}`}</Title>
          </View>
          <Paragraph style={styles.cardStatus}>
            Statut:{' '}
            <Paragraph
              style={{
                color: item.active ? theme.colors.primary : theme.colors.error,
              }}
            >
              {item.active ? 'Actif' : 'Inactif'}
            </Paragraph>
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
});

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cardStatus: {
    marginTop: 4,
    fontSize: 14,
  },
  cardButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});
