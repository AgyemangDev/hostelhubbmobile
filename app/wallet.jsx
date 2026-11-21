// /wallet — referral earnings balance and protected withdrawals.
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Linking, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { UserContext } from "../context/UserContext";
import { WalletContext } from "../context/WalletContext";
import { Button, Chip, Eyebrow, Notice, ScreenHeader, Section, Text, TextField, KeyboardView } from "../components/ui";
import PayoutMethodForm from "../components/forms/wallet/PayoutMethodForm";
import PayoutAccountCard from "../components/cards/wallet/PayoutAccountCard";
import WithdrawalRow from "../components/lists/wallet/WithdrawalRow";
import { money } from "../utils/formatMoney";
import { colors, space } from "../constants/theme";
import { getPayoutMethod, listWithdrawals, requestWithdrawal } from "../services/walletService";

const FALLBACK_SUPPORT = "https://wa.me/233245746198";


export default function WalletScreen() {
  const { user } = useContext(UserContext);
  const { balance, refetchBalance } = useContext(WalletContext);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [method, setMethod] = useState(null);
  const [limits, setLimits] = useState(null);
  const [supportUrl, setSupportUrl] = useState(FALLBACK_SUPPORT);
  const [history, setHistory] = useState([]);
  const [editing, setEditing] = useState(false);

  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { tone, title, body, support }

  const load = useCallback(async () => {
    try {
      const [m, w] = await Promise.all([getPayoutMethod(user), listWithdrawals(user)]);
      setMethod(m.payoutMethod);
      setLimits(m.limits);
      if (m.supportUrl) setSupportUrl(m.supportUrl);
      setHistory(w.withdrawals || []);
    } catch (err) {
      setResult({ tone: "danger", title: "Couldn't load your wallet", body: err.message, support: err.supportUrl });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const onRefresh = () => {
    setRefreshing(true);
    refetchBalance?.();
    load();
  };

  const parsedAmount = Number(amount);
  const amountError = useMemo(() => {
    if (!amount) return null;
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return "Enter an amount";
    if (limits && parsedAmount < limits.min) return `The minimum is GH₵${limits.min}`;
    if (limits && parsedAmount > limits.max) return `The maximum per withdrawal is GH₵${limits.max}`;
    if (parsedAmount > balance) return "That's more than your balance";
    return null;
  }, [amount, parsedAmount, limits, balance]);

  const inFlight = history.some((h) => h.status === "processing");

  const withdraw = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const { withdrawal } = await requestWithdrawal(user, parsedAmount);
      setAmount("");
      setResult({
        tone: "success",
        title: withdrawal.status === "success" ? "Withdrawal sent" : "Withdrawal on its way",
        body: `${money(withdrawal.amount)} to ${method.bank_name} ${method.account_number}. We'll notify you when it lands.`,
      });
      refetchBalance?.();
      load();
    } catch (err) {
      setResult({
        tone: err.supportUrl ? "warning" : "danger",
        title: err.supportUrl ? "We can't process this right now" : "Withdrawal not started",
        body: err.message,
        support: err.supportUrl,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScreenHeader title="Wallet" />
        <View style={styles.center}>
          <Text tone="secondary">Log in to see your wallet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Wallet" />
      <KeyboardView>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.balanceBlock}>
          <Eyebrow>AVAILABLE BALANCE</Eyebrow>
          <Text style={styles.balance} accessibilityLabel={`Available balance ${money(balance)}`}>
            {money(balance)}
          </Text>
          <Text variant="caption" tone="secondary">From referral rewards</Text>
        </View>

        {result ? (
          <Notice
            tone={result.tone}
            title={result.title}
            action={
              result.support ? (
                <Button
                  title="Chat with customer care"
                  icon="logo-whatsapp"
                  variant="secondary"
                  onPress={() => Linking.openURL(result.support)}
                />
              ) : null
            }
          >
            {result.body}
          </Notice>
        ) : null}

        {loading ? (
          <ActivityIndicator color={colors.brand} style={{ marginTop: space.xl }} />
        ) : !method || editing ? (
          <PayoutMethodForm
            user={user}
            onSaved={(m) => {
              setMethod(m);
              setEditing(false);
              setResult({
                tone: "success",
                title: "Payout account saved",
                body: `For your security, withdrawals to a new account open after ${limits?.payoutChangeCooldownHours ?? 24} hours.`,
              });
            }}
            onCancel={method ? () => setEditing(false) : null}
          />
        ) : (
          <>
            <PayoutAccountCard method={method} onChange={() => setEditing(true)} />

            <View style={{ gap: space.sm }}>
              <TextField
                label="Amount to withdraw (GH₵)"
                value={amount}
                onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ""))}
                keyboardType="decimal-pad"
                placeholder="0.00"
                error={amountError}
                hint={limits ? `Between GH₵${limits.min} and GH₵${limits.max}. Up to GH₵${limits.dailyMax} a day.` : null}
              />
              <View style={styles.chips}>
                {[50, 100, 200].map((v) => (
                  <Chip key={v} label={`GH₵ ${v}`} accessibilityLabel={`Withdraw GH₵${v}`} onPress={() => setAmount(String(Math.min(v, balance)))} />
                ))}
                <Chip label="All" accessibilityLabel="Withdraw all" onPress={() => setAmount(String(balance))} />
              </View>
              <Button
                title={inFlight ? "A withdrawal is processing" : "Withdraw"}
                onPress={withdraw}
                loading={submitting}
                disabled={!amount || Boolean(amountError) || inFlight}
              />
            </View>
          </>
        )}

        <Section title="Withdrawals" gap={space.sm}>
          {history.length === 0 ? (
            <Text variant="caption" tone="secondary">No withdrawals yet.</Text>
          ) : (
            history.map((h, i) => <WithdrawalRow key={h.id} withdrawal={h} first={i === 0} />)
          )}
        </Section>

        <Button
          title="Problem with a withdrawal? Chat with customer care"
          variant="ghost"
          size="sm"
          icon="logo-whatsapp"
          onPress={() => Linking.openURL(supportUrl)}
          style={{ alignSelf: "flex-start" }}
        />
      </ScrollView>
      </KeyboardView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl },
  content: { padding: space.lg, paddingTop: space.xs, gap: space.xl, paddingBottom: space.xxxl },
  balanceBlock: { gap: 4, paddingVertical: space.sm },
  balance: { fontSize: 40, lineHeight: 46, fontWeight: "800", color: colors.text, letterSpacing: -0.8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: space.xs },
});
