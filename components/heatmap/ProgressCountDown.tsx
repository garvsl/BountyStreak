import React, { useState, useEffect } from "react";
import { Pressable, Text } from "react-native";

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
  // If this is the countdown button, initialize state
  const isCountdown = small === "Remaining";
  const [timeLeft, setTimeLeft] = useState<number>(
    isCountdown ? 24 * 60 * 60 : 0 // Start with 24 hours in seconds
  );

  useEffect(() => {
    if (!isCountdown) return;

    // Calculate the end of the day in user's timezone
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
          // Reset to 24 hours when timer reaches zero
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCountdown]);

  return (
    <Pressable
      className={`flex-[1] bg-[#eefafa] rounded-2xl flex flex-col justify-center items-center ${classN}`}
    >
      <Text className="font-bold text-[#070b0f] font-[Kica-PERSONALUSE-Light]">
        {isCountdown ? formatTime(timeLeft) : big}
      </Text>
      <Text className="text-[#070b0f] text-xs font-[Kica-PERSONALUSE-Light]">
        {small}
      </Text>
    </Pressable>
  );
};

export default ProgressButton;
