import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
  Linking,
} from "react-native";
import NotificationIcon from "./NotificationIcon";

const NotificationItem = ({ item, onPress }) => {
  const handleLinkPress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Don't know how to open URI: " + url);
    }
  };

  const renderMessageWithLinks = (message) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const parts = message.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <Text
            key={index}
            style={styles.linkText}
            onPress={() => handleLinkPress(part)}
          >
            {part}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  return (
    <TouchableHighlight
      style={[styles.card, item.read ? styles.read : styles.unread]}
      onPress={() => onPress(item)}
      underlayColor="#E5E7EB"
    >
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <NotificationIcon type={item.type} status={item.status} />
          {!item.read && <View style={styles.dot} />}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{renderMessageWithLinks(item.message)}</Text>

          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
          )}

          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  unread: {
    backgroundColor: "#EEF2FF",
  },
  read: {
    backgroundColor: "#fff",
  },
  content: {
    flexDirection: "row",
    flex: 1,
  },
  iconWrap: {
    marginRight: 14,
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: "#EF4444",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  message: {
    fontSize: 14,
    color: "#4B5563",
    marginVertical: 4,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  linkText: {
    color: "#2563EB",
    textDecorationLine: "underline",
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  image: {
    height: 150,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
  },
});

export default NotificationItem;
