import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import COLORS from '../../constants/Colors';

const ReferralHero = ({ referralCode, hostsCount, totalBookings, total, onShare }) => (
  <View>
    {/* Dark teal header */}
    <View style={s.header}>
      <View style={s.headerTop}>
        <View>
          <Text style={s.headerLabel}>YOUR REFERRAL CODE</Text>
          <Text style={s.heroCode}>{referralCode || '—'}</Text>
        </View>
        <View style={s.badge}>
          <Text style={s.badgeText}>Active</Text>
        </View>
      </View>

      <Text style={s.tagline}>
        Every host you refer earns you a cut of their bookings — for life.
      </Text>

      {/* Stats row */}
      <View style={s.statRow}>
        <StatBox label="Hosts referred"  value={hostsCount} icon="users" />
        <StatBox label="Paid bookings"   value={totalBookings} icon="shopping-bag" />
        <StatBox label="GHS earned"      value={Number(total).toFixed(0)} icon="trending-up" highlight />
      </View>
    </View>

    {/* Estimated earnings hint */}
    <View style={s.earningsHint}>
      <Icon name="zap" size={15} color={COLORS.teal} />
  <Text style={s.earningsHintText}>
  One hostel referral can pay you continuously. A host with just <Text style={s.earningsHintBold}>10 bookings</Text> could put over{' '}
  <Text style={s.earningsHintBold}>GHS 600</Text> in your pocket — with even more as bookings grow.
</Text>
    </View>

    {/* Share button */}
    <TouchableOpacity style={s.shareBtn} onPress={onShare} activeOpacity={0.8}>
      <Icon name="share-2" size={16} color="#fff" />
      <Text style={s.shareBtnText}>Share my code</Text>
    </TouchableOpacity>
  </View>
);

const StatBox = ({ label, value, icon, highlight }) => (
  <View style={[s.statBox, highlight && s.statBoxHighlight]}>
    <Icon name={icon} size={14} color={highlight ? COLORS.gold : 'rgba(255,255,255,0.7)'} />
    <Text style={[s.statVal, highlight && s.statValHighlight]}>{value}</Text>
    <Text style={s.statLbl}>{label}</Text>
  </View>
);

export default ReferralHero;

const s = StyleSheet.create({
  header:       { backgroundColor: COLORS.teal, padding: 24, paddingTop: 36, paddingBottom: 28 },
  headerTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.2, marginBottom: 4 },
  heroCode:     { fontSize: 30, fontWeight: '600', color: '#fff', letterSpacing: 4 },
  badge:        { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText:    { fontSize: 12, color: '#fff', fontWeight: '500' },
  tagline:      { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 19, marginBottom: 20 },
  statRow:      { flexDirection: 'row', gap: 8 },
  statBox:      { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, alignItems: 'center', gap: 4 },
  statBoxHighlight: { backgroundColor: 'rgba(242,201,76,0.15)', borderWidth: 1, borderColor: 'rgba(242,201,76,0.3)' },
  statVal:      { fontSize: 18, fontWeight: '600', color: '#fff' },
  statValHighlight: { color: COLORS.gold },
  statLbl:      { fontSize: 10, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  earningsHint: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#E8F5EF', paddingHorizontal: 16, paddingVertical: 12 },
  earningsHintText: { flex: 1, fontSize: 13, color: '#085041', lineHeight: 19 },
  earningsHintBold: { fontWeight: '600', color: COLORS.teal },
  shareBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                  margin: 16, marginTop: 14, padding: 14, borderRadius: 12,
                  backgroundColor: COLORS.teal },
  shareBtnText: { fontSize: 15, fontWeight: '500', color: '#fff' },
});