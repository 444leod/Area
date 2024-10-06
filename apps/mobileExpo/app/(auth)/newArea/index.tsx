import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, RadioButton, useTheme, Card, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { postNewArea } from '@/modules/postNewArea';

const NewAreaScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [triggerApp, setTriggerApp] = useState(null);
  const [actionApp, setActionApp] = useState(null);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [automationName, setAutomationName] = useState('');
  const [actionDetails, setActionDetails] = useState({});
  const [reactionDetails, setReactionDetails] = useState({});
  const theme = useTheme();
  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const steps = [
    'Choose Trigger App',
    'Select Trigger',
    'Choose Action App',
    'Select Action',
    'Set up Details',
    'Test & Review'
  ];

  const apps = [
    {
      id: 1,
      name: 'Example App',
      icon: '🔧',
      triggers: ['EXAMPLE_ACTION'],
      actions: []
    },
    {
      id: 2,
      name: 'Email App',
      icon: '📧',
      triggers: [],
      actions: ['SEND_EMAIL']
    }
  ];

  const nextStep = () => {
    setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  };

  const selectApp = (app, type) => {
    if (type === 'trigger') {
      setTriggerApp(app);
    } else {
      setActionApp(app);
    }
    nextStep();
  };

  const selectTriggerOrAction = (item, type) => {
    if (type === 'trigger') {
      setSelectedTrigger(item);
      setActionDetails({ type: item, exampleField: '' });
    } else {
      setSelectedAction(item);
      setReactionDetails({ type: item, to: '', subject: '' });
    }
    nextStep();
  };

  const handleCreateArea = async () => {
    const result = await postNewArea(actionDetails, reactionDetails);
    if (result.success) {
      Alert.alert('Success', 'New AREA created successfully');
      router.back();
    } else {
      Alert.alert('Error', result.message || 'Unable to create AREA');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
      case 2:
        return (
          <>
            <Title style={styles.stepTitle}>
              Choose {currentStep === 0 ? 'a Trigger' : 'an Action'} App
            </Title>
            {apps
              .filter(app => (currentStep === 0 ? app.triggers.length > 0 : app.actions.length > 0))
              .map(app => (
                <Card key={app.id} style={styles.appCard} onPress={() => selectApp(app, currentStep === 0 ? 'trigger' : 'action')}>
                  <Card.Title
                    title={app.name}
                    left={() => <MaterialCommunityIcons name="puzzle" size={24} color={theme.colors.primary} />}
                  />
                </Card>
              ))}
          </>
        );
      case 1:
      case 3:
        const currentApp = currentStep === 1 ? triggerApp : actionApp;
        const items = currentStep === 1 ? currentApp.triggers : currentApp.actions;
        return (
          <>
            <Title style={styles.stepTitle}>
              Select {currentStep === 1 ? 'Trigger' : 'Action'}
            </Title>
            {items.map(item => (
              <Button
                key={item}
                mode="outlined"
                style={styles.itemButton}
                onPress={() => selectTriggerOrAction(item, currentStep === 1 ? 'trigger' : 'action')}
              >
                {item}
              </Button>
            ))}
          </>
        );
      case 4:
        return (
          <>
            <Title style={styles.stepTitle}>Set up Details</Title>
            <TextInput
              label="Automation Name"
              value={automationName}
              onChangeText={setAutomationName}
              style={styles.input}
              mode="outlined"
            />
            {selectedTrigger === 'EXAMPLE_ACTION' && (
              <TextInput
                label="Example Field"
                value={actionDetails.exampleField}
                onChangeText={(text) => setActionDetails({...actionDetails, exampleField: text})}
                style={styles.input}
                mode="outlined"
              />
            )}
            {selectedAction === 'SEND_EMAIL' && (
              <>
                <TextInput
                  label="To"
                  value={reactionDetails.to}
                  onChangeText={(text) => setReactionDetails({...reactionDetails, to: text})}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="email-address"
                />
                <TextInput
                  label="Subject"
                  value={reactionDetails.subject}
                  onChangeText={(text) => setReactionDetails({...reactionDetails, subject: text})}
                  style={styles.input}
                  mode="outlined"
                />
              </>
            )}
          </>
        );
      case 5:
        return (
          <>
            <Title style={styles.stepTitle}>Test & Review</Title>
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Paragraph>Name: {automationName}</Paragraph>
                <Paragraph>Trigger App: {triggerApp?.name}</Paragraph>
                <Paragraph>Trigger: {selectedTrigger}</Paragraph>
                <Paragraph>Action App: {actionApp?.name}</Paragraph>
                <Paragraph>Action: {selectedAction}</Paragraph>
              </Card.Content>
            </Card>
            <Button mode="contained" onPress={handleCreateArea} style={styles.button}>
              Activate Automation
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title
          title={`Step ${currentStep + 1} of ${steps.length}`}
          subtitle={steps[currentStep]}
        />
        <Card.Content>
          {renderStepContent()}
        </Card.Content>
      </Card>
      <View style={styles.navigationButtons}>
        <Button mode="outlined" onPress={prevStep} disabled={currentStep === 0}>
          Back
        </Button>
        {currentStep < steps.length - 1 && (
          <Button mode="contained" onPress={nextStep}>
            Next
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 24,
  },
  appCard: {
    marginBottom: 12,
  },
  itemButton: {
    marginBottom: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default NewAreaScreen;