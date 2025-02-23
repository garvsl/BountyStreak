import { ScrollView, TextInput, View, Pressable, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "@/components/ui/button";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MonthlyHeatmap from "@/components/heatmap/CalendarHeatmap";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { getSpecificUsersQuestData } from "@/firebaseConfig";

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
    <View className="bg-[#40c040] flex flex-col justify-between  p-4 w-full gap-8 rounded-2xl">
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          {/* <View className="text-white aspect-square p-2  rounded-full bg-gray-700  items-center justify-center border border-white">
                                <Text className="text-xs font-light">20%</Text>
                              </View> */}
          <Text className="text-[#eefafa] font-[Kica-PERSONALUSE-Light] font-semibold text-2xl">
            {questName}
          </Text>
        </View>
        {/* <Pressable className="border p-1 rounded-full border-[#C9E7F2] ">
          <AntDesign name="check" size={18} color="#E7F5FA" />
        </Pressable> */}
      </View>
      <View className="flex flex-col gap-1">
        <View className="flex flex-row items-end justify-between ">
          <Text className="font-normal text-[#eefafa] font-[Kica-PERSONALUSE-Light]">
            {currentProgress}
            {""}
            <Text className="text-gray-800 font-light ">
              /{maxProgress} {time != null && time}
            </Text>
          </Text>
          <Text className="font-[Kica-PERSONALUSE-Light] text-[#eefafa] text-2xl">
            {rewardInDoubloons} Doubloons
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

const ProgressButton = ({ big, small, classN = "" }: any) => {
  return (
    <Pressable
      className={`flex-[1] bg-[#eefafa] rounded-2xl flex flex-col justify-center items-center ${classN} `}
    >
      <Text className="font-bold text-[#070b0f] font-[Kica-PERSONALUSE-Light]">
        {big}
      </Text>
      <Text className=" text-[#070b0f] text-xs font-[Kica-PERSONALUSE-Light]">
        {small}
      </Text>
    </Pressable>
  );
};

export default function DailyQuest() {
  const glow = {
    textShadowColor: "#3060BF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  };

  const [defaultItems, setDefaultItems] = useState<any>([]);

  const [filteredItems, setFilteredItems] = useState<any>([]);

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

  const { user, quests, localQuests, setLocalQuests } = useUser();

  useEffect(() => {
    (async () => {
      const res = await getSpecificUsersQuestData(user.uid);
      console.log(res);
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
    <ScrollView className="bg-[#070b0f]">
      <View className="flex-1   gap-8">
        <View className="flex gap-3 ">
          <View className="flex pt-8 px-8 flex-col gap-3">
            <View className="flex flex-row items-center  gap-3">
              <View className="border rounded-full border-[#E6F4F4] aspect-square  p-1 flex flex-row items-center justify-center">
                <AntDesign name="exclamation" size={18} color="#E6F4F4" />
              </View>
              <Text className="text-3xl  text-[#E6F4F4]   font-[Kica-PERSONALUSE-Light]">
                DAILY PROGRESS
              </Text>
            </View>
          </View>
          <View className="px-6">
            <View className="flex-1  bg-[#E6F4F4] p-2 rounded-2xl flex flex-row gap-1 justify-center items-center">
              <Text>
                <MaterialCommunityIcons color="#f75a37" name="fire" size={18} />
              </Text>
              <Text className="font-bold text-[#070b0f] font-[Kica-PERSONALUSE-Light]">
                1 Day Streak
              </Text>
            </View>
          </View>
          <View className="px-6">
            <View className="bg-[#171d25] blur-md flex-1 flex-row p-2 py-4 h-[22rem] rounded-2xl">
              <MonthlyHeatmap values={[{ date: "2025-02-23", value: 1 }]} />
            </View>
          </View>
        </View>
        <View className="flex  flex-col mt-2 gap-4">
          <View className="flex px-8 flex-row items-center  gap-3">
            <Text className="text-3xl text-[#E6F4F4]   font-[Kica-PERSONALUSE-Light]  border-b-2 border-b-[#E6F4F4] ">
              DAILY TASK
            </Text>
          </View>
          <View className="flex px-6 mt-1 flex-row gap-4">
            <View className="flex-1 justify-center">
              <AntDesign
                className="absolute pl-4 z-[10]"
                name="search1"
                size={16}
                color="#eefafa"
              />
              <TextInput
                onChangeText={(text) => {
                  onSearch(text);
                }}
                placeholder="Search Quests"
                className=" h-12 font-[Kica-PERSONALUSE-Light] text-xs bg-[#171d25] text-[#eefafa]  rounded-2xl px-4 pl-12"
              />
            </View>

            <View className="flex flex-row border border-[#0f1721] bg-[#171d25]  rounded-full">
              <Button className="rounded-full bg-[#eefafa]">
                <Feather name="list" size={16} color="#090e13" />
              </Button>
              <Button className="rounded-full bg-[transparent] ">
                <Feather name="grid" size={16} color="#eefafa" />
              </Button>
            </View>
          </View>
          <View className="px-6 flex gap-3 h-16 flex-row">
            <ProgressButton
              classN={"flex-[2]"}
              big={user ? user.doubloons : 0}
              small={"Doubloons"}
            />
            {/* <ProgressButton big={"3"} small={"Completed"} /> */}
            <ProgressButton big={"23:54:12"} small={"Remaining"} />
          </View>
          <View className=" px-6 flex flex-col gap-4">
            {filteredItems.length === 0 ? (
              <Quest title={"Theres Nothing..."} amount={0} max={0} />
            ) : (
              filteredItems.map((e: any) => <Quest key={e.id} {...e} />)
            )}

            <View className="bg-transparent w-full h-16 rounded-2xl"></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
