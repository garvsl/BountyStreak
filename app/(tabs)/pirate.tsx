import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import {
  Canvas,
  Atlas,
  Image,
  useRectBuffer,
  useImage,
  useRSXformBuffer,
} from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-reanimated";
import { useUser } from "@/hooks/useUser";
import { buyPetItem, listPetItems } from "@/firebaseConfig";

const Quest = ({ title, amount, max, onDelete, time = null }) => {
  const { user } = useUser();
  const filledCount = Math.round((amount / max) * 6);
  const percentage = Math.round((amount / max) * 100);

  const handleBuy = async () => {
    if (user.doubloons >= max) {
      try {
        console.log("Attempting to buy:", title);
        const success = await buyPetItem(user.uid, title);
        console.log("Buy item result:", success);

        console.log("Purchase successful, calling onDelete");
        onDelete(title); // Pass the title to identify which item was purchased
        user.doubloons -= max;
      } catch (error) {
        console.error("Error during purchase:", error);
      }
    } else {
      console.log("Insufficient funds");
    }
  };

  return (
    <View className="bg-[#40c040] flex flex-col justify-between p-4 w-full gap-8 rounded-2xl">
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          <Text className="text-[#eefafa] font-[Kica-PERSONALUSE-Light] font-semibold text-2xl">
            {title}
          </Text>
        </View>
        <Pressable
          onPress={handleBuy}
          className="border p-2 rounded-full border-[#C9E7F2]"
        >
          <Text className="font-[Kica-PERSONALUSE-Light] text-white">BUY</Text>
        </Pressable>
      </View>
      <View className="flex flex-col gap-1">
        <View className="flex flex-row items-end justify-between">
          <Text className="font-normal text-[#eefafa] font-[Kica-PERSONALUSE-Light]">
            {amount}
            <Text className="text-gray-800 font-light">
              /{max} {time != null && time}
            </Text>
          </Text>
          <Text className="font-[Kica-PERSONALUSE-Light] text-[#eefafa] text-2xl">
            {percentage}%
          </Text>
        </View>
        <View className="h-2 flex rounded-full bg-[#171d25] flex-row">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                className={`h-2 flex-1 ${
                  i < filledCount ? "bg-[#eefafa]" : ""
                } ${
                  i === filledCount - 1
                    ? "rounded-r-full"
                    : i === 0 && "rounded-l-full"
                } ${i === filledCount - 1 && i === 0 && "rounded-full"}`}
              />
            ))}
        </View>
      </View>
    </View>
  );
};

const { width: screenWidth } = Dimensions.get("window");
const PADDING = 48;
const CANVAS_SIZE = screenWidth - PADDING;

export default function Pirate() {
  const { user } = useUser();
  const counter = useSharedValue(0);
  const xPosition = useSharedValue(CANVAS_SIZE / 2);
  const yPosition = useSharedValue(CANVAS_SIZE / 2);

  // Load images
  const backgroundImage = useImage(
    require("../../assets/sprite/CatRoomFree/Room1.png")
  );
  const spriteMap = useImage(
    require("../../assets/sprite/FreePiratePack/PirateCats/PirateCat2.png")
  );
  const bedImage = useImage(require("../../assets/sprite/Furniture/bed.png"));
  const plantImage = useImage(
    require("../../assets/sprite/Furniture/plant.png")
  );
  const foodImage = useImage(require("../../assets/sprite/Furniture/food.png"));
  const catTowerImage = useImage(
    require("../../assets/sprite/Furniture/tower.png")
  );
  const yarnImage = useImage(require("../../assets/sprite/Furniture/yarn.png"));
  const windowImage = useImage(
    require("../../assets/sprite/Furniture/window.png")
  );

  const [furniture, setFurniture] = useState([]);
  const [quests, setQuests] = useState([]);

  // Define initial furniture configuration
  const initFurniture = React.useMemo(
    () => [
      {
        title: "Bed",
        image: bedImage,
        x: CANVAS_SIZE * 0.4,
        y: CANVAS_SIZE * 0.35,
        width: CANVAS_SIZE * 0.2,
        height: CANVAS_SIZE * 0.2,
      },
      {
        title: "Plant",
        image: plantImage,
        x: CANVAS_SIZE * 0.48,
        y: CANVAS_SIZE * 0.75,
        width: CANVAS_SIZE * 0.05,
        height: CANVAS_SIZE * 0.15,
      },
      {
        title: "Feed Your Pet",
        image: foodImage,
        x: CANVAS_SIZE * 0.1,
        y: CANVAS_SIZE * 0.47,
        width: CANVAS_SIZE * 0.1,
        height: CANVAS_SIZE * 0.3,
      },
      {
        title: "Cat Tower",
        image: catTowerImage,
        x: CANVAS_SIZE * 0.7,
        y: CANVAS_SIZE * 0.4,
        width: CANVAS_SIZE * 0.15,
        height: CANVAS_SIZE * 0.25,
      },
      {
        title: "Yarn",
        image: yarnImage,
        x: CANVAS_SIZE * 0.35,
        y: CANVAS_SIZE * 0.38,
        width: CANVAS_SIZE * 0.055,
        height: CANVAS_SIZE * 0.25,
      },
      {
        title: "Window",
        image: windowImage,
        x: CANVAS_SIZE * 0.2,
        y: CANVAS_SIZE * 0.25,
        width: CANVAS_SIZE * 0.12,
        height: CANVAS_SIZE * 0.25,
      },
    ],
    [bedImage, plantImage, foodImage, catTowerImage, yarnImage, windowImage]
  );

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      counter.value = (counter.value + 1) % 2;
    }, 200);
    return () => clearInterval(interval);
  }, [counter]);

  // Load initial data
  useEffect(() => {
    const fetchQuestsAndFurniture = async () => {
      try {
        console.log("Fetching initial data...");
        const purchasedItems = (await listPetItems(user.uid)) || [];
        console.log("Purchased items:", purchasedItems);

        const initialQuests = [
          { id: 1, title: "Feed Your Pet", amount: user.doubloons, max: 50 },
          { id: 2, title: "Bed", amount: user.doubloons, max: 100 },
          { id: 3, title: "Cat Tower", amount: user.doubloons, max: 150 },
          { id: 4, title: "Yarn", amount: user.doubloons, max: 155 },
          { id: 5, title: "Window", amount: user.doubloons, max: 300 },
          { id: 6, title: "Plant", amount: user.doubloons, max: 500 },
        ];

        // Filter quests to remove purchased items
        const filteredQuests = initialQuests.filter(
          (quest) => !purchasedItems.includes(quest.title)
        );

        // Filter furniture to only show purchased items
        const filteredFurniture = initFurniture.filter((item) =>
          purchasedItems.includes(item.title)
        );

        console.log("Setting initial furniture:", filteredFurniture);
        console.log("Setting initial quests:", filteredQuests);

        setQuests(filteredQuests);
        setFurniture(filteredFurniture);
      } catch (error) {
        console.error("Error fetching quests and furniture:", error);
      }
    };

    fetchQuestsAndFurniture();
  }, [user, initFurniture]);

  const sprites = useRectBuffer(1, (rect, i) => {
    "worklet";
    const frameSelect = 32 * Math.floor(counter.value);
    rect.setXYWH(frameSelect, 0, 32, 32);
  });

  const transforms = useRSXformBuffer(1, (transform, i) => {
    "worklet";
    const scale = 1.7;
    transform.set(scale, 0, xPosition.value, yPosition.value);
  });

  const removeQuest = async (title) => {
    console.log("removeQuest called with title:", title);

    // Remove the quest
    setQuests((prevQuests) => {
      const newQuests = prevQuests.filter((quest) => quest.title !== title);
      console.log("Updated quests:", newQuests);
      return newQuests;
    });

    // Add the furniture
    const newFurnitureItem = initFurniture.find((item) => item.title === title);
    if (newFurnitureItem) {
      console.log("Adding new furniture item:", newFurnitureItem);
      setFurniture((prev) => {
        const newFurniture = [...prev, newFurnitureItem];
        console.log("Updated furniture:", newFurniture);
        return newFurniture;
      });
    }

    // Refresh the furniture list from Firebase to ensure sync
    try {
      const purchasedItems = await listPetItems(user.uid);
      console.log("Refreshed purchased items:", purchasedItems);
      const updatedFurniture = initFurniture.filter((item) =>
        purchasedItems.includes(item.title)
      );
      console.log("Setting furniture after refresh:", updatedFurniture);
      setFurniture(updatedFurniture);
    } catch (error) {
      console.error("Error refreshing furniture:", error);
    }
  };

  // Debug useEffect to monitor state changes
  useEffect(() => {
    console.log("Furniture state updated:", furniture);
  }, [furniture]);

  useEffect(() => {
    console.log("Quests state updated:", quests);
  }, [quests]);

  return (
    <View className="flex-1 bg-[#070b0f]">
      <View className="px-6">
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

              {furniture.map(
                (item, index) =>
                  item.image && (
                    <Image
                      key={index}
                      image={item.image}
                      x={item.x}
                      y={item.y}
                      width={item.width}
                      height={item.height}
                    />
                  )
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
      </View>

      <View className="flex flex-col gap-3">
        <View className="flex px-6 flex-row items-center">
          <Text className="text-3xl text-[#E6F4F4] font-[Kica-PERSONALUSE-Light] border-b-[#E6F4F4]">
            SHOP --
          </Text>
          <Text className="text-xl text-[#E6F4F4] font-[Kica-PERSONALUSE-Light] border-b-[#E6F4F4]">
            {" "}
            DOUBLOONS: {user.doubloons}
          </Text>
        </View>
        <ScrollView className="px-6">
          <View className="flex flex-col gap-4">
            {quests.map((quest) => (
              <Quest
                key={quest.id}
                title={quest.title}
                amount={quest.amount}
                max={quest.max}
                onDelete={removeQuest}
              />
            ))}
            <View className="bg-transparent w-full h-36 rounded-2xl" />
            <View className="bg-transparent w-full h-36 rounded-2xl" />
            <View className="bg-transparent w-full h-36 rounded-2xl" />
            <View className="bg-transparent w-full h-36 rounded-2xl" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
