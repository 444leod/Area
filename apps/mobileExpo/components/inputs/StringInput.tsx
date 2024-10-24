import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { CustomIcon } from "@/components/CustomIcon";

interface StringInputProps {
  param: {
    name: string;
    details?: string;
    required?: boolean;
  };
  value: string;
  updateParamValue: (paramName: string, value: string) => void;
  required?: boolean;
  dynamicVariables: Array<{
    name: string;
    type: string;
    description: string;
    template: string;
  }>;
  isAction?: boolean;
}

const StringInput: React.FC<StringInputProps> = ({
  param,
  value,
  updateParamValue,
  required,
  dynamicVariables,
  isAction,
}) => {
  const [isUsingVariable, setIsUsingVariable] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState("");

  // Filter only string variables
  const stringVariables = dynamicVariables.filter(
    (v) =>
      v.type === "string" ||
      v.type === "text" ||
      !["boolean", "number", "date"].includes(v.type),
  );

  // If this is an action input, or there are no variables, show simple input
  if (isAction || stringVariables.length === 0) {
    return (
      <TextInput
        label={param.name}
        value={value}
        onChangeText={(text) => updateParamValue(param.name, text)}
        mode="outlined"
        style={{ marginBottom: 10 }}
        required={required}
        placeholder={param.details}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            isUsingVariable && styles.modeButtonActive,
          ]}
          onPress={() => setIsUsingVariable(!isUsingVariable)}
        >
          <CustomIcon
            name={isUsingVariable ? "variable" : "form-textbox"}
            size={20}
            color={isUsingVariable ? "#fff" : "#000"}
          />
          <Text
            style={[
              styles.modeButtonText,
              isUsingVariable && { color: "#fff" },
            ]}
          >
            {isUsingVariable ? "Dynamic" : "Static"}
          </Text>
        </TouchableOpacity>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {isUsingVariable
              ? selectedVariable
                ? "Using variable"
                : "Select a variable"
              : "Enter text"}
          </Text>
        </View>
      </View>

      {isUsingVariable ? (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedVariable}
            onValueChange={(value) => {
              setSelectedVariable(value);
              if (value) {
                updateParamValue(param.name, `{{${value}}}`);
              }
            }}
          >
            <Picker.Item label="Choose a variable..." value="" />
            {stringVariables.map((variable) => (
              <Picker.Item
                key={variable.name}
                label={`${variable.name} - ${variable.description}`}
                value={variable.name}
              />
            ))}
          </Picker>
        </View>
      ) : (
        <TextInput
          label={param.name}
          value={value}
          onChangeText={(text) => updateParamValue(param.name, text)}
          mode="outlined"
          style={{ marginBottom: 0 }}
          required={required}
          placeholder={param.details}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: "#2196F3",
  },
  modeButtonText: {
    marginLeft: 4,
  },
  badge: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 8,
  },
});

export default StringInput;
