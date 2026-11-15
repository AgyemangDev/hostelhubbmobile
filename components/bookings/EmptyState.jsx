// components/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import Empty from "../../assets/images/Empty.gif"

const EmptyState = ({ message }) => (
  <View style={styles.emptyContainer}>
  <Image source={Empty} style={styles.emptyImage} />
  <Text style={styles.emptyText}>{message}</Text>
</View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white',
    flex:1,
    paddingBottom:100
  },
  emptyImage: {
    width: 250, 
    height: 250, 
    resizeMode: 'contain',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    fontWeight:"bold"
  },
});

export default EmptyState;
