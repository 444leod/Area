import React from 'react';
import { TextInput } from 'react-native-paper';

interface NumberInputProps {
    param: { name: string };
    value: string;
    updateParamValue: (paramName: string, value: string) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ param, value, updateParamValue }) => {
    return (
        <TextInput
            label={param.name}
            value={value.toString()}
            onChangeText={(text) => {
                const number = parseFloat(text);
                if (!isNaN(number)) {
                    updateParamValue(param.name, number);
                }
            }}
            keyboardType="numeric"
            mode="outlined"
            style={{ marginBottom: 10 }}
        />
    );
};

export default NumberInput;