import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { Button, Card, Title, Paragraph, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StringInput from "@/components/inputs/StringInput";
import NumberInput from "@/components/inputs/NumberInput";
import BooleanInput from "@/components/inputs/BooleanInput";
import DateInput from "@/components/inputs/DateInput";
import TextInput from "@/components/inputs/TextInput";
import SelectInput from "@/components/inputs/SelectInput";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const NewAreaScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [services, setServices] = useState([]);
  const [triggerApp, setTriggerApp] = useState(null);
  const [actionApp, setActionApp] = useState(null);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [automationName, setAutomationName] = useState("");
  const [actionDetails, setActionDetails] = useState({ type: "", params: {} });
  const [reactionDetails, setReactionDetails] = useState({
    type: "",
    params: {},
  });
  const [dynamicVariables, setDynamicVariables] = useState([]);
  const theme = useTheme();
  const router = useRouter();

  const steps = [
    "Choose Trigger App",
    "Select Trigger",
    "Choose Action App",
    "Select Action",
    "Set up Details",
    "Test & Review",
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/services`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      Alert.alert("Error", "Failed to fetch services");
    }
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const selectApp = (app, type) => {
    if (type === "trigger") {
      setTriggerApp(app);
    } else {
      setActionApp(app);
    }
    nextStep();
  };

  const selectTriggerOrAction = (item, type) => {
    if (type === "trigger") {
      setSelectedTrigger(item);
      setActionDetails({
        type: item.type,
        params: {},
      });
      item.params.forEach((param) => {
        setActionDetails((prev) => ({
          ...prev,
          params: { ...prev.params, [param.name]: "" },
        }));
      });
      setDynamicVariables(item.variables || []);
    } else {
      setSelectedAction(item);
      setReactionDetails({
        type: item.type,
        params: {},
      });
      item.params.forEach((param) => {
        setReactionDetails((prev) => ({
          ...prev,
          params: { ...prev.params, [param.name]: "" },
        }));
      });
    }
    nextStep();
  };

  const updateParamValue = (store, paramName, value) => {
    if (store === "action") {
      setActionDetails((prev) => ({
        ...prev,
        params: { ...prev.params, [paramName]: value },
      }));
    } else {
      setReactionDetails((prev) => ({
        ...prev,
        params: { ...prev.params, [paramName]: value },
      }));
    }
  };

  const validateInputs = () => {
    const errors = [];
    if (!automationName.trim()) {
      errors.push("Automation name is required");
    }
    if (selectedTrigger?.params) {
      selectedTrigger.params.forEach((param) => {
        if (param.required && !actionDetails.params[param.name]) {
          errors.push(`Trigger parameter "${param.name}" is required`);
        }
      });
    }
    if (selectedAction?.params) {
      selectedAction.params.forEach((param) => {
        if (param.required && !reactionDetails.params[param.name]) {
          errors.push(`Action parameter "${param.name}" is required`);
        }
      });
    }
    return errors;
  };

  const handleCreateArea = async () => {
    try {
      const validationErrors = validateInputs();
      if (validationErrors.length > 0) {
        Alert.alert("Validation Error", validationErrors.join("\n"), [
          { text: "OK" },
        ]);
        return;
      }
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Not authorized");
        return;
      }

      const newArea = {
        name: automationName,
        action: { type: actionDetails.type, ...actionDetails.params },
        reaction: { type: reactionDetails.type, ...reactionDetails.params },
      };
      const response = await fetch(`${API_URL}/areas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newArea),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create automation" + data.message,
        );
      }
      Alert.alert("Success", "New AREA created successfully");
      router.back();
    } catch (error) {
      console.error("Error creating new area:", error);
      Alert.alert("Error", "Failed to create automation");
    }
  };

  const renderInput = (param, store) => {
    const value =
      store === "action"
        ? actionDetails.params[param.name]
        : reactionDetails.params[param.name];
    const updateValue = (name, newValue) =>
      updateParamValue(store, name, newValue);

    switch (param.type) {
      case "string":
        return (
          <StringInput
            key={`${store}-${param.name}`}
            param={param}
            value={value}
            updateParamValue={updateValue}
            required={param.required}
            dynamicVariables={dynamicVariables}
            isAction={store === "action"}
          />
        );
      case "number":
        return (
          <NumberInput
            key={`${store}-${param.name}`}
            param={param}
            value={value}
            updateParamValue={updateValue}
            required={param.required}
            dynamicVariables={dynamicVariables}
            isAction={store === "action"}
          />
        );
      case "date":
        return (
          <DateInput
            key={`${store}-${param.name}`}
            param={param}
            value={value}
            required={param.required}
            dynamicVariables={dynamicVariables}
            updateParamValue={updateValue}
          />
        );
      case "text":
        return (
          <TextInput
            key={`${store}-${param.name}`}
            param={param}
            value={value}
            updateParamValue={updateValue}
            required={param.required}
            dynamicVariables={dynamicVariables}
            isAction={store === "action"}
          />
        );
      case "enum":
        return (
          <SelectInput
            key={`${store}-${param.name}`}
            param={param}
            options={param.items}
            value={value}
            updateParamValue={updateValue}
            required={param.required}
            dynamicVariables={dynamicVariables}
            isAction={store === "action"}
          />
        );
      default:
        return (
          <StringInput
            key={`${store}-${param.name}`}
            param={param}
            value={value}
            updateParamValue={updateValue}
            required={param.required}
            dynamicVariables={dynamicVariables}
            isAction={store === "action"}
          />
        );
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
      case 2:
        return (
          <>
            <Title style={styles.stepTitle}>
              Choose {currentStep === 0 ? "a Trigger" : "an Action"} App
            </Title>
            {services
              .filter((app) =>
                currentStep === 0
                  ? app.actions.length > 0
                  : app.reactions.length > 0,
              )
              .map((app) => (
                <Card
                  key={app._id}
                  style={styles.appCard}
                  onPress={() =>
                    selectApp(app, currentStep === 0 ? "trigger" : "action")
                  }
                >
                  <Card.Title title={app.name} />
                </Card>
              ))}
          </>
        );
      case 1:
      case 3:
        const currentApp = currentStep === 1 ? triggerApp : actionApp;
        const items =
          currentStep === 1 ? currentApp.actions : currentApp.reactions;
        return (
          <>
            <Title style={styles.stepTitle}>
              Select {currentStep === 1 ? "Trigger" : "Action"}
            </Title>
            {items.map((item) => (
              <Button
                key={item.action_type}
                mode="outlined"
                style={styles.itemButton}
                onPress={() =>
                  selectTriggerOrAction(
                    item,
                    currentStep === 1 ? "trigger" : "action",
                  )
                }
              >
                {item.name}
              </Button>
            ))}
          </>
        );
      case 4:
        return (
          <>
            <Title style={styles.stepTitle}>Set up Details</Title>
            <StringInput
              key="automation-name"
              param={{
                name: "Automation Name",
                details: "Enter a name for your automation",
                required: true,
              }}
              value={automationName}
              updateParamValue={(_, value) => setAutomationName(value)}
              required={true}
              dynamicVariables={[]}
              isAction={true}
            />
            {selectedTrigger && (
              <>
                <Title style={styles.subtitle}>Trigger Details</Title>
                {selectedTrigger.params.map((param) =>
                  renderInput(param, "action"),
                )}
              </>
            )}
            {selectedAction && (
              <>
                <Title style={styles.subtitle}>Action Details</Title>
                {selectedAction.params.map((param) =>
                  renderInput(param, "reaction"),
                )}
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
                <Paragraph>Trigger: {selectedTrigger?.name}</Paragraph>
                <Paragraph>Action App: {actionApp?.name}</Paragraph>
                <Paragraph>Action: {selectedAction?.name}</Paragraph>
              </Card.Content>
            </Card>
            <Button
              mode="contained"
              onPress={handleCreateArea}
              style={styles.button}
            >
              Activate Automation
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={styles.card}>
        <Card.Title
          title={`Step ${currentStep + 1} of ${steps.length}`}
          subtitle={steps[currentStep]}
        />
        <Card.Content>{renderStepContent()}</Card.Content>
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
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default NewAreaScreen;
