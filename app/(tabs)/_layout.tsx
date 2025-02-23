import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useUser } from "@/hooks/useUser";
import { COLORS, NAV_STYLES, SHADOWS } from "@/constants/theme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabLayout() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user || user == null) {
      router.replace("index");
    }
  }, [user]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          ...NAV_STYLES.tabBarLabel,
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          ...NAV_STYLES.tabBar,
          ...SHADOWS.lg,
          height: 85,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="treasure-chest"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Crew",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="skull" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="vision"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              className={`flex items-center justify-center rounded-full 
                ${focused ? "bg-[#FFD700]" : "bg-[#1C1C1E]"} 
                h-[70px] w-[70px] -top-2
                border-2 border-[#FFD700]`}
              style={SHADOWS.lg}
            >
              <MaterialCommunityIcons
                name="compass"
                color={focused ? COLORS.background : COLORS.primary}
                size={35}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pirate"
        options={{
          title: "Ship",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="sail-boat"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Log",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open-page-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
