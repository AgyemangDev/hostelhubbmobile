import { StyleSheet, Text, View, TextInput ,  TouchableWithoutFeedback, Keyboard} from 'react-native'
import React, { useState } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import COLORS from '../constants/Colors';

const SearchInput = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    // Function to handle the tap event outside the TextInput
    const handleOutsidePress = () => {
      Keyboard.dismiss(); // Hide the keyboard
      setIsDisabled(true); // Disable the TextInput
    };
  
  return (
    <>
    <View style={styles.container}>
    
    <Feather name="search" size={20} color={COLORS.background} style={styles.icon} />
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
    <TextInput
      style={styles.input}
      placeholder="Search"
      placeholderTextColor={COLORS.background}
       selectionColor="#B2BEB5"
       editable={!isDisabled}
    />
    </TouchableWithoutFeedback>
  </View>
  </>
  )
}

export default SearchInput

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: 20,
      padding: 25,
      paddingHorizontal: 10,
      width: 390,
      paddingVertical: 1,
      margin: 3,
      marginLeft: 9,
      marginBottom: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingHorizontal: 10,
      height: 40,
    },
    icon: {
      marginRight: 10,
    },
  });