import React from 'react';
import { TextInput } from 'react-native-paper';

interface StringInputProps {
    param: { name: string };
    value: string;
    updateParamValue: (paramName: string, value: string) => void;
}

const StringInput: React.FC<StringInputProps> = ({ param, value, updateParamValue }) => {
    return (
        <TextInput
            label={param.name}
            value={value}
            onChangeText={(text) => updateParamValue(param.name, text)}
            mode="outlined"
            style={{ marginBottom: 10 }}
        />
    );
};

export default StringInput;