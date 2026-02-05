import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ExternalLink } from "@/components/ExternalLink"; 
import COLORS from '../../constants/Colors'; 

const NotificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        Agents are verified students who assist you in finding accommodation on campus.
      </Text>

      <View style={styles.linkContainer}>
        <ExternalLink href="https://hostelhubb.com/get-started">
          <View style={styles.linkDetailsContainer}>
            <Text style={styles.linkText}>Learn more/Become An Agent</Text>
          </View>
        </ExternalLink>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D3D3D3',
    paddingTop: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
    marginTop: 4
  },
  bannerText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    paddingHorizontal: 8, // add horizontal padding
    lineHeight: 20, // make it a bit easier to read
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // center the links horizontally
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap', // allow wrapping if needed on smaller devices
  },
  linkDetailsContainer: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  orText: {
    color: '#333',
    fontSize: 14,
  },
});

export default NotificationBanner;
