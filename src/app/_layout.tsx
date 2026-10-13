import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME } from "@/lib/theme";
// @ts-expect-error Global CSS is loaded for its side effects by Expo.
import "@/styles/global.css";

export default function RootLayout() {
  return (
    <ThemeProvider value={NAV_THEME.light}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
