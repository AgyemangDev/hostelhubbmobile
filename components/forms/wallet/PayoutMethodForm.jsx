import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button, Card, ChipGroup, Notice, SectionHeader, Tabs, Text, TextField } from "../../ui";
import { listPayoutBanks, savePayoutMethod } from "../../../services/walletService";
import { colors, space } from "../../../constants/theme";

const KINDS = [
  { value: "mobile_money", label: "Mobile money" },
  { value: "ghipss", label: "Bank account" },
];

/** Add or change the account referral earnings are paid out to. */
export default function PayoutMethodForm({ user, onSaved, onCancel }) {
  const [kind, setKind] = useState("mobile_money");
  const [banks, setBanks] = useState([]);
  const [bankCode, setBankCode] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const isMomo = kind === "mobile_money";

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
      <SectionHeader title="Where should we send your money?" subtitle="Payouts go only to an account in your own name." />
      <Tabs variant="segmented" value={kind} onChange={setKind} options={KINDS} />
      <View style={{ gap: 6 }}>
        <Text variant="caption" style={{ fontWeight: "700" }}>{isMomo ? "Network" : "Bank"}</Text>
        {banks.length === 0 ? (
          <ActivityIndicator color={colors.brand} style={{ alignSelf: "flex-start" }} />
        ) : (
          <ChipGroup options={banks.map((b) => ({ value: b.code, label: b.name }))} value={bankCode} onToggle={setBankCode} />
        )}
      </View>
      <TextField
        label={isMomo ? "Mobile money number" : "Account number"}
        value={accountNumber}
        onChangeText={(t) => setAccountNumber(t.replace(/[^0-9]/g, ""))}
        keyboardType="number-pad"
        placeholder={isMomo ? "024 000 0000" : "Account number"}
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
