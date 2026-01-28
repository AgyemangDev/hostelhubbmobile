import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ExternalLink } from "@/components/ExternalLink";
import COLORS from "../../constants/Colors";

const ProfileLinkItem = ({ icon, label, route, link, onNavigate, style }) => {
  const Content = (
    <View style={style}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <MaterialIcons name={icon} size={24} color={COLORS.background} />
        <Text style={{ color: COLORS.background, fontSize: 16, fontWeight: "500" }}>
          {label}
        </Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={24}
        color={COLORS.background}
      />
    </View>
  );

  // External (About Us, Terms, Privacy)
  if (link) {
    return (
      <ExternalLink href={link} asChild>
        <TouchableOpacity activeOpacity={0.7}>
          {Content}
        </TouchableOpacity>
      </ExternalLink>
    );
  }

  // Internal navigation
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onNavigate(route)}
    >
      {Content}
    </TouchableOpacity>
  );
};

export default ProfileLinkItem;
