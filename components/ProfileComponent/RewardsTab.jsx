import React, { useContext, useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { UserContext } from "../../context/UserContext";
import { WalletContext } from "../../context/WalletContext";
import API_BASE_URL from "../../utils/api/api";
import COLORS from "../../constants/Colors";
import BalanceDisplay from "./BalanceDisplay";
import EarningsList from "../ShortlistComponents/EarningsList";

// Wallet balance (referral commissions only, since deposits were retired)
// plus the underlying earnings ledger that built it up — the two halves of
// "rewards" that used to be split across a removed deposit tab and the
// separate Referral Program screen.
const RewardsTab = () => {
  const { user } = useContext(UserContext);
  const { balance, isLoading: walletLoading } = useContext(WalletContext);

  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    user
      .getIdToken(false)
      .then((token) =>
        fetch(`${API_BASE_URL}/api/referral/earnings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      )
      .then((r) => r.json())
      .then((data) => setEarnings(data.earnings || []))
      .catch((err) => console.error("[RewardsTab] earnings fetch failed:", err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <ScrollView style={s.root} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <BalanceDisplay balance={balance} title="Referral Rewards" />

      {loading || walletLoading ? (
        <ActivityIndicator color={COLORS.teal} style={{ marginTop: 24 }} />
      ) : (
        <EarningsList earnings={earnings} />
      )}
    </ScrollView>
  );
};

const s = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
});

export default RewardsTab;
