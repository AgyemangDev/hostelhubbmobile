import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../../constants/Colors';

const TEAL_LIGHT = '#E1F5EE';
const TEAL_DARK = '#085041';

const STEPS = [
  {
    n: 1,
    icon: 'share-2',
    title: 'Share your code with a host',
    sub: 'Know anyone looking to list their accommodation? Send them your code before they sign up.',
  },
  {
    n: 2,
    icon: 'user-check',
    title: 'They register with your code',
    sub: "They enter it once during signup — you're permanently linked to every booking they ever receive.",
  },
  {
    n: 3,
    icon: 'trending-up',
    title: 'Earn on every booking they get',
    sub: 'You receive a commission on each successful booking at their accommodation — no extra work needed.',
  },
];

const HowItWorks = () => {
  return (
    <View>
      {/* Intro card */}
      <View style={s.introCard}>
        <Icon name="info" size={15} color={COLORS.teal} />
        <Text style={s.introText}>
          Refer once. Earn forever. Your code stays linked to every host you
          bring in — permanently.
        </Text>
      </View>

      {/* Steps */}
      {STEPS.map(({ n, icon, title, sub }, i) => (
        <View key={n} style={s.stepRow}>
          <View style={s.stepLeft}>
            <View style={s.stepDot}>
              <Icon name={icon} size={14} color={COLORS.teal} />
            </View>
            {i < STEPS.length - 1 && <View style={s.stepLine} />}
          </View>

          <View style={s.stepText}>
            <Text style={s.stepNum}>Step {n}</Text>
            <Text style={s.stepTitle}>{title}</Text>
            <Text style={s.stepSub}>{sub}</Text>
          </View>
        </View>
      ))}

      {/* Earnings estimator */}
      <View style={s.estimatorBox}>
        <View style={s.estimatorHeader}>
          <Icon name="trending-up" size={14} color={COLORS.teal} />
          <Text style={s.estimatorHeaderText}>What could you earn?</Text>
        </View>

        <Text style={s.hintText}>
          One referral can pay you continuously. A host with just{' '}
          <Text style={s.hintBold}>10 bookings</Text> could put over{' '}
          <Text style={s.hintBold}>GHS 600</Text> in your pocket.
        </Text>

        <View style={s.divider} />

        <Text style={s.footnote}>
          Estimates based on your referred host&apos;s booking activity.
        </Text>
      </View>
    </View>
  );
};

export default HowItWorks;

const s = StyleSheet.create({
  introCard: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },

  introText: {
    flex: 1,
    fontSize: 13,
    color: TEAL_DARK,
    lineHeight: 19,
  },

  stepRow: {
    flexDirection: 'row',
    gap: 14,
  },

  stepLeft: {
    alignItems: 'center',
  },

  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: TEAL_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: TEAL_LIGHT,
    minHeight: 20,
    marginVertical: 6,
  },

  stepText: {
    flex: 1,
    paddingBottom: 24,
    paddingTop: 4,
  },

  stepNum: {
    fontSize: 10,
    color: COLORS.teal,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 3,
  },

  stepSub: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },

  estimatorBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },

  estimatorHeader: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 8,
  },

  estimatorHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },

  hintText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
    marginBottom: 16,
  },

  hintBold: {
    fontWeight: '600',
    color: TEAL_DARK,
  },

  divider: {
    height: 0.5,
    backgroundColor: '#E0E0E0',
    marginVertical: 14,
  },

  footnote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 4,
  },
});