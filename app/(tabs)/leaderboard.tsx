import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { getUsersSortedByDoubloons } from "firebaseConfig";

const ProgressButton = ({ big, small }: any) => {
  return (
    <Pressable className="flex-[1] bg-[#eefafa] rounded-2xl flex flex-col justify-center items-center">
      <Text className="font-bold text-[#070b0f] font-[Kica-PERSONALUSE-Light]">
        {big}
      </Text>
      <Text className=" text-[#070b0f] text-xs font-[Kica-PERSONALUSE-Light]">
        {small}
      </Text>
    </Pressable>
  );
};

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
          <AntDesign name="dotchart" size={18} color="#E7F5FA" />
        </Pressable>
      </View>
      <View className="flex flex-col gap-1">
        <View className="flex flex-row items-end justify-between ">
          <Text className="font-[Kica-PERSONALUSE-Light] text-[#eefafa] text-2xl">
            {amount} Dabaloons
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function Leaderboard() {
  const [defaultItems, setDefaultItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState(defaultItems);

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

      setDefaultItems(
        res.map((e: any) => {
          return {
            id: e.id,
            title: e.username,
            amount: e.doubloons,
          };
        })
      );
      setFilteredItems(
        res.map((e: any) => {
          return {
            id: e.id,
            title: e.username,
            amount: e.doubloons,
          };
        })
      );
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <Quest title={"Loading..."} amount={0} max={0} />;
  }

  return (
    <ScrollView className="bg-[#070b0f]">
      <View className="flex  flex-col mt-2 gap-4">
        <View className="flex px-8 flex-row items-center  gap-3">
          <Text className="text-3xl text-[#E6F4F4]   font-[Kica-PERSONALUSE-Light]  border-b-2 border-b-[#E6F4F4] ">
            Leaderboard
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
              placeholder="Search"
              onChangeText={onSearch}
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

        <View className=" px-6 flex flex-col gap-4">
          {filteredItems.length === 0 ? (
            <Quest title={"Theres Nothing..."} amount={0} max={0} />
          ) : (
            filteredItems.map((e) => (
              <Quest key={e.id} title={e.title} amount={e.amount} />
            ))
          )}
          <View className="bg-transparent w-full h-16 rounded-2xl"></View>
        </View>
      </View>
    </ScrollView>
  );
}
