import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/data/storage/storageKeys";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}


export async function getUsers(): Promise<User[]> {
  const storedUsers = await AsyncStorage.getItem(STORAGE_KEYS.users);

  if (!storedUsers) {
    return [];
  }

  try {
    return JSON.parse(storedUsers) as User[];
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEYS.users,
    JSON.stringify(users),
  );
}


export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function registerUser(
  userData: Omit<User, "id">,
): Promise<{ success: boolean; message: string }> {
  const users = await getUsers();

  const userExists = users.some(
    (user) => user.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (userExists) {
    return { success: false, message: "Este e-mail já está cadastrado no sistema." };
  }

  const newUser: User = {
    id: Date.now().toString(),
    ...userData,
  };

  await saveUsers([...users, newUser]);
  return { success: true, message: "Conta criada com sucesso!" };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; message: string }> {
  const users = await getUsers();

  const foundUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );

  if (!foundUser) {
    return { success: false, message: "E-mail ou senha incorretos. Verifique os dados." };
  }

  await AsyncStorage.setItem(
    STORAGE_KEYS.loggedUser,
    JSON.stringify(foundUser),
  );

  return { success: true, message: "Login realizado com sucesso!" };
}

export async function getLoggedUser(): Promise<User | null> {
  const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.loggedUser);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.loggedUser);
}
