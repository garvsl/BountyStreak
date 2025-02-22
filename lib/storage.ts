import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting item:", error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting item:", error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item:", error);
  }
}

const HABIT_KEY = "habits";

export type Habit = {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  enableNotifications: boolean;
  archived: boolean;
};

export async function getHabits(): Promise<Habit[]> {
  try {
    const habitsString = await AsyncStorage.getItem(HABIT_KEY);
    if (!habitsString) {
      return [];
    }
    return JSON.parse(habitsString) as Habit[];
  } catch (error) {
    console.error("Error getting habits:", error);
    return [];
  }
}

export async function setHabits(habits: Habit[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HABIT_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Error setting habits:", error);
  }
}

export async function deleteHabit(id: string): Promise<void> {
  try {
    const habits = await getHabits();
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    await setHabits(updatedHabits);
  } catch (error) {
    console.error("Error deleting habit:", error);
  }
}
