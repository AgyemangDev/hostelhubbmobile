import React, { useCallback, useRef, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Button, Card, EmptyState, IconButton, ScreenHeader, Skeleton, StatusPill, Text, TextField } from "../../components/ui";
import ComplaintMessage from "../../components/lists/complaints/ComplaintMessage";
import studentHub from "../../services/studentHub";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUS } from "../../constants/complaints";
import { colors, radius, space } from "../../constants/theme";

/** A complaint and the conversation with the hostel. Replying reopens a resolved one. */
export default function ComplaintThread() {
  const { id } = useLocalSearchParams();
  const scroll = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await studentHub.complaint(id));
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const send = async () => {
    setSending(true);
    try {
      const res = await studentHub.replyComplaint(id, reply.trim());
      setData((d) => ({ ...d, complaint: { ...d.complaint, status: res.status }, messages: [...d.messages, res.message] }));
      setReply("");
    } catch (e) {
      Alert.alert("Couldn't send", e.message);
    } finally {
      setSending(false);
    }
  };

  if (error && !data) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScreenHeader title="Complaint" onBack={() => router.back()} />
        <EmptyState variant="fill" illustration="error" title="Couldn't load it" body={error} action={<Button title="Try again" onPress={load} />} />
      </SafeAreaView>
    );
  }
  if (!data) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScreenHeader title="Complaint" onBack={() => router.back()} />
        <View style={styles.content}><Skeleton height={160} radius={16} /><Skeleton height={60} radius={16} /></View>
      </SafeAreaView>
    );
  }

  const c = data.complaint;
  const status = COMPLAINT_STATUS[c.status] || COMPLAINT_STATUS.open;
  const category = COMPLAINT_CATEGORIES.find((x) => x.value === c.category);

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Complaint" subtitle={c.accommodation_name} onBack={() => router.back()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scroll} contentContainerStyle={styles.content} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
          <Card style={styles.card}>
            <View style={styles.pills}>
              <StatusPill label={status.label} tone={status.tone} />
              {category ? <StatusPill label={category.label} /> : null}
              {c.priority === "urgent" ? <StatusPill label="Urgent" tone="danger" /> : null}
            </View>
            <Text variant="heading">{c.title}</Text>
            <Text>{c.description}</Text>
            {c.images?.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
                {c.images.map((uri) => <Image key={uri} source={{ uri }} style={styles.photo} />)}
              </ScrollView>
            ) : null}
            <Text variant="caption" tone="secondary">{status.hint}</Text>
          </Card>
          <View style={styles.thread}>
            {data.messages.length ? data.messages.map((m) => <ComplaintMessage key={m.id} message={m} />) : (
              <Text tone="secondary" style={styles.center}>No reply yet. You'll get a notification when the hostel responds.</Text>
            )}
          </View>
        </ScrollView>
        <View style={styles.composer}>
          <TextField value={reply} onChangeText={setReply} placeholder={["resolved", "dismissed"].includes(c.status) ? "Still a problem? Reply to reopen" : "Write a message"} multiline maxLength={2000} style={styles.flex} />
          <IconButton icon="send" variant="tonal" onPress={send} disabled={!reply.trim() || sending} accessibilityLabel="Send" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceSunken },
  flex: { flex: 1 },
  content: { padding: space.md, gap: space.md },
  card: { gap: space.sm },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: space.xs },
  photos: { gap: space.xs },
  photo: { width: 120, height: 120, borderRadius: radius.md, backgroundColor: colors.fill },
  thread: { gap: space.md, paddingVertical: space.sm },
  center: { textAlign: "center" },
  composer: { flexDirection: "row", alignItems: "flex-end", gap: space.xs, padding: space.sm, backgroundColor: colors.background, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
});
