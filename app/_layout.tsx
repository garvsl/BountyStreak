import "./global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { type Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@/components/primitives/portal";
import { DatabaseProvider } from "@/db/provider";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { getItem, setItem } from "@/lib/storage";
import {
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "@/components/ui/button";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MonthlyHeatmap from "@/components/heatmap/CalendarHeatmap";

const NAV_FONT_FAMILY = "Inter";
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

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

const Quest = ({ title, amount, max, time = null }: any) => {
  const filledCount = Math.round((amount / max) * 6);
  const percentage = Math.round((amount / max) * 100);

  return (
    <View className="bg-[#3060BF] flex flex-col justify-between  p-4 w-full gap-8 rounded-2xl">
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          {/* <View className="text-white aspect-square p-2  rounded-full bg-gray-700  items-center justify-center border border-white">
                              <Text className="text-xs font-light">20%</Text>
                            </View> */}
          <Text className="text-[#eefafa] font-[Kica-PERSONALUSE-Light] font-semibold text-2xl">
            {title}
          </Text>
        </View>
        <Pressable className="border p-1 rounded-full border-[#C9E7F2] ">
          <AntDesign name="check" size={18} color="#E7F5FA" />
        </Pressable>
      </View>
      <View className="flex flex-col gap-1">
        <View className="flex flex-row items-end justify-between ">
          <Text className="font-normal text-[#eefafa] font-[Kica-PERSONALUSE-Light]">
            {amount}
            {""}
            <Text className="text-gray-800 font-light ">
              /{max} {time != null && time}
            </Text>
          </Text>
          <Text className="font-[Kica-PERSONALUSE-Light] text-2xl">
            {percentage}%
          </Text>
        </View>
        <View className="h-2 flex rounded-full bg-[#171d25]  flex-row">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                className={` h-2 flex-1   ${
                  i < filledCount ? "bg-[#eefafa] " : ""
                } ${
                  i == filledCount - 1
                    ? "rounded-r-full"
                    : i == 0 && "rounded-l-full"
                }
                    ${i == filledCount - 1 && i == 0 && "rounded-full"}`}
              />
            ))}
        </View>
      </View>
    </View>
  );
};

const ProgressButton = ({ big, small }: any) => {
  return (
    <Pressable className="flex-[1] bg-[#eefafa] rounded-2xl flex flex-col justify-center items-center">
      <Text className="font-bold text-[#070b0f] font-[Kica-PERSONALUSE-Light]">
        {big}
      </Text>
      <Text className=" text-[#070b0f] text-xs font-[Kica-PERSONALUSE-Light]">
        {small}
      </Text>
    </Pressable>
  );
};

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-[rgba(0,0,0,0.0)] ");
      }
      if (!theme) {
        setAndroidNavigationBar(colorScheme);
        setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      setAndroidNavigationBar(colorTheme);
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  const glow = {
    textShadowColor: "#3060BF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  };

  return (
    <>
      <View className="bg-[#070b0f] flex-1  z-[9999]">
        <DatabaseProvider>
          {/* <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}> */}
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <SafeAreaView className=""> </SafeAreaView>
              <ScrollView>
                <View className="flex-1   gap-8">
                  <View className="flex pt-8 px-8 flex-col gap-1">
                    <View className="flex flex-row items-center  gap-3">
                      <View
                        style={{ boxShadow: "0px 0px 7px 0px #3060BF" }}
                        className="border rounded-full border-[#E6F4F4] aspect-square  p-1 flex flex-row items-center justify-center"
                      >
                        <AntDesign
                          name="exclamation"
                          size={18}
                          color="#E6F4F4"
                        />
                      </View>
                      <Text
                        style={glow}
                        className="text-3xl  text-[#E6F4F4]   font-[Kica-PERSONALUSE-Light]"
                      >
                        QUEST INFO
                      </Text>
                    </View>
                    <Text
                      style={glow}
                      className="text-sm text-[#E6F4F4] font-[Kica-PERSONALUSE-Light] font-semibold"
                    >
                      [Daily Quest - Train to become Formidable .]
                    </Text>
                  </View>

                  <View className="px-6">
                    <View className="bg-[#171d25] blur-md flex-1 flex-row p-2 py-4 h-[22rem] rounded-2xl">
                      <MonthlyHeatmap
                        values={[
                          { date: "2025-02-02", value: 1 },
                          { date: "2025-02-13", value: 2 },
                        ]}
                      />
                    </View>
                  </View>

                  <View className="flex  flex-col mt-2 gap-4">
                    <View className="flex px-8 flex-row items-center  gap-3">
                      <Text
                        style={glow}
                        className="text-3xl text-[#E6F4F4]   font-[Kica-PERSONALUSE-Light]  border-b-2 border-b-[#E6F4F4] "
                      >
                        DAILY QUEST
                      </Text>
                    </View>
                    <View className="flex px-6 mt-1 flex-row gap-4">
                      <View className="flex-1 justify-center">
                        <AntDesign
                          className="absolute pl-4 z-[10]"
                          name="search1"
                          size={16}
                          color="#eefafa"
                        />
                        <TextInput
                          placeholder="Search Quests"
                          className=" h-12 font-[Kica-PERSONALUSE-Light] text-xs bg-[#171d25] text-[#eefafa]  rounded-2xl px-4 pl-12"
                        />
                      </View>

                      <View className="flex flex-row border border-[#0f1721] bg-[#171d25]  rounded-full">
                        <Button className="rounded-full bg-[#eefafa]">
                          <Feather name="list" size={16} color="#090e13" />
                        </Button>
                        <Button className="rounded-full bg-[transparent] ">
                          <Feather name="grid" size={16} color="#eefafa" />
                        </Button>
                      </View>
                    </View>
                    <View className="px-6 flex gap-3 h-16 flex-row">
                      <ProgressButton big={"3"} small={"Completed"} />
                      <ProgressButton big={"1"} small={"In Progress"} />
                      <ProgressButton big={"23:54:12"} small={"Remaining"} />
                    </View>
                    <View className=" px-6 flex flex-col gap-4">
                      <Quest title={"Pushups"} amount={2} max={10} />
                      <Quest title={"Coding"} amount={3} max={4} time={"hrs"} />
                      <View className="bg-gray-700 w-full h-36 rounded-2xl"></View>
                    </View>
                  </View>
                  {/* 
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  options={{
                    headerShadowVisible: false,
                  }}
                  name="habits/archive"
                />
                <Stack.Screen
                  options={{
                    headerShadowVisible: false,
                  }}
                  name="habits/[id]"
                />
              </Stack> */}
                </View>
              </ScrollView>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
          {/* </ThemeProvider> */}
        </DatabaseProvider>
        <PortalHost />
      </View>
    </>
  );
}
