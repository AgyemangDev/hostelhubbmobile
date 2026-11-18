import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { getTransportProvider } from "../../../utils/api/transportConfig";
import { colors } from "../../../constants/theme";

/** Forwards to whichever transport provider the dashboard has switched on. */
export default function TransportEntry() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    getTransportProvider().then((provider) => {
      if (active) router.replace(`/(categories)/(transport)/${provider}`);
    });
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface }}>
      <ActivityIndicator color={colors.brand} />
    </View>
  );
}
