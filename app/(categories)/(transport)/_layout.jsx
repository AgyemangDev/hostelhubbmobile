import { StyleSheet, Text, View } from 'react-native'

const _layout = () => {
  return (
    <View style={styles.container}>
      <View style={styles.messageBox}>
        <Text style={styles.title}>Coming Soon!</Text>
        <Text style={styles.subtitle}>
          We are bringing the best transport system to you in this reopening. Stay tuned.
        </Text>
      </View>
    </View>
  );
};

export default _layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  messageBox: {
    backgroundColor: '#f1f1f1',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
});
