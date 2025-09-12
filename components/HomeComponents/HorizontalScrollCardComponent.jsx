// screens/HorizontalScrollCardComponent.jsx
import { View, SafeAreaView } from 'react-native';
import HorizontalScrollCardList from "../../components/Cards/HorizontalScroll/HorizontalScrollCardList"
import { useHostels } from '../../context/HostelsContext';


export default function HorizontalScrollCardComponent() {
    const { hostels, loading,getCacheInfo  } = useHostels();

const checkCache = async () => {
  const info = await getCacheInfo();
  console.log('Cache info:', info);
  // Output: { hasCachedData: true, hostelCount: 150, cacheAge: 5400000, isValid: true }
};
  return (
    <SafeAreaView className="flex-1 bg-white">
      <HorizontalScrollCardList hostels={hostels} />
    </SafeAreaView>
  );
}
