// app/(categories)/(hostels)/_layout.jsx
import { Stack } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import SearchBar from '../../../components/SearchComponents/SearchInput';
import { useRouter } from 'expo-router'; // ✅ Change this

export default function HostelLayout() {
  const router = useRouter(); // ✅ Change this

  return (
    <Stack
      screenOptions={{
        header: () => (
          <SafeAreaView style={{ backgroundColor: 'white' }}>
            <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
              <SearchBar
                placeholder="Search For Your Space"
                onPress={() => router.push('/SearchScreen')} // ✅ Change this
              />
            </View>
          </SafeAreaView>
        ),
      }}
    />
  );
}