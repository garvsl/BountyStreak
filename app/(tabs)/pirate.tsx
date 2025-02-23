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
import { COLORS, COMMON_STYLES, SHADOWS } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width: screenWidth } = Dimensions.get("window");
const PADDING = 48;
const CANVAS_SIZE = screenWidth - PADDING;

const ShopItem = ({ title, amount, max, onDelete, time = null }) => {
  const { user, setUser } = useUser();

  const handleBuy = async () => {
    if (user.doubloons >= max) {
      try {
        const success = await buyPetItem(user.uid, title);
        onDelete(title);
        setUser((prevUser) => ({
          ...prevUser,
          doubloons: prevUser.doubloons - max,
        }));
      } catch (error) {
        console.error("Error during purchase:", error);
      }
    }
  };

  const canAfford = user.doubloons >= max;

  return (
    <View
      style={{
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.primary,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.md,
      }}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-3">
          <MaterialCommunityIcons
            name={
              title.toLowerCase().includes("bed")
                ? "bed"
                : title.toLowerCase().includes("food")
                ? "food"
                : title.toLowerCase().includes("tower")
                ? "castle"
                : title.toLowerCase().includes("yarn")
                ? "spider-thread"
                : title.toLowerCase().includes("window")
                ? "window-open"
                : title.toLowerCase().includes("plant")
                ? "tree"
                : "treasure-chest"
            }
            size={24}
            color={COLORS.primary}
          />
          <Text
            style={{
              fontFamily: "Kica-PERSONALUSE-Light",
              fontSize: 20,
              color: COLORS.primary,
            }}
          >
            {title}
          </Text>
        </View>

        <Pressable
          onPress={handleBuy}
          disabled={!canAfford}
          style={({ pressed }) => [
            {
              backgroundColor: canAfford
                ? pressed
                  ? COLORS.primaryDark
                  : COLORS.primary
                : COLORS.backgroundDark,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
              opacity: canAfford ? 1 : 0.5,
              ...SHADOWS.sm,
            },
          ]}
        >
          <Text
            style={{
              fontFamily: "Kica-PERSONALUSE-Light",
              color: canAfford ? "white" : COLORS.textSecondary,
              fontWeight: "600",
            }}
          >
            {canAfford ? "BUY" : "NOT ENOUGH"}
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <MaterialCommunityIcons
          name="cash"
          size={20}
          color={COLORS.primary}
          style={{ marginRight: 4 }}
        />
        <Text
          style={{
            fontFamily: "Kica-PERSONALUSE-Light",
            fontSize: 18,
            color: COLORS.primary,
          }}
        >
          {max}
        </Text>
      </View>
    </View>
  );
};

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

  useEffect(() => {
    const interval = setInterval(() => {
      counter.value = (counter.value + 1) % 2;
    }, 200);
    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    const fetchQuestsAndFurniture = async () => {
      try {
        const purchasedItems = (await listPetItems(user.uid)) || [];

        const initialQuests = [
          { id: 6, title: "Feed Your Pet", amount: user.doubloons, max: 50 },
          { id: 1, title: "Bed", amount: user.doubloons, max: 100 },
          { id: 2, title: "Cat Tower", amount: user.doubloons, max: 150 },
          { id: 3, title: "Yarn", amount: user.doubloons, max: 155 },
          { id: 4, title: "Window", amount: user.doubloons, max: 300 },
          { id: 5, title: "Plant", amount: user.doubloons, max: 500 },
        ];

        const filteredQuests: any = initialQuests.filter(
          (quest) => !purchasedItems.includes(quest.title)
        );

        const filteredFurniture: any = initFurniture.filter((item) =>
          purchasedItems.includes(item.title)
        );

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
    setQuests((prevQuests) =>
      prevQuests.filter((quest) => quest.title !== title)
    );

    const newFurnitureItem = initFurniture.find((item) => item.title === title);
    if (newFurnitureItem) {
      setFurniture((prev) => [...prev, newFurnitureItem]);
    }

    try {
      const purchasedItems = await listPetItems(user.uid);
      const updatedFurniture = initFurniture.filter((item) =>
        purchasedItems.includes(item.title)
      );
      setFurniture(updatedFurniture);
    } catch (error) {
      console.error("Error refreshing furniture:", error);
    }
  };

  return (
    <View style={COMMON_STYLES.container}>
      {/* Ship View */}
      <View style={{ padding: 24 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <MaterialCommunityIcons
            name="sail-boat"
            size={28}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontFamily: "Kica-PERSONALUSE-Light",
              fontSize: 28,
              color: COLORS.primary,
              borderBottomWidth: 2,
              borderBottomColor: COLORS.primary,
            }}
          >
            YOUR SHIP
          </Text>
        </View>

        <View
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: COLORS.primary,
            ...SHADOWS.lg,
          }}
        >
          <Canvas style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
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

      {/* Shop Section */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 24,
            marginBottom: 16,
          }}
        >
          <MaterialCommunityIcons
            name="store"
            size={28}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              fontFamily: "Kica-PERSONALUSE-Light",
              fontSize: 28,
              color: COLORS.primary,
              borderBottomWidth: 2,
              borderBottomColor: COLORS.primary,
            }}
          >
            SHIP SHOP
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <MaterialCommunityIcons
              name="cash"
              size={20}
              color={COLORS.primary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontFamily: "Kica-PERSONALUSE-Light",
                fontSize: 20,
                color: COLORS.primary,
              }}
            >
              {user.doubloons}
            </Text>
          </View>
        </View>

        <ScrollView style={{ paddingHorizontal: 24 }}>
          {quests.map((quest) => (
            <ShopItem key={quest.id} {...quest} onDelete={removeQuest} />
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
}
