import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../../constants/Colors';

const TEAL_LIGHT = '#E1F5EE';

const EarningsList = ({ earnings }) => {
  if (!earnings.length) return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <Icon name="trending-up" size={28} color={COLORS.teal} />
      </View>
      <Text style={s.emptyTitle}>No earnings yet</Text>
      <Text style={s.emptyText}>
        Refer your first host to start earning. Once they receive a paid booking, your commission shows up here automatically.
      </Text>
    </View>
  );


  return (
    <View>

      {earnings.map(e => (
        <View key={e.id} style={s.earnCard}>
          <View style={s.earnLeft}>
            <View style={s.earnIcon}>
              <Icon name="check-circle" size={16} color={COLORS.teal} />
            </View>
          </View>
          <View style={s.earnBody}>
            <View style={s.earnTop}>
              <Text style={s.earnRef}>Booking #{e.booking_id?.slice(-6)}</Text>
              <Text style={s.earnAmount}>+GHS {Number(e.commission_amount).toFixed(2)}</Text>
            </View>
            <Text style={s.earnMeta}>Booking value: GHS {Number(e.booking_amount).toFixed(2)}</Text>
            <Text style={s.earnDate}>
              {new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default EarningsList;

const s = StyleSheet.create({
  summaryCard:  { backgroundColor: COLORS.teal, borderRadius: 14, padding: 18, marginBottom: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.5, marginBottom: 4 },
  summaryValue: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 2 },
  summaryCount: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },

  earnCard:     { flexDirection: 'row', gap: 12, backgroundColor: '#f9f9f9', borderRadius: 12,
                  padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: '#ececec' },
  earnLeft:     { justifyContent: 'center' },
  earnIcon:     { width: 34, height: 34, borderRadius: 17, backgroundColor: TEAL_LIGHT,
                  alignItems: 'center', justifyContent: 'center' },
  earnBody:     { flex: 1 },
  earnTop:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  earnRef:      { fontSize: 14, fontWeight: '600', color: '#111' },
  earnAmount:   { fontSize: 14, fontWeight: '700', color: COLORS.teal },
  earnMeta:     { fontSize: 12, color: '#777', marginBottom: 2 },
  earnDate:     { fontSize: 11, color: '#aaa' },

  empty:        { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  emptyIcon:    { width: 60, height: 60, borderRadius: 30, backgroundColor: TEAL_LIGHT,
                  alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle:   { fontSize: 16, fontWeight: '600', color: '#222', marginBottom: 8 },
  emptyText:    { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20 },
});