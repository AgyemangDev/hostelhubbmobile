import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import HorizontalScrollCard from './HorizontalScrollCard';
import { useRouter } from 'expo-router';
import COLORS from '../../../constants/Colors';
import EmptyHostelShimmer from '../EmptyHostelShimmer';

const HorizontalScrollCardList = ({ hostels }) => {
  const router = useRouter();

  const filteredHostels = useMemo(() => {
    const popular = hostels?.filter(
      (hostel) => hostel.views > 2000 && hostel.hostelAvailability === true
    );
    return popular ? [...popular].sort(() => 0.5 - Math.random()) : [];
  }, [hostels]);

  const lastMinuteHostels = useMemo(() => {
    return hostels
      ? [...hostels].sort(() => 0.5 - Math.random()).slice(0, 10)
      : [];
  }, [hostels]);

  const recentlyAddedHostels = useMemo(() => {
  return hostels ? hostels.filter(h => h.views < 500).slice(0, 10) : [];
}, [hostels]);

  return (
    <View style={styles.container}>
      {/* Popular Hostels Section */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>Popular Hostels</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '(hostels)', params: { tab: 'popular' } })}>
          <Text style={styles.seeMore}>See more</Text>
        </TouchableOpacity>
      </View>

      {filteredHostels?.length > 0 ? (
        <FlatList
          data={filteredHostels}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <HorizontalScrollCard
              hostelId={item.id}
              isFirstItem={index === 0}
              hostelName={item.hostelName}
              ImageUrl={{ uri: item.frontImage }}
              institution={item.institution}
              views={item.views}
              location={item.location}
              availability={item.hostelAvailability}
              isLastItem={index === filteredHostels.length - 1}
              onCardPress={() =>
                router.push({
                  pathname: "/(Details)/[id]",
                  params: { hostelId: item.id }
                })
              }
            />
          )}
        />
      ) : (
       <EmptyHostelShimmer/>
      )}

      <View style={{ height: 32 }} />

      {/* Last Minute Ideas Section */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>Last Minute Ideas</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '(hostels)', params: { tab: 'lastminute' } })}>
          <Text style={styles.seeMore}>See more</Text>
        </TouchableOpacity>
      </View>

      {lastMinuteHostels?.length > 0 ? (
        <FlatList
          data={lastMinuteHostels}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <HorizontalScrollCard
              hostelId={item.id}
              hostelName={item.hostelName}
              isFirstItem={index === 0}
              ImageUrl={{ uri: item.frontImage }}
              institution={item.institution}
              views={item.views}
              location={item.location}
              availability={item.hostelAvailability}
              isLastItem={index === lastMinuteHostels.length - 1}
              onCardPress={() =>
                router.push({
                  pathname: "/(Details)/[id]",
                  params: { hostelId: item.id }
                })
              }
            />
          )}
        />
      ) : (
      <EmptyHostelShimmer/>
      )}

<View style={{ height: 32 }} />

      <View style={styles.titleRow}>
  <Text style={styles.titleText}>Recently Added</Text>
  <TouchableOpacity
    onPress={() =>
      router.push({ pathname: '(hostels)', params: { tab: 'justadded' } })
    }
  >
    <Text style={styles.seeMore}>See more</Text>
  </TouchableOpacity>
</View>

<FlatList
  data={recentlyAddedHostels}
  keyExtractor={(item) => item.id}
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.listContent}
  renderItem={({ item, index }) => (
    <HorizontalScrollCard
      hostelId={item.id}
      hostelName={item.hostelName}
      isFirstItem={index === 0}
      ImageUrl={{ uri: item.frontImage }}
      institution={item.institution}
      views={item.views}
      location={item.location}
      availability={item.hostelAvailability}
      isLastItem={index === recentlyAddedHostels.length - 1}
      onCardPress={() =>
        router.push({
          pathname: "/(Details)/[id]",
          params: { hostelId: item.id },
        })
      }
    />
  )}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    letterSpacing: 0.3,
  },
  seeMore: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  emptyText: {
    color: '#718096',
    fontSize: 16,
    paddingLeft: 4,
  },
});

export default HorizontalScrollCardList;
