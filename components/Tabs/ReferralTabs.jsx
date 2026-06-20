import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const TABS = [
  { key: 'how',      label: 'How it works' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'hosts',    label: 'My hosts' },
];

const ReferralTabs = ({ tab, setTab }) => (
  <View style={s.tabRow}>
    {TABS.map(t => (
      <TouchableOpacity key={t.key} style={s.tab} onPress={() => setTab(t.key)} activeOpacity={0.7}>
        <Text style={[s.tabText, tab === t.key && s.tabActive]}>{t.label}</Text>
        {tab === t.key && <View style={s.tabUnderline} />}
      </TouchableOpacity>
    ))}
  </View>
);

export default ReferralTabs;

const s = StyleSheet.create({
  tabRow:      { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5', marginHorizontal: 20, marginTop: 4 },
  tab:         { flex: 1, alignItems: 'center', paddingVertical: 13 },
  tabText:     { fontSize: 13, color: '#999' },
  tabActive:   { color: COLORS.teal, fontWeight: '600' },
  tabUnderline:{ height: 2, backgroundColor: COLORS.teal, width: '80%', position: 'absolute', bottom: 0, borderRadius: 2 },
});