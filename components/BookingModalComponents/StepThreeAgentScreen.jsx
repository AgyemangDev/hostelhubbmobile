import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/Colors';

const StepThreeAgentScreen = ({ formData, handleInputChange }) => {
  const [usedAgent, setUsedAgent] = useState(formData.usedAgent ?? null); // null by default

  const handleAgentResponse = (response) => {
    const didUseAgent = response === 'yes';
    setUsedAgent(didUseAgent);
    handleInputChange('usedAgent', didUseAgent);
    if (!didUseAgent) {
      handleInputChange('agentCode', '');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/agent.gif')} // fallback with PNG recommended if not animating
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.question}>Did you use an Agent to assist you with this booking?</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, usedAgent === true && styles.selected]}
          onPress={() => handleAgentResponse('yes')}
        >
          <Text style={[styles.optionText, usedAgent === true && styles.optionTextSelected]}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, usedAgent === false && styles.selected]}
          onPress={() => handleAgentResponse('no')}
        >
          <Text style={[styles.optionText, usedAgent === false && styles.optionTextSelected]}>No</Text>
        </TouchableOpacity>
      </View>

      {usedAgent === true && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Agent Code</Text>
          <TextInput
            placeholder="e.g. AGT12345"
            placeholderTextColor="#888"
            value={formData.agentCode}
            onChangeText={(text) => handleInputChange('agentCode', text)}
            style={styles.input}
          />
        </View>
      )}
    </View>
  );
};

export default StepThreeAgentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 220,
    height: 160,
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: COLORS.button,
  },
  optionText: {
    color: '#333',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
    marginTop: 10,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
});
