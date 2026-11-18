import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExternalLink } from "@/components/ui/links/ExternalLink";
import { colors } from "../../../constants/theme";

const TermsLink = ({ link, text, color }) => {
  return (
    <ExternalLink href={link}>
      <View style={styles.linkDetailsContainer}>
        <Text style={[styles.linkText, color && { color }]}>
          {text}
        </Text>
      </View>
    </ExternalLink>
  );
};

const styles = StyleSheet.create({
  linkDetailsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: colors.brand, // Default color
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default TermsLink;
