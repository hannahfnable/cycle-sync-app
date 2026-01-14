
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_KEY = 'hasVisitedScreen';

const checkIfVisited = async () => {
  const visited = await AsyncStorage.getItem(SCREEN_KEY);
  return visited === 'true';
};

const markAsVisited = async () => {
  await AsyncStorage.setItem(SCREEN_KEY, 'true');
};
export { checkIfVisited, markAsVisited };