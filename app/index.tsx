import { useRouter } from "expo-router";
import { View, Text, Pressable, TextInput } from "react-native";
import { ModerateScale, VerticalScale } from "@/hooks/metrics";
import { useState } from "react";
import { createUserIfNotExists } from "firebaseConfig";
import { useUser } from "@/hooks/useUser";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS, COMMON_STYLES, SHADOWS } from "@/constants/theme";

export default function Home() {
  const router = useRouter();
  const { setUser } = useUser();
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    if (username.trim().length > 0) {
      const res = await createUserIfNotExists(username);
      if (res && res != null) {
        router.replace("/(tabs)");
        setUser(res);
      }
    }
  };

  return (
    <View className="flex-1 bg-[#1C1C1E] justify-center px-6">
      {/* Logo and Title Section */}
      <View className="w-full items-center justify-center mb-12">
        <MaterialCommunityIcons
          name="skull-crossbones"
          size={80}
          color={COLORS.primary}
          style={{ marginBottom: 16 }}
        />
        <Text className="font-[Kica-PERSONALUSE-Light] text-5xl text-[#FFD700] text-center">
          BOUNTY STREAK
        </Text>
        <Text className="font-[Kica-PERSONALUSE-Light] text-base text-[#D3D3D3] mt-2 text-center">
          Claim your bounty
        </Text>
      </View>

      {/* Login Form */}
      <View className="w-full mb-6 space-y-4 flex flex-col gap-3 ">
        <View className="relative">
          <MaterialCommunityIcons
            name="account"
            size={20}
            color={COLORS.primary}
            style={{ position: "absolute", left: 16, top: 14, zIndex: 1 }}
          />
          <TextInput
            placeholder="Enter your pirate name"
            placeholderTextColor={COLORS.textSecondary}
            onChangeText={setUsername}
            value={username}
            className="bg-[#2C2C2E] h-[50px] rounded-2xl px-12 font-[Kica-PERSONALUSE-Light] text-[#F8F8FF] border border-[#FFD700]"
          />
        </View>

        <View className="relative">
          <MaterialCommunityIcons
            name="lock"
            size={20}
            color={COLORS.primary}
            style={{ position: "absolute", left: 16, top: 14, zIndex: 1 }}
          />
          <TextInput
            placeholder="Enter your secret code"
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry
            className="bg-[#2C2C2E] h-[50px] rounded-2xl px-12 font-[Kica-PERSONALUSE-Light] text-[#F8F8FF] border border-[#FFD700]"
          />
        </View>
      </View>

      <Pressable
        onPress={handleLogin}
        className="w-full h-[56px] bg-[#FFD700] rounded-2xl flex-row items-center justify-center"
      >
        <Text className="font-[Kica-PERSONALUSE-Light] text-[#1C1C1E] text-lg font-bold mr-2">
          Set Sail
        </Text>
        <MaterialCommunityIcons
          name="sail-boat"
          size={24}
          color={COLORS.background}
        />
      </Pressable>
    </View>
  );
}
