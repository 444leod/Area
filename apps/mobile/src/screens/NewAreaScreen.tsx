import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const NewAreaScreen = ({ navigation }) => {
  const [action, setAction] = useState('');
  const [reaction, setReaction] = useState('');
  const [actionDetails, setActionDetails] = useState({});
  const [reactionDetails, setReactionDetails] = useState({});

  const handleCreateArea = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erreur', 'Non autorisé');
        return;
      }

      const newArea = {
        action: actionDetails,
        reaction: reactionDetails
      };

      const response = await fetch(`${API_URL}/areas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newArea)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Échec de la création de l'AREA: ${errorData}`);
      }

      const createdArea = await response.json();
      Alert.alert('Succès', 'Nouvelle AREA créée avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la création de l\'AREA:', error);
      Alert.alert('Erreur', 'Impossible de créer l\'AREA');
    }
  };

  const handleActionChange = (value) => {
    setAction(value);
    setActionDetails({ type: value, exampleField: '' });
  };

  const handleReactionChange = (value) => {
    setReaction(value);
    setReactionDetails({ type: value, to: '', subject: '' });
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Créer une nouvelle AREA</Title>
      <Paragraph>Choisissez une action :</Paragraph>
      <RadioButton.Group onValueChange={handleActionChange} value={action}>
        <RadioButton.Item label="EXAMPLE_ACTION" value="EXAMPLE_ACTION" />
      </RadioButton.Group>

      {action === 'EXAMPLE_ACTION' && (
        <TextInput
          label="Example Field"
          value={actionDetails.exampleField}
          onChangeText={(text) => setActionDetails({...actionDetails, exampleField: text})}
          style={styles.input}
        />
      )}

      <Paragraph>Choisissez une réaction :</Paragraph>
      <RadioButton.Group onValueChange={handleReactionChange} value={reaction}>
        <RadioButton.Item label="SEND_EMAIL" value="SEND_EMAIL" />
      </RadioButton.Group>

      {reaction === 'SEND_EMAIL' && (
        <>
          <TextInput
            label="Email To"
            value={reactionDetails.to}
            onChangeText={(text) => setReactionDetails({...reactionDetails, to: text})}
            style={styles.input}
          />
          <TextInput
            label="Email Subject"
            value={reactionDetails.subject}
            onChangeText={(text) => setReactionDetails({...reactionDetails, subject: text})}
            style={styles.input}
          />
        </>
      )}

      <Button mode="contained" onPress={handleCreateArea} style={styles.button}>
        Créer AREA
      </Button>
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
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
});

export default NewAreaScreen;