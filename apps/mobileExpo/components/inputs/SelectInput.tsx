// components/inputs/SelectInput.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CustomIcon } from '@/components/CustomIcon';

interface SelectInputProps {
    param: {
        name: string;
        details?: string;
        required?: boolean;
    };
    options: string[];
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

const SelectInput: React.FC<SelectInputProps> = ({param, options, value, updateParamValue, required, dynamicVariables = [], isAction}) => {
    const [isUsingVariable, setIsUsingVariable] = useState(false);
    const [selectedVariable, setSelectedVariable] = useState('');
    const [selectValue, setSelectValue] = useState(value);

    const selectVariables = dynamicVariables.filter(v =>
        v.type === 'string' ||
        v.type === 'enum' ||
        v.template?.toLowerCase().includes(options[0]?.toLowerCase() || '')
    );

    const selectedVariableDetails = selectedVariable ?
        selectVariables.find(v => v.name === selectedVariable) : null;

    if (isAction || selectVariables.length === 0) {
        return (
            <View style={styles.simpleContainer}>
                <Picker
                    selectedValue={selectValue}
                    onValueChange={(itemValue) => {
                        setSelectValue(itemValue);
                        updateParamValue(param.name, itemValue);
                    }}
                    style={styles.picker}
                >
                    <Picker.Item label="Select an option" value="" />
                    {options.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                    ))}
                </Picker>
                <CustomIcon
                    name="filter-outline"
                    size={20}
                    color="#666"
                    style={styles.pickerIcon}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.modeButton, isUsingVariable && styles.modeButtonActive]}
                    onPress={() => {
                        setIsUsingVariable(!isUsingVariable);
                        if (!isUsingVariable) {
                            updateParamValue(param.name, selectValue);
                            setSelectedVariable('');
                        }
                    }}
                >
                    <CustomIcon
                        name={isUsingVariable ? "variable" : "list-filter"}
                        size={20}
                        color={isUsingVariable ? "#fff" : "#000"}
                    />
                    <Text style={[styles.modeButtonText, isUsingVariable && { color: '#fff' }]}>
                        {isUsingVariable ? 'Dynamic' : 'Static'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {isUsingVariable
                            ? selectedVariable
                                ? 'Using variable'
                                : 'Select a variable'
                            : 'Choose option'}
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
                        {selectVariables.map((variable) => (
                            <Picker.Item
                                key={variable.name}
                                label={`${variable.name} - ${variable.description}`}
                                value={variable.name}
                            />
                        ))}
                    </Picker>
                </View>
            ) : (
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectValue}
                        onValueChange={(itemValue) => {
                            setSelectValue(itemValue);
                            updateParamValue(param.name, itemValue);
                        }}
                    >
                        <Picker.Item label="Select an option" value="" />
                        {options.map((option) => (
                            <Picker.Item key={option} label={option} value={option} />
                        ))}
                    </Picker>
                </View>
            )}

            {isUsingVariable && selectedVariableDetails && (
                <View style={styles.variableInfo}>
                    <CustomIcon name="check" size={16} color="#666" />
                    <Text style={styles.variableInfoText}>
                        Example: {selectedVariableDetails.template}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
    },
    simpleContainer: {
        position: 'relative',
        marginVertical: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        gap: 8,
    },
    modeButtonActive: {
        backgroundColor: '#2196F3',
    },
    modeButtonText: {
        marginLeft: 4,
    },
    badge: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 12,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginTop: 8,
    },
    picker: {
        height: 50,
    },
    pickerIcon: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    variableInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        padding: 8,
        borderRadius: 4,
        marginTop: 8,
        gap: 4,
    },
    variableInfoText: {
        fontSize: 12,
        color: '#666',
    }
});

export default SelectInput;