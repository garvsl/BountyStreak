import "./global.css";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { type Theme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@/components/primitives/portal";
import { DatabaseProvider } from "@/db/provider";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { getItem, setItem } from "@/lib/storage";
import { Platform, SafeAreaView, View } from "react-native";
import { UserProvider } from "@/hooks/useUser";

SplashScreen.preventAutoHideAsync();

const NAV_FONT_FAMILY = "Kica-PERSONALUSE-Light";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    regular: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "400",
    },
    medium: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "500",
    },
    bold: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "700",
    },
    heavy: {
      fontFamily: NAV_FONT_FAMILY,
      fontWeight: "800",
    },
  },
};

const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: LIGHT_THEME.fonts,
};

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Kica-PERSONALUSE-Light": require("@/assets/fonts/Kica-PERSONALUSE-Light.ttf"),
  });

  React.useEffect(() => {
    async function prepare() {
      try {
        const theme = getItem("theme");
        if (Platform.OS === "web") {
          document.documentElement.classList.add("bg-[rgba(0,0,0,0.0)]");
        }

        if (!theme) {
          setAndroidNavigationBar(colorScheme);
          setItem("theme", colorScheme);
        } else {
          const colorTheme = theme === "dark" ? "dark" : "light";
          setAndroidNavigationBar(colorTheme);
          if (colorTheme !== colorScheme) {
            setColorScheme(colorTheme);
          }
        }

        setIsColorSchemeLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    if ((fontsLoaded && isColorSchemeLoaded) || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isColorSchemeLoaded, fontError]);

  if ((!fontsLoaded && !fontError) || !isColorSchemeLoaded) {
    return null;
  }

  return (
    <View className="bg-[#070b0f] flex-1 z-[9999]">
      <DatabaseProvider>
        <UserProvider>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <SafeAreaView />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
          <PortalHost />
        </UserProvider>
      </DatabaseProvider>
    </View>
  );
}
