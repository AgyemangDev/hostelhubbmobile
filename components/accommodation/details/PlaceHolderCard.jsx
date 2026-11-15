import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

const PlaceHolderCard = () => {
  return (
    <View style={styles.placeholderContainer}>
    <ActivityIndicator color="#000" size="large" />
    <Text style={styles.placeholderText}>Loading image...</Text>
  </View>
  )
}

const styles = StyleSheet.create({
    placeholderContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
      },
      placeholderText: {
        marginTop: 10,
        color: "#888",
      },
})
export default PlaceHolderCard