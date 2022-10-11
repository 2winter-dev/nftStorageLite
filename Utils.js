export const API_URL = 'https://api.nft.storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getKey = async () => {
    const value = await AsyncStorage.getItem('@api_key')
    if (value !== null) {
        global['api_key'] = value;
        return value;
    }
}

