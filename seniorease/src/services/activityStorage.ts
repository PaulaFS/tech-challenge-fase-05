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

async function saveActivities(
  activities: Activity[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.activities,
    JSON.stringify(activities),
  );
}

export async function getActivityById(
  id: string,
): Promise<Activity | null> {
  const activities = await getActivities();

  return (
    activities.find((activity) => activity.id === id) ?? null
  );
}

export async function saveActivity(
  activity: Activity,
): Promise<void> {
  const activities = await getActivities();

  await saveActivities([...activities, activity]);
}

export async function updateActivity(
  updatedActivity: Activity,
): Promise<void> {
  const activities = await getActivities();

  const updatedActivities = activities.map((activity) =>
    activity.id === updatedActivity.id
      ? updatedActivity
      : activity,
  );

  await saveActivities(updatedActivities);
}

export async function completeActivity(
  id: string,
): Promise<Activity> {
  const activity = await getActivityById(id);

  if (!activity) {
    throw new Error("Atividade não encontrada.");
  }

  const completedActivity: Activity = {
    ...activity,
    status: "concluida",
    completedAt: new Date().toISOString(),
  };

  await updateActivity(completedActivity);

  return completedActivity;
}

export async function deleteActivity(
  id: string,
): Promise<void> {
  const activities = await getActivities();

  const remainingActivities = activities.filter(
    (activity) => activity.id !== id,
  );

  await saveActivities(remainingActivities);
}

export async function getCompletedActivities(): Promise<Activity[]> {
  const activities = await getActivities();

  return activities
    .filter((activity) => activity.status === "concluida")
    .sort((a, b) => {
      const first = a.completedAt ?? "";
      const second = b.completedAt ?? "";

      return second.localeCompare(first);
    });
}