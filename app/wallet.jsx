// /wallet — referral earnings balance and protected withdrawals.
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import { WalletContext } from "../context/WalletContext";
import { Button, Card, Divider, Notice, ScreenHeader, Segmented, TextField } from "../components/ui/ds";
import { colors, radius, space, type } from "../constants/theme";
import {
  getPayoutMethod,
  listPayoutBanks,
  listWithdrawals,
  requestWithdrawal,
  savePayoutMethod,
} from "../services/walletService";

const money = (n) => `GH₵ ${Number(n || 0).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const FALLBACK_SUPPORT = "https://wa.me/233245746198";

const STATUS = {
  processing: { label: "Processing", color: colors.warningText, bg: colors.warningBg },
  success: { label: "Sent", color: colors.success, bg: colors.successBg },
  failed: { label: "Failed, refunded", color: colors.danger, bg: colors.dangerBg },
  reversed: { label: "Reversed, refunded", color: colors.danger, bg: colors.dangerBg },
};

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
          <Text style={[type.body, { color: colors.textSecondary }]}>Log in to see your wallet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Wallet" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.brand} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.balanceBlock}>
          <Text style={[type.label, { color: colors.textSecondary }]}>AVAILABLE BALANCE</Text>
          <Text style={styles.balance} accessibilityLabel={`Available balance ${money(balance)}`}>
            {money(balance)}
          </Text>
          <Text style={[type.caption, { color: colors.textSecondary }]}>From referral rewards</Text>
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
            <Card>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[type.label, { color: colors.textSecondary }]}>PAY OUT TO</Text>
                  <Text style={type.bodyStrong}>{method.account_name}</Text>
                  <Text style={[type.caption, { color: colors.textSecondary }]}>
                    {method.bank_name} · {method.account_number}
                  </Text>
                </View>
                <Button title="Change" variant="ghost" onPress={() => setEditing(true)} style={{ minHeight: 44 }} />
              </View>
            </Card>

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
                  <Pressable
                    key={v}
                    onPress={() => setAmount(String(Math.min(v, balance)))}
                    style={styles.chip}
                    accessibilityRole="button"
                    accessibilityLabel={`Withdraw GH₵${v}`}
                  >
                    <Text style={[type.caption, { fontWeight: "700" }]}>GH₵ {v}</Text>
                  </Pressable>
                ))}
                <Pressable onPress={() => setAmount(String(balance))} style={styles.chip} accessibilityRole="button">
                  <Text style={[type.caption, { fontWeight: "700" }]}>All</Text>
                </Pressable>
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

        <View style={{ gap: space.sm }}>
          <Text style={type.heading}>Withdrawals</Text>
          {history.length === 0 ? (
            <Text style={[type.caption, { color: colors.textSecondary }]}>No withdrawals yet.</Text>
          ) : (
            history.map((h, i) => {
              const s = STATUS[h.status] || STATUS.processing;
              return (
                <View key={h.id}>
                  {i > 0 ? <Divider /> : null}
                  <View style={[styles.rowBetween, { paddingVertical: space.sm }]}>
                    <View style={{ gap: 2 }}>
                      <Text style={type.bodyStrong}>{money(h.amount)}</Text>
                      <Text style={[type.caption, { color: colors.textSecondary }]}>
                        {new Date(h.created_at).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}
                        {h.payout_snapshot?.bank_name ? ` · ${h.payout_snapshot.bank_name}` : ""}
                      </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: s.bg }]}>
                      <Text style={[type.label, { color: s.color }]}>{s.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <Pressable onPress={() => Linking.openURL(supportUrl)} style={styles.helpRow} accessibilityRole="link">
          <Ionicons name="logo-whatsapp" size={18} color={colors.text} />
          <Text style={[type.caption, { fontWeight: "700", textDecorationLine: "underline" }]}>
            Problem with a withdrawal? Chat with customer care
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function PayoutMethodForm({ user, onSaved, onCancel }) {
  const [kind, setKind] = useState("mobile_money");
  const [banks, setBanks] = useState([]);
  const [bankCode, setBankCode] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBanks([]);
    setBankCode(null);
    listPayoutBanks(user, kind)
      .then((d) => setBanks(d.banks || []))
      .catch((e) => setError(e.message));
  }, [user, kind]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const { payoutMethod } = await savePayoutMethod(user, { type: kind, bankCode, accountNumber, accountName });
      onSaved(payoutMethod);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card style={{ gap: space.md }}>
      <View style={{ gap: 4 }}>
        <Text style={type.heading}>Where should we send your money?</Text>
        <Text style={[type.caption, { color: colors.textSecondary }]}>
          Payouts go only to an account in your own name.
        </Text>
      </View>
      <Segmented
        value={kind}
        onChange={setKind}
        options={[
          { value: "mobile_money", label: "Mobile money" },
          { value: "ghipss", label: "Bank account" },
        ]}
      />
      <View style={{ gap: 6 }}>
        <Text style={[type.caption, { fontWeight: "700" }]}>{kind === "mobile_money" ? "Network" : "Bank"}</Text>
        {banks.length === 0 ? (
          <ActivityIndicator color={colors.brand} style={{ alignSelf: "flex-start" }} />
        ) : (
          <View style={styles.chips}>
            {banks.map((b) => {
              const selected = b.code === bankCode;
              return (
                <Pressable
                  key={b.code}
                  onPress={() => setBankCode(b.code)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[type.caption, { fontWeight: "700", color: selected ? colors.onBrand : colors.text }]}>
                    {b.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
      <TextField
        label={kind === "mobile_money" ? "Mobile money number" : "Account number"}
        value={accountNumber}
        onChangeText={(t) => setAccountNumber(t.replace(/[^0-9]/g, ""))}
        keyboardType="number-pad"
        placeholder={kind === "mobile_money" ? "024 000 0000" : "Account number"}
      />
      <TextField
        label="Name on the account"
        value={accountName}
        onChangeText={setAccountName}
        autoCapitalize="words"
        hint="We check this with your provider where we can."
      />
      {error ? <Notice tone="danger">{error}</Notice> : null}
      <Button title="Save payout account" onPress={save} loading={saving} disabled={!bankCode || accountNumber.length < 9} />
      {onCancel ? <Button title="Cancel" variant="ghost" onPress={onCancel} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl },
  content: { padding: space.lg, paddingTop: space.xs, gap: space.xl, paddingBottom: space.xxxl },
  balanceBlock: { gap: 4, paddingVertical: space.sm },
  balance: { fontSize: 40, lineHeight: 46, fontWeight: "800", color: colors.text, letterSpacing: -0.8 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: space.xs },
  chip: {
    minHeight: 40,
    paddingHorizontal: space.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: { backgroundColor: colors.text, borderColor: colors.text },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  helpRow: { flexDirection: "row", alignItems: "center", gap: space.xs, minHeight: 44 },
});
