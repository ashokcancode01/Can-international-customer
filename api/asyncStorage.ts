import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_STORAGE_KEY = "auth_data";
const SESSION_ID_KEY = "session_id";

export const saveAuthData = async (authData: any) => {
  try {
    const sessionId = Date.now().toString();
    await AsyncStorage.setItem(SESSION_ID_KEY, sessionId);
    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        ...authData,
        sessionId,
      })
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const loadAuthData = async () => {
  try {
    const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    await AsyncStorage.removeItem(SESSION_ID_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidSession = async (currentSessionId: string | undefined) => {
  try {
    const storedSessionId = await AsyncStorage.getItem(SESSION_ID_KEY);
    return storedSessionId === currentSessionId;
  } catch (error) {
    return false;
  }
};
