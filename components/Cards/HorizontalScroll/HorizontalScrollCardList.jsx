import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import HorizontalScrollCard from './HorizontalScrollCard';
import { useRouter } from 'expo-router';
import COLORS from '../../../constants/Colors';
import EmptyHostelShimmer from '../EmptyHostelShimmer';

const HorizontalScrollCardList = ({ accommodations }) => {
  const router = useRouter();

  // Popular accommodations
  const filteredAccommodations = useMemo(() => {
    const popular = accommodations?.filter(acc => acc.views > 3500);
    return popular ? [...popular].sort(() => 0.5 - Math.random()) : [];
  }, [accommodations]);

  // Last minute ideas
  const lastMinuteAccommodations = useMemo(() => {
    return accommodations
      ? [...accommodations].sort(() => 0.5 - Math.random()).slice(0, 10)
      : [];
  }, [accommodations]);

  // Recently added
  const recentlyAddedAccommodations = useMemo(() => {
    return accommodations
      ? accommodations.filter(acc => acc.views < 2000).slice(0, 10)
      : [];
  }, [accommodations]);

  const renderCard = (item, index, listLength) => (
    <HorizontalScrollCard
      hostelId={item.id}
      hostelName={item.accommodation_name}
      isFirstItem={index === 0}
      ImageUrl={{ uri: item.front_image }}
      institution={item.institution}
      views={item.views}
      location={item.location}
      availability={item.accommodation_availability}
      isLastItem={index === listLength - 1}
      onCardPress={() =>
        router.push({
          pathname: "/(Details)/[id]",
          params: { hostelId: item.id },
        })
      }
    />
  );

  return (
    <View style={styles.container}>
      {/* Popular Section */}
      <Section
        title="Popular Hostels"
        list={filteredAccommodations}
        listLength={filteredAccommodations.length}
        renderCard={renderCard}
        onSeeMore={() => router.push({ pathname: '(hostels)', params: { tab: 'popular' } })}
      />

      {/* Last Minute Section */}
      <Section
        title="Last Minute Ideas"
        list={lastMinuteAccommodations}
        listLength={lastMinuteAccommodations.length}
        renderCard={renderCard}
        onSeeMore={() => router.push({ pathname: '(hostels)', params: { tab: 'lastminute' } })}
      />

      {/* Recently Added Section */}
      <Section
        title="Recently Added"
        list={recentlyAddedAccommodations}
        listLength={recentlyAddedAccommodations.length}
        renderCard={renderCard}
        onSeeMore={() => router.push({ pathname: '(hostels)', params: { tab: 'justadded' } })}
      />
    </View>
  );
};

// Reusable Section component
const Section = ({ title, list, listLength, renderCard, onSeeMore }) => (
  <View style={{ marginBottom: 32 }}>
    <View style={styles.titleRow}>
      <Text style={styles.titleText}>{title}</Text>
      <TouchableOpacity onPress={onSeeMore}>
        <Text style={styles.seeMore}>See more</Text>
      </TouchableOpacity>
    </View>
    {list?.length > 0 ? (
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => renderCard(item, index, listLength)}
      />
    ) : (
      <EmptyHostelShimmer />
    )}
  </View>
);

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
});

export default HorizontalScrollCardList;