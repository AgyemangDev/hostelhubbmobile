import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Share,
  ActivityIndicator,
} from 'react-native';
import { UserContext } from '../../../context/UserContext';
import API_BASE_URL from '../../../utils/api/api';
import COLORS from '../../../constants/Colors';

import ReferralHero from '../../../components/Hero/ReferralHero';
import ReferralTabs from '../../../components/Tabs/ReferralTabs';
import HowItWorks from '../../../components/UI/HowItWorks';
import EarningsList from '../../../components/ShortlistComponents/EarningsList';
import HostsList from '../../../components/ShortlistComponents/HostList';

const ReferralProgram = () => {
  const { userInfo, user } = useContext(UserContext);

  const [tab, setTab] = useState('how');
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    user
      .getIdToken(false)
      .then(token =>
        fetch(`${API_BASE_URL}/api/referral/earnings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
      .then(r => r.json())
      .then(data => {
        setEarnings(data.earnings || []);
        setHosts(data.hosts || []);
        setTotal(data.total || 0);
      })
      .catch(err => console.error('Referral fetch failed:', err))
      .finally(() => setLoading(false));
  }, [user]);

  const shareCode = async () => {
    await Share.share({
      message: `🏡 I'm building passive income on Hostelhubb! Use my referral code ${userInfo?.referral_code} when you sign up as a host — you list, I earn.\n\nhttps://hostelhubb.com`,
    });
  };

  const totalBookings = hosts.reduce(
    (sum, host) => sum + (host.paidBookings || 0),
    0
  );

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ReferralHero
          referralCode={userInfo?.referral_code}
          hostsCount={hosts.length}
          totalBookings={totalBookings}
          total={total}
          onShare={shareCode}
        />

        <ReferralTabs tab={tab} setTab={setTab} />

        <View style={s.content}>
          {tab === 'how' && <HowItWorks />}

          {tab === 'earnings' &&
            (loading ? (
              <ActivityIndicator color={COLORS.teal} style={{ marginTop: 48 }} />
            ) : (
              <EarningsList earnings={earnings} />
            ))}

          {tab === 'hosts' &&
            (loading ? (
              <ActivityIndicator color={COLORS.teal} style={{ marginTop: 48 }} />
            ) : (
              <HostsList hosts={hosts} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralProgram;

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
});