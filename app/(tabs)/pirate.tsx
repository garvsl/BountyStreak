import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const Quest = ({ title, amount, max, time = null }: any) => {
  const filledCount = Math.round((amount / max) * 6);
  const percentage = Math.round((amount / max) * 100);

  return (
    <View className="bg-[#40c040] flex flex-col justify-between  p-4 w-full gap-8 rounded-2xl">
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
          <Text className="font-[Kica-PERSONALUSE-Light] text-[#eefafa] text-2xl">
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

export default function Pirate() {
  return (
    <View className="flex-1  bg-[#070b0f] px-6">
      <Text className="text-3xl text-[#E6F4F4]   font-[Kica-PERSONALUSE-Light]  border-b-[#E6F4F4] ">
        PIRATE
      </Text>
      <View className="py-3 pb-4">
        <View className="h-[28rem] rounded-2xl bg-white "></View>
      </View>
      <View className="flex flex-col gap-3">
        <View className="flex  flex-row items-center  ">
          <Text className="text-3xl text-[#E6F4F4]   font-[Kica-PERSONALUSE-Light]  border-b-[#E6F4F4] ">
            SHOP
          </Text>
        </View>
        <ScrollView className="">
          <View className="flex flex-col gap-4">
            <Quest title={"Buy hat"} amount={10} max={500} />
            <Quest title={"Grow Stronger"} amount={10} max={500} />
            <Quest title={"Sword"} amount={10} max={500} />
            <View className="bg-transparent w-full h-36 rounded-2xl"></View>
            <View className="bg-transparent w-full h-36 rounded-2xl"></View>
            <View className="bg-transparent w-full h-36 rounded-2xl"></View>
            <View className="bg-transparent w-full h-36 rounded-2xl"></View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
