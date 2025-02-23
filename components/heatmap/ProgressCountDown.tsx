import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { COLORS, SHADOWS } from "@/constants/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Helper function to format time
const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

const ProgressButton = ({ big, small, classN = "" }: any) => {
  const isCountdown = small === "Remaining";
  const [timeLeft, setTimeLeft] = useState<number>(
    isCountdown ? 24 * 60 * 60 : 0
  );

  useEffect(() => {
    if (!isCountdown) return;
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    const initialTimeLeft = Math.floor(
      (endOfDay.getTime() - now.getTime()) / 1000
    );
    setTimeLeft(initialTimeLeft);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdown]);

  return (
    <View
      style={[
        {
          flex: classN === "flex-[2]" ? 2 : 1,
          height: 60,
          backgroundColor: COLORS.backgroundLight,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: COLORS.primary,
          padding: 8,
          justifyContent: "center",
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        {isCountdown ? (
          <>
            <MaterialCommunityIcons
              name="clock"
              size={20}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <View>
              <Text
                style={{
                  fontFamily: "Kica-PERSONALUSE-Light",
                  fontSize: 20,
                  color: COLORS.primary,
                  width: 120, // Fixed width to prevent movement
                  textAlign: "left",
                }}
              >
                {formatTime(timeLeft)}
              </Text>
              <Text
                style={{
                  fontFamily: "Kica-PERSONALUSE-Light",
                  fontSize: 12,
                  color: COLORS.textSecondary,
                }}
              >
                {small}
              </Text>
            </View>
          </>
        ) : (
          <>
            <MaterialCommunityIcons
              name="coins"
              size={20}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <View>
              <Text
                style={{
                  fontFamily: "Kica-PERSONALUSE-Light",
                  fontSize: 20,
                  color: COLORS.primary,
                }}
              >
                {big}
              </Text>
              <Text
                style={{
                  fontFamily: "Kica-PERSONALUSE-Light",
                  fontSize: 12,
                  color: COLORS.textSecondary,
                }}
              >
                {small}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ProgressButton;
