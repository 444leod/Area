import React from "react";
import { View } from "react-native";
import { Switch, Text } from "react-native-paper";

interface BooleanInputProps {
  param: { name: string };
  value: boolean;
  updateParamValue: (paramName: string, value: boolean) => void;
}

const BooleanInput: React.FC<BooleanInputProps> = ({
  param,
  value,
  updateParamValue,
}) => {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      <Text>{param.name}</Text>
      <Switch
        value={value}
        onValueChange={(newValue) => updateParamValue(param.name, newValue)}
        style={{ marginLeft: 10 }}
      />
    </View>
  );
};

export default BooleanInput;
