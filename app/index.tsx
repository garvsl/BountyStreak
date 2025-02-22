import { ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { ModerateScale, VerticalScale } from "@/hooks/metrics";

export default function Home() {
  const router = useRouter();

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

        <Pressable
          style={{
            height: VerticalScale(55),
          }}
          className="w-full mt-3 bg-white border border-black rounded-md flex-row items-center justify-center"
          onPress={() => router.replace("/(tabs)")}
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
