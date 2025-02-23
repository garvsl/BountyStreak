import { ScrollView, TextInput, View, Pressable, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button } from "@/components/ui/button";
import MonthlyHeatmap from "@/components/heatmap/CalendarHeatmap";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { getSpecificUsersQuestData } from "@/firebaseConfig";
import ProgressButton from "./ProgressCountDown";
import {
  COLORS,
  COMMON_STYLES,
  QUEST_STYLES,
  SPACING,
  SHADOWS,
} from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";

const Quest = ({
  questName,
  currentProgress,
  maxProgress,
  rewardInDoubloons,
  completed,
  time = null,
}: any) => {
  const filledCount = Math.round((currentProgress / maxProgress) * 6);
  const percentage = Math.round((currentProgress / maxProgress) * 100);

  return (
    <View
      style={[
        QUEST_STYLES.container,
        {
          borderColor: completed ? COLORS.success : COLORS.primary,
        },
      ]}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons
            name={completed ? "treasure-chest" : "map-marker-question"}
            size={24}
            color={COLORS.primary}
          />
          <Text style={QUEST_STYLES.title}>{questName}</Text>
        </View>
        {completed && (
          <MaterialCommunityIcons
            name="check-decagram"
            size={24}
            color={COLORS.success}
          />
        )}
      </View>

      <View className="mt-4">
        <View className="flex flex-row items-center justify-between mb-2">
          <Text
            style={{
              fontFamily: "Kica-PERSONALUSE-Light",
              color: COLORS.textSecondary,
            }}
          >
            {currentProgress}/{maxProgress} {time && `(${time})`}
          </Text>
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="cash"
              size={20}
              color={COLORS.primary}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontFamily: "Kica-PERSONALUSE-Light",
                color: COLORS.primary,
                fontSize: 18,
              }}
            >
              {rewardInDoubloons}
            </Text>
          </View>
        </View>

        <View style={QUEST_STYLES.progressBar}>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: "100%",
                  backgroundColor:
                    i < filledCount ? COLORS.primary : "transparent",
                  borderTopRightRadius: i === filledCount - 1 ? 999 : 0,
                  borderBottomRightRadius: i === filledCount - 1 ? 999 : 0,
                  borderTopLeftRadius: i === 0 ? 999 : 0,
                  borderBottomLeftRadius: i === 0 ? 999 : 0,
                }}
              />
            ))}
        </View>
      </View>
    </View>
  );
};

export default function DailyQuest() {
  const [defaultItems, setDefaultItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState(defaultItems);
  const { user, quests, localQuests, setLocalQuests } = useUser();

  const onSearch = (searchText) => {
    if (searchText) {
      const searchResults = defaultItems.filter((item) =>
        item.questName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(searchResults);
    } else {
      setFilteredItems(defaultItems);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await getSpecificUsersQuestData(user.uid);
      setDefaultItems(res);
      setFilteredItems(res);
      setLocalQuests(res);
    })();
  }, [user, quests]);

  useEffect(() => {
    setDefaultItems(localQuests);
    setFilteredItems(localQuests);
  }, [localQuests]);

  return (
    <ScrollView style={COMMON_STYLES.container}>
      <View className="flex-1 gap-8">
        {/* Header Section */}
        <View className="flex gap-3">
          <View className="flex pt-8 px-8 flex-col gap-3">
            <View className="flex flex-row  items-center gap-3">
              <MaterialCommunityIcons
                name="compass-rose"
                size={32}
                color={COLORS.primary}
              />
              <Text style={COMMON_STYLES.screenTitle}>VOYAGE LOG</Text>
            </View>
          </View>

          {/* Streak Card */}
          <View className="px-6">
            <View
              style={[
                COMMON_STYLES.card,
                {
                  backgroundColor: COLORS.primary,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: SPACING.sm,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="skull-crossbones"
                size={24}
                color={COLORS.background}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontFamily: "Kica-PERSONALUSE-Light",
                  color: COLORS.background,
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                1 Day Streak
              </Text>
            </View>
          </View>

          {/* Heatmap */}
          <View className="px-6">
            <View
              style={[
                COMMON_STYLES.card,
                {
                  height: 280,
                  padding: SPACING.lg,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                },
              ]}
            >
              <MonthlyHeatmap values={[{ date: "2025-02-23", value: 1 }]} />
            </View>
          </View>
        </View>

        {/* Daily Tasks Section */}
        <View className="flex flex-col mt-2 gap-4">
          <View className="flex px-8 flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="map-marker-path"
              size={24}
              color={COLORS.primary}
            />
            <Text style={COMMON_STYLES.screenTitle}>QUESTS</Text>
          </View>

          {/* Search Bar and View Toggle */}
          <View className="flex px-6 mt-1 flex-row gap-4">
            <View className="flex-1 justify-center">
              <View
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: [{ translateY: -8 }],
                  zIndex: 10,
                }}
              >
                <AntDesign name="search1" size={16} color={COLORS.primary} />
              </View>
              <TextInput
                onChangeText={onSearch}
                placeholder="Treasure Search..."
                placeholderTextColor={COLORS.textSecondary}
                style={{
                  height: 48,
                  fontFamily: "Kica-PERSONALUSE-Light",
                  backgroundColor: COLORS.backgroundLight,
                  color: COLORS.textPrimary,
                  borderRadius: 16,
                  paddingLeft: 44,
                  paddingRight: 16,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                }}
              />
            </View>
            {/* 
            <View
              style={{
                flexDirection: "row",
                borderRadius: 999,
                borderWidth: 1,
                borderColor: COLORS.primary,
                backgroundColor: COLORS.backgroundLight,
              }}
            > */}
            <Button
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 16,
                height: 48,
                borderWidth: 1,
                borderColor: COLORS.primary,
              }}
            >
              <MaterialCommunityIcons
                name="view-list"
                size={16}
                color={COLORS.background}
              />
            </Button>
            {/* <Button
                style={{
                  backgroundColor: "transparent",
                  borderRadius: 999,
                }}
              >
                <MaterialCommunityIcons
                  name="view-grid"
                  size={16}
                  color={COLORS.primary}
                />
              </Button> */}
            {/* </View> */}
          </View>

          {/* Progress Buttons */}
          <View className="px-6 flex gap-3  flex-row">
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: COLORS.backgroundLight,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  ...SHADOWS.sm,
                },
              ]}
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="cash"
                  size={24}
                  color={COLORS.primary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontFamily: "Kica-PERSONALUSE-Light",
                    fontSize: 24,
                    color: COLORS.primary,
                  }}
                >
                  {user ? user.doubloons : 0}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Kica-PERSONALUSE-Light",
                  color: COLORS.textSecondary,
                  fontSize: 12,
                }}
              >
                Doubloons
              </Text>
            </View>

            <ProgressButton
              big={""}
              small={"Remaining"}
              style={{
                flex: 1,
                backgroundColor: COLORS.backgroundLight,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: COLORS.primary,
                ...SHADOWS.sm,
              }}
            />
          </View>

          {/* Quest List */}
          <View className="px-6 flex flex-col gap-4">
            {filteredItems.length === 0 ? (
              <Quest
                questName="No Quests Available"
                currentProgress={0}
                maxProgress={0}
                rewardInDoubloons={0}
                completed={undefined}
              />
            ) : (
              filteredItems.map((e: any) => <Quest key={e.id} {...e} />)
            )}
            <View className="h-16" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
