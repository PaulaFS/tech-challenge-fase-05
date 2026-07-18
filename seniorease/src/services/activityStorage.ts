import AsyncStorage from "@react-native-async-storage/async-storage";

import { Activity } from "@/domain/entities/Activity";
import { STORAGE_KEYS } from "@/data/storage/storageKeys";

export async function getActivities(): Promise<Activity[]> {
  const storedActivities = await AsyncStorage.getItem(
    STORAGE_KEYS.activities,
  );

  if (!storedActivities) {
    return [];
  }

  try {
    return JSON.parse(storedActivities) as Activity[];
  } catch {
    return [];
  }
}

export async function saveActivity(
  activity: Activity,
): Promise<void> {
  const currentActivities = await getActivities();

  const updatedActivities = [
    ...currentActivities,
    activity,
  ];

  await AsyncStorage.setItem(
    STORAGE_KEYS.activities,
    JSON.stringify(updatedActivities),
  );
}