import { ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { View, Text, Pressable, TextInput } from "react-native";
import { ModerateScale, VerticalScale } from "@/hooks/metrics";
import { useState } from "react";
import { createUserIfNotExists } from "firebaseConfig";
import { useUser } from "@/hooks/useUser";

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
    <View className="flex-1 justify-center items-center bg-[#070b0f] p-0">
      {/* Placeholder Text instead of Image */}
      <View className="w-full h-full items-center justify-center">
        <Text className="text-4xl font-bold text-[#75ff75] font-[Kica-PERSONALUSE-Light]">
          BOUNTY STREAK
        </Text>
      </View>

      {/* Bottom Container */}
      <View className="absolute bottom-[2.5%] w-full px-4 pt-5 pb-5">
        {/* <Text className="font-bold font-[Kica-PERSONALUSE-Light] text-lg text-black">
          Get started with BountyStreak
        </Text> */}

        <View className="flex flex-col gap-2">
          <TextInput
            className="bg-white p-3 text-lg border border-black rounded-2xl"
            placeholder="username"
            onChangeText={(e) => setUsername(e)}
            value={username}
          />
          <TextInput
            className="bg-white p-3 text-lg border border-black rounded-2xl"
            placeholder="password"
          />
        </View>
        <Pressable
          style={{
            height: VerticalScale(55),
          }}
          className="w-full mt-6 bg-white border border-black rounded-2xl flex-row items-center justify-center"
          onPress={() => handleLogin()}
        >
          <Text
            style={{
              fontSize: ModerateScale(14),
            }}
            className="font-bold font-[Kica-PERSONALUSE-Light] text-black mr-2"
          >
            Continue
          </Text>
          <ArrowRight size={ModerateScale(16)} color="black" />
        </Pressable>
      </View>
    </View>
  );
}
