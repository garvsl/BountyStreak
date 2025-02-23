import React, { useEffect } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Skia,
  Canvas,
  Atlas,
  Image,
  rect,
  useRectBuffer,
  useImage,
  useRSXformBuffer,
} from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";

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
const { width: screenWidth } = Dimensions.get("window");
const PADDING = 48; // 24px padding on each side
const CANVAS_SIZE = screenWidth - PADDING; // Square canvas

export default function Pirate() {
  const counter = useSharedValue(0);
  const xPosition = useSharedValue(CANVAS_SIZE / 2);
  const yPosition = useSharedValue(CANVAS_SIZE / 2);

  useEffect(() => {
    const interval = setInterval(() => {
      counter.value = (counter.value + 1) % 2;
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const spriteMap = useImage(
    require("../../assets/sprite/FreePiratePack/PirateCats/PirateCat2.png")
  );

  const backgroundImage = useImage(
    require("../../assets/sprite/CatRoomFree/Room1.png")
  );
  const sprites = useRectBuffer(1, (rect, i) => {
    "worklet";
    let frameSelect;
    if (!counter) {
      frameSelect = 0;
    } else {
      frameSelect = 32 * Math.floor(counter.value);
    }
    rect.setXYWH(frameSelect, 0, 32, 32);
  });

  const transforms = useRSXformBuffer(1, (transform, i) => {
    "worklet";
    const scale = 1.7;
    transform.set(scale, 0, xPosition.value, yPosition.value);
  });

  return (
    <View className="flex-1 bg-[#070b0f] px-6">
      <Text className="text-3xl text-[#E6F4F4] font-[Kica-PERSONALUSE-Light] border-b-[#E6F4F4]">
        PIRATE
      </Text>
      <View className="py-3 pb-4">
        <View
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <Canvas
            style={{
              width: CANVAS_SIZE,
              height: CANVAS_SIZE,
            }}
          >
            {backgroundImage && (
              <Image
                image={backgroundImage}
                x={0}
                y={0}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                fit="contain"
              />
            )}

            {spriteMap && (
              <Atlas
                image={spriteMap}
                sprites={sprites}
                transforms={transforms}
              />
            )}
          </Canvas>
        </View>
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
