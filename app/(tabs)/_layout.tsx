import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useUser } from "@/hooks/useUser";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabLayout() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    console.log(user);
    if (!user || user == null) {
      router.replace("index");
    }
  }, [user]);
  // current user
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIconStyle: {
          top: 4,
        },
        tabBarActiveTintColor: "#38c040",
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          alignItems: "center",
          backgroundColor: "white",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon(props) {
            return <MaterialCommunityIcons name="home" {...props} size={28} />;
          },
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon(props) {
            return (
              <MaterialCommunityIcons name="podium" {...props} size={28} />
            );
          },
        }}
      />
      <Tabs.Screen
        name="vision"
        options={{
          title: "",
          tabBarIcon({ focused }) {
            return (
              <View
                className={`flex items-center justify-center rounded-full ${
                  focused ? "bg-[#40c040]" : "bg-[#070b0f]"
                } h-[70px] w-[70px] -top-2`}
              >
                <MaterialCommunityIcons
                  name="recycle"
                  color={focused ? "white" : "white"}
                  size={35}
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="pirate"
        options={{
          title: "Pirate",
          tabBarIcon(props) {
            return <MaterialCommunityIcons name="hook" {...props} size={28} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon(props) {
            return <MaterialCommunityIcons name="cog" {...props} size={28} />;
          },
        }}
      />
    </Tabs>
  );
}
