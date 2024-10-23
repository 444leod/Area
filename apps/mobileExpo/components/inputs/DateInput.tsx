import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CustomIcon } from '@/components/CustomIcon';

type DateInputProps = {
    param: {
        name: string;
        details?: string;
        required?: boolean;
    };
    value: string;
    required?: boolean;
    dynamicVariables: Array<{
        name: string;
        type: string;
        description: string;
        template: string;
    }>;
    updateParamValue: (name: string, value: string) => void;
};

const DateInput = ({
                       param,
                       value,
                       required,
                       dynamicVariables,
                       updateParamValue,
                   }: DateInputProps) => {
    const [isUsingVariable, setIsUsingVariable] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedVariable, setSelectedVariable] = useState('');
    const [dateValue, setDateValue] = useState(value ? new Date(value) : new Date());
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    const dateVariables = dynamicVariables.filter(
        (v) =>
            v.type === 'date' ||
            v.name.toLowerCase().includes('date') ||
            v.name.toLowerCase().includes('time')
    );

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dateValue;

        if (Platform.OS === 'android') {
            setShowPicker(false);
            if (event.type === 'set') { // User clicked "OK"
                setDateValue(currentDate);
                if (pickerMode === 'date') {
                    // After picking date, show time picker
                    setPickerMode('time');
                    setShowPicker(true);
                } else {
                    // After picking time, update the value
                    updateParamValue(param.name, currentDate.toISOString());
                }
            }
        } else {
            setDateValue(currentDate);
            updateParamValue(param.name, currentDate.toISOString());
        }
    };

    const showDatePicker = () => {
        setPickerMode('date');
        setShowPicker(true);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleString();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.modeButton, isUsingVariable && styles.modeButtonActive]}
                    onPress={() => setIsUsingVariable(!isUsingVariable)}
                >
                    <CustomIcon
                        name={isUsingVariable ? "variable" : "calendar"}
                        size={20}
                        color={isUsingVariable ? "#fff" : "#000"}
                    />
                    <Text style={[
                        styles.modeButtonText,
                        isUsingVariable && { color: '#fff' }
                    ]}>
                        {isUsingVariable ? 'Dynamic' : 'Static'}
                    </Text>
                </TouchableOpacity>

                {dateVariables.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {isUsingVariable
                                ? selectedVariable
                                    ? 'Using variable'
                                    : 'Select a variable'
                                : 'Select date & time'}
                        </Text>
                    </View>
                )}
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
                        style={styles.picker}
                    >
                        <Picker.Item
                            label="Choose a date/time variable..."
                            value=""
                            color="#666"
                        />
                        {dateVariables.map((variable) => (
                            <Picker.Item
                                key={variable.name}
                                label={`${variable.name} - ${variable.description}`}
                                value={variable.name}
                            />
                        ))}
                    </Picker>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={showDatePicker}
                    style={styles.dateButton}
                >
                    <Text style={styles.dateButtonText}>
                        {value ? formatDate(new Date(value)) : 'Select date & time'}
                    </Text>
                    <CustomIcon name="calendar" size={20} color="#666" />
                </TouchableOpacity>
            )}

            {showPicker && (
                <DateTimePicker
                    value={dateValue}
                    mode={pickerMode}
                    is24Hour={true}
                    onChange={handleDateChange}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                />
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
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginTop: 8,
    },
    dateButtonText: {
        color: '#000',
    },
});

export default DateInput;