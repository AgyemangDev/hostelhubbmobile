import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import BecomeAgentCTA from './BecomeAgentCTA';

const AgentPageHeader = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.headerTop}>
          <FontAwesome5 name="users" size={24} color="#fff" />
          <Text style={styles.title}>Find an Agent</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    backgroundColor: COLORS.background,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  linkText: {
    color: '#fff',  
    fontWeight: '600',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});

export default AgentPageHeader;
