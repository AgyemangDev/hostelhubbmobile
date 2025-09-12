import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import COLORS from '../../constants/Colors'
import { Image } from 'react-native'
import { Link } from 'expo-router'

const Button = (props) => {
  return (
    
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
        <View style={{ flexDirection: 'row'}}>
        <Text style={{ fontSize: 14, color: '#000', marginTop: 9}}>{props.text}</Text>
        <Image source={props.imageUrl} style={{ height: 20, width: 20, top: 6}}/>
        
        </View>
        
    </TouchableOpacity>
    
  )
}

export default Button

const styles = StyleSheet.create({
    button:{
        backgroundColor: '#fff',
        height: 50,
        width: 120,
        borderRadius: 25,
        marginVertical: 10,
        paddingBottom: 12,
        borderWidth: 0.5,
        borderColor: COLORS.light,
        justifyContent: 'center',
        alignItems: 'center'
    }
})