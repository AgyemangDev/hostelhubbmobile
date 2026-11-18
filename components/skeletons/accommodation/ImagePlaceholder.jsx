import { colors } from "../../../constants/theme";
import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

const PlaceHolderCard = () => {
  return (
    <View style={styles.placeholderContainer}>
    <ActivityIndicator color={colors.text} size="large" />
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
        backgroundColor: colors.fill,
        borderRadius: 10,
      },
      placeholderText: {
        marginTop: 10,
        color: colors.textMuted,
      },
})
export default PlaceHolderCard