import { router } from "expo-router";
import React from "react";
import { Platform, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { ListRow } from "../../ui";

const openExternal = (url) => (Platform.OS === "web" ? Linking.openURL(url) : WebBrowser.openBrowserAsync(url));

/** One row in the profile menu: opens a screen (`route`) or a web page (`link`). */
export default function ProfileLinkItem({ icon, label, route, href, link, onNavigate, last }) {
  // href: an app path outside the profile stack (e.g. /complaints)
  return <ListRow icon={icon} title={label} last={last} onPress={() => (link ? openExternal(link) : href ? router.push(href) : onNavigate(route))} />;
}
