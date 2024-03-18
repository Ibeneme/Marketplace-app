import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#808080"
        {...props}
      />
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontFamily: 'Regular',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 4,
    fontFamily: 'Medium',
    width: 'auto',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 3,
    marginBottom: 8,
    fontFamily: 'Regular',
  },
});

export default CustomTextInput;
