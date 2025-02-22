import { View, Pressable } from "react-native";
import { useScrollToTop } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { eq } from "drizzle-orm";
import { Link, Stack } from "expo-router";
import * as React from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { Text } from "@/components/ui/text";
import { habitTable } from "@/db/schema";
import { Plus } from "@/components/Icons";
import { useMigrationHelper } from "@/db/drizzle";
import { useDatabase } from "@/db/provider";
import { HabitCard } from "@/components/habit";
import type { Habit } from "@/lib/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import DailyQuest from "@/components/heatmap/DailyQuest";

export default function Home() {
  const { success, error } = useMigrationHelper();

  if (error) {
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View className="flex-1 gap-5 p-6 bg-secondary/30">
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return <ScreenContent />;
}

function ScreenContent() {
  const { db } = useDatabase();
  const { data: habits, error } = useLiveQuery(
    db?.select().from(habitTable).where(eq(habitTable.archived, false))
  );

  const ref = React.useRef(null);
  useScrollToTop(ref);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary/30">
        <Text className="text-destructive pb-2 ">Error Loading data</Text>
      </View>
    );
  }
  return (
    <>
      <DailyQuest />
    </>
  );
}
