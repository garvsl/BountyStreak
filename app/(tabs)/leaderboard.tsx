import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button } from "@/components/ui/button";
import { getUsersSortedByDoubloons } from "firebaseConfig";
import { useUser } from "@/hooks/useUser";
import { COLORS, COMMON_STYLES, SHADOWS } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";

const CrewMember = ({ title, amount, rank }) => {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.backgroundLight,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.primary,
          padding: 16,
          marginBottom: 12,
          ...SHADOWS.md,
        },
      ]}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-3">
          {/* Rank Badge */}
          <View
            style={{
              backgroundColor: COLORS.backgroundDark,
              borderRadius: 999,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: rank <= 3 ? COLORS.primary : COLORS.textSecondary,
            }}
          >
            {rank <= 3 ? (
              <MaterialCommunityIcons
                name={rank === 1 ? "crown" : "medal"}
                size={24}
                color={COLORS.primary}
              />
            ) : (
              <Text
                style={{
                  fontFamily: "Kica-PERSONALUSE-Light",
                  color: COLORS.textSecondary,
                  fontSize: 16,
                }}
              >
                #{rank}
              </Text>
            )}
          </View>

          {/* Crew Member Name */}
          <View>
            <Text
              style={{
                fontFamily: "Kica-PERSONALUSE-Light",
                color: COLORS.primary,
                fontSize: 20,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: "Kica-PERSONALUSE-Light",
                color: COLORS.textSecondary,
                fontSize: 14,
              }}
            >
              Crew Member
            </Text>
          </View>
        </View>

        {/* Doubloons Count */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.backgroundDark,
            padding: 8,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.primary,
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
              color: COLORS.primary,
              fontSize: 16,
            }}
          >
            {amount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function Leaderboard() {
  const [defaultItems, setDefaultItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState(defaultItems);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const onSearch = (searchText) => {
    if (searchText) {
      const searchResults = defaultItems.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(searchResults);
    } else {
      setFilteredItems(defaultItems);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await getUsersSortedByDoubloons();
      const sortedItems = res
        .map((e) => ({
          id: e.id,
          title: e.username,
          amount: e.doubloons,
        }))
        .sort((a, b) => b.amount - a.amount);

      setDefaultItems(sortedItems);
      setFilteredItems(sortedItems);
      setLoading(false);
    })();
  }, [user]);

  return (
    <ScrollView style={[COMMON_STYLES.container, { paddingTop: 16 }]}>
      {/* Header */}
      <View className="flex px-6 flex-row items-center gap-3 mb-6">
        <MaterialCommunityIcons
          name="ship-wheel"
          size={28}
          color={COLORS.primary}
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
          CREW ROSTER
        </Text>
      </View>

      {/* Search Bar */}
      <View className="flex px-6 mt-1 flex-row gap-4 mb-6">
        <View className="flex-1 justify-center">
          <AntDesign
            name="search1"
            size={20}
            color={COLORS.primary}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: [{ translateY: -10 }],
              zIndex: 1,
            }}
          />
          <TextInput
            placeholder="Search crew members..."
            placeholderTextColor={COLORS.textSecondary}
            onChangeText={onSearch}
            style={{
              height: 48,
              backgroundColor: COLORS.backgroundLight,
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 16,
              paddingLeft: 48,
              paddingRight: 16,
              color: COLORS.textPrimary,
              fontFamily: "Kica-PERSONALUSE-Light",
            }}
          />
        </View>

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
      </View>

      {/* Crew List */}
      <View className="px-6">
        {loading ? (
          <Text
            style={{
              fontFamily: "Kica-PERSONALUSE-Light",
              color: COLORS.textSecondary,
              textAlign: "center",
            }}
          >
            Loading crew manifest...
          </Text>
        ) : filteredItems.length === 0 ? (
          <CrewMember title="No crew members found" amount={0} rank={0} />
        ) : (
          filteredItems.map((item, index) => (
            <CrewMember
              key={item.id}
              title={item.title}
              amount={item.amount}
              rank={index + 1}
            />
          ))
        )}
        <View className="h-16" />
      </View>
    </ScrollView>
  );
}
