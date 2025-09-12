// components/video/VideoFeed.jsx - OPTIMIZED FOR MINIMAL FIREBASE READS
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoItem from './VideoItem';
import CustomFilterBar from './CustomFilterBar';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Optimized constants
const CACHE_VERSION = 'v5';
const CACHE_KEY = `cached_videos_${CACHE_VERSION}`;
const SHUFFLE_SEED_KEY = `shuffle_seed_${CACHE_VERSION}`;
const MAX_FAILED_ATTEMPTS = 2;
const CHECK_INTERVAL = 10000;
const LAST_REFRESH_KEY = `last_refresh_timestamp_${CACHE_VERSION}`;
const REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

// Seeded shuffle function
function seededShuffle(array, seed) {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  return shuffled;
}

const VideoFeed = ({
  videos,
  loading: contextLoading,
  hasMoreData,
  fetchMoreFeeds,
  refreshFeeds,
  cacheComplete,
  maxCacheItems,
  newItemsAvailable = 0,
  checkForNewItems,
  integratePendingItems,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localVideos, setLocalVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showNewItemsBanner, setShowNewItemsBanner] = useState(false);
  
  // Filter states
  const [priceFilter, setPriceFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Optimization refs
  const lastFetchTime = useRef(0);
  const shuffleSeed = useRef(Date.now());
  const isFetching = useRef(false);
  const autoCheckInterval = useRef(null);
  const lastKnownVideosLength = useRef(0);
  const flatListRef = useRef(null);
  
  // Animations
  const [springAnim] = useState(new Animated.Value(0));
  const [showLoader, setShowLoader] = useState(false);
  const [bannerAnim] = useState(new Animated.Value(0));

  // Cache operations
  const loadOptimizedCache = async () => {
    try {
      const [cachedVideos, savedSeed] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEY),
        AsyncStorage.getItem(SHUFFLE_SEED_KEY)
      ]);

      if (cachedVideos) {
        const videos = JSON.parse(cachedVideos);
        const seed = savedSeed ? parseInt(savedSeed) : Date.now();
        
        if (videos.length > 0) {
          shuffleSeed.current = seed;
          const shuffled = seededShuffle(videos, seed);
          setLocalVideos(shuffled);
          setIsInitialized(true);
          lastKnownVideosLength.current = shuffled.length;
          
          console.log(`📱 Loaded ${videos.length} videos from cache`);
          return shuffled;
        }
      }
      
      return null;
    } catch (error) {
      console.warn('Cache loading failed:', error);
      return null;
    }
  };

  const saveOptimizedCache = async (videosToCache, seed) => {
    try {
      const operations = [
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify(videosToCache)),
        AsyncStorage.setItem(SHUFFLE_SEED_KEY, seed.toString())
      ];
      
      await Promise.all(operations);
      console.log(`💾 Cached ${videosToCache.length} videos`);
    } catch (error) {
      console.warn('Cache saving failed:', error);
    }
  };

  // Seamless video updates from context
  useEffect(() => {
    if (videos && videos.length > 0) {
      if (videos.length !== lastKnownVideosLength.current) {
        console.log(`📱 Context videos updated: ${lastKnownVideosLength.current} → ${videos.length}`);
        
        const seed = shuffleSeed.current;
        const shuffled = seededShuffle([...videos], seed);
        setLocalVideos(shuffled);
        lastKnownVideosLength.current = videos.length;
        
        // Update cache
        saveOptimizedCache(videos, seed);
        
        console.log(`✅ Local videos updated with ${videos.length} items`);
      }
    }
  }, [videos]);

  // Initialize videos
  useEffect(() => {
    const initializeVideos = async () => {
      const cacheResult = await loadOptimizedCache();
      
      if (cacheResult) {
        return;
      }
      
      if (videos && videos.length > 0) {
        const seed = Date.now();
        shuffleSeed.current = seed;
        const shuffled = seededShuffle([...videos], seed);
        setLocalVideos(shuffled);
        setIsInitialized(true);
        lastKnownVideosLength.current = shuffled.length;
        
        await saveOptimizedCache(videos, seed);
        console.log(`🔄 Initialized ${videos.length} videos from context`);
      }
    };

    initializeVideos();
  }, []);

  // New items banner handling
  useEffect(() => {
    if (newItemsAvailable > 0 && !showNewItemsBanner) {
      setShowNewItemsBanner(true);
      
      Animated.spring(bannerAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
      
      console.log(`🔔 Showing banner for ${newItemsAvailable} new items`);
    }
  }, [newItemsAvailable]);

  // OPTIMIZED: Auto-check for new items every 10 seconds
  useEffect(() => {
    if (checkForNewItems && isInitialized) {
      autoCheckInterval.current = setInterval(async () => {
        try {
          // This will only read NEW items, not all 50 documents
          const hasNewItems = await checkForNewItems();
          if (hasNewItems) {
            console.log('📥 Auto-check found new items');
          }
        } catch (error) {
          console.warn('Auto-check failed:', error);
        }
      }, CHECK_INTERVAL);

      return () => {
        if (autoCheckInterval.current) {
          clearInterval(autoCheckInterval.current);
        }
      };
    }
  }, [checkForNewItems, isInitialized]);

  // Efficient filtering
  const filterVideos = useCallback((videos) => {
    if (priceFilter === 'All' && roomFilter === 'All' && typeFilter === 'All') {
      return videos;
    }

    return videos.filter(video => {
      // Price filter
      if (priceFilter !== 'All') {
        const price = parseInt(video.price);
        const priceInRange = (() => {
          switch (priceFilter) {
            case 'below_4000': return price < 4000;
            case '4000_5000': return price >= 4000 && price <= 5000;
            case '5000_8000': return price >= 5000 && price <= 8000;
            case '8000_12000': return price > 8000 && price <= 12000;
            case 'above_12000': return price > 12000;
            default: return true;
          }
        })();
        if (!priceInRange) return false;
      }

      // Room filter
      if (roomFilter !== 'All' && video.roomType !== roomFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'All' && video.hostelType?.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [priceFilter, roomFilter, typeFilter]);

  // Apply filters efficiently
  useEffect(() => {
    if (localVideos.length > 0) {
      const filtered = filterVideos(localVideos);
      setFilteredVideos(filtered);
    }
  }, [localVideos, filterVideos]);

  // Handle new items integration
  const handleLoadNewItems = async () => {
    try {
      setShowNewItemsBanner(false);
      
      Animated.timing(bannerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (integratePendingItems) {
        const success = await integratePendingItems();
        if (success) {
          console.log('✅ New items loaded successfully');
          
          // Scroll to top to show new items
          if (flatListRef.current) {
            setTimeout(() => {
              flatListRef.current.scrollToIndex({ index: 0, animated: true });
            }, 500);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error loading new items:', error);
    }
  };

  // Smart refresh - reshuffle or full refresh based on time
const handleSmartRefresh = async () => {
  if (isRefreshing) return;
  setIsRefreshing(true);

  try {
    const lastRefresh = await AsyncStorage.getItem(LAST_REFRESH_KEY);
    const now = Date.now();

    if (lastRefresh && now - parseInt(lastRefresh) < REFRESH_INTERVAL) {
      // Less than 24 hours since last refresh: shuffle only
      console.log('🔁 Less than 24 hours - reshuffling videos only');
      const newSeed = Date.now();
      shuffleSeed.current = newSeed;

      const reshuffled = seededShuffle([...videos], newSeed);
      setLocalVideos(reshuffled);
      await AsyncStorage.setItem(SHUFFLE_SEED_KEY, newSeed.toString());
    } else {
      // More than 24 hours - perform full refresh
      console.log('🔄 More than 24 hours - performing full refresh');
      await refreshFeeds();

      await AsyncStorage.setItem(LAST_REFRESH_KEY, now.toString());
    }
  } catch (error) {
    console.error('Smart refresh failed:', error);
  } finally {
    setIsRefreshing(false);
  }
};


  // CRITICAL: Optimized end reached with proper cache management
  const handleEndReached = useCallback(async () => {
    const now = Date.now();
    
    // Debounce rapid calls
    if (now - lastFetchTime.current < 1000) {
      console.log('⏱️ Debouncing end reached call');
      return;
    }
    
    // CRITICAL: Don't fetch if cache is complete or at max capacity
    if (cacheComplete || localVideos.length >= (maxCacheItems || 100)) {
      console.log(`🛑 Cache complete or at max capacity (${localVideos.length}/${maxCacheItems || 100})`);
      return;
    }
    
    // Don't fetch if already fetching, no more data, or too many failures
    if (isFetching.current || !hasMoreData || fetchAttempts >= MAX_FAILED_ATTEMPTS) {
      console.log('⏹️ Skipping fetch - conditions not met');
      return;
    }
    
    console.log(`🎯 End reached - fetching more (${localVideos.length}/${maxCacheItems || 100})`);
    setShowLoader(true);
    
    isFetching.current = true;
    lastFetchTime.current = now;
    
    try {
      await fetchMoreFeeds();
      setFetchAttempts(0);
      console.log('✅ Fetch more completed');
    } catch (error) {
      console.warn('❌ Fetch more failed:', error);
      setFetchAttempts(prev => prev + 1);
    } finally {
      isFetching.current = false;
      
      setTimeout(() => {
        setShowLoader(false);
      }, 800);
    }
  }, [hasMoreData, fetchMoreFeeds, fetchAttempts, cacheComplete, maxCacheItems, localVideos.length]);

  // Efficient viewable item tracking
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  }, [currentIndex]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 100,
  };

  const renderItem = useCallback(({ item, index }) => (
    <VideoItem
      item={item}
      index={index}
      isActive={index === currentIndex}
      shouldRestart={index === currentIndex}
    />
  ), [currentIndex]);

  // Smart loading footer
  const renderFooter = useCallback(() => {
    if (cacheComplete) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.completionText}>
            All videos loaded ({filteredVideos.length} videos)
          </Text>
        </View>
      );
    }
    
    if (!hasMoreData && !contextLoading && !showLoader) {
      return null;
    }

    if (showLoader || contextLoading || (hasMoreData && filteredVideos.length > 0)) {
      return (
        <Animated.View 
          style={[
            styles.footerContainer,
            {
              transform: [{
                translateY: springAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              }],
            },
          ]}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>
            Loading more videos...
          </Text>
        </Animated.View>
      );
    }

    return null;
  }, [springAnim, hasMoreData, contextLoading, showLoader, filteredVideos.length, cacheComplete, localVideos.length, maxCacheItems]);

  // New items banner
  const renderNewItemsBanner = () => {
    if (!showNewItemsBanner || newItemsAvailable === 0) {
      return null;
    }

    return (
      <Animated.View 
        style={[
          styles.newItemsBanner,
          {
            transform: [{
              translateY: bannerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            }],
            opacity: bannerAnim,
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.newItemsButton}
          onPress={handleLoadNewItems}
          activeOpacity={0.8}
        >
          <Text style={styles.newItemsText}>
            🔔 {newItemsAvailable} new video{newItemsAvailable > 1 ? 's' : ''} available
          </Text>
          <Text style={styles.newItemsSubtext}>Tap to load</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Loading animation effect
  useEffect(() => {
    if ((showLoader || contextLoading) && (hasMoreData || contextLoading) && !cacheComplete) {
      Animated.sequence([
        Animated.timing(springAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(springAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      springAnim.setValue(0);
    }
  }, [showLoader, contextLoading, hasMoreData, springAnim, cacheComplete]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="black"
        translucent={true}
        hidden={false}
      />

      <CustomFilterBar
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        roomFilter={roomFilter}
        setRoomFilter={setRoomFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {renderNewItemsBanner()}

      {filteredVideos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No videos available matching your filters.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredVideos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleSmartRefresh}
              tintColor="white"
            />
          }
          // Optimized FlatList props
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: SCREEN_HEIGHT,
            offset: SCREEN_HEIGHT * index,
            index,
          })}
          removeClippedSubviews={true}
          maxToRenderPerBatch={1}
          windowSize={2}
          initialNumToRender={1}
          decelerationRate="fast"
          onEndReachedThreshold={0.8}
          onEndReached={handleEndReached}
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
          ListFooterComponent={renderFooter}
          updateCellsBatchingPeriod={100}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  footerContainer: {
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  completionText: {
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  newItemsBanner: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 10,
  },
  newItemsButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newItemsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  newItemsSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
});

export default VideoFeed;

// // components/video/VideoFeed.jsx - OPTIMIZED FOR 100-ITEM CACHE
// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import {
//   FlatList,
//   View,
//   StatusBar,
//   StyleSheet,
//   Dimensions,
//   RefreshControl,
//   Text,
//   ActivityIndicator,
//   Animated,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import VideoItem from './VideoItem';
// import CustomFilterBar from './CustomFilterBar';

// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // Optimized storage keys with versioning
// const CACHE_VERSION = 'v3';
// const CACHE_KEY = `cached_videos_${CACHE_VERSION}`;
// const METADATA_KEY = `video_metadata_${CACHE_VERSION}`;
// const SHUFFLE_SEED_KEY = `shuffle_seed_${CACHE_VERSION}`;

// // Optimized constants
// const REFRESH_INTERVAL = 60 * 24 * 60 * 60 * 1000; // 60 days
// const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours before considering cache stale
// const MAX_FAILED_ATTEMPTS = 2;

// // Ultra-efficient seeded shuffle (consistent results)
// function seededShuffle(array, seed) {
//   const shuffled = [...array];
//   let currentIndex = shuffled.length;
  
//   const seededRandom = (seed) => {
//     const x = Math.sin(seed) * 10000;
//     return x - Math.floor(x);
//   };
  
//   while (currentIndex !== 0) {
//     const randomIndex = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
//     currentIndex--;
//     [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
//   }
  
//   return shuffled;
// }

// const VideoFeed = ({
//   videos,
//   loading: contextLoading,
//   hasMoreData,
//   fetchMoreFeeds,
//   refreshFeeds,
//   getStats,
//   cacheComplete, // NEW: Know when cache is complete
//   maxCacheItems, // NEW: Know the maximum cache size
// }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [localVideos, setLocalVideos] = useState([]);
//   const [filteredVideos, setFilteredVideos] = useState([]);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [fetchAttempts, setFetchAttempts] = useState(0);
//   const [isInitialized, setIsInitialized] = useState(false);
  
//   // Filter states
//   const [priceFilter, setPriceFilter] = useState('All');
//   const [roomFilter, setRoomFilter] = useState('All');
//   const [typeFilter, setTypeFilter] = useState('All');

//   // Refs for optimization
//   const lastFetchTime = useRef(0);
//   const shuffleSeed = useRef(Date.now());
//   const isFetching = useRef(false);
  
//   // Animation
//   const [springAnim] = useState(new Animated.Value(0));
//   const [showLoader, setShowLoader] = useState(false);

//   // Cache operations
//   const getCacheMetadata = async () => {
//     try {
//       const metadata = await AsyncStorage.getItem(METADATA_KEY);
//       return metadata ? JSON.parse(metadata) : null;
//     } catch (error) {
//       return null;
//     }
//   };

//   const setCacheMetadata = async (data) => {
//     try {
//       await AsyncStorage.setItem(METADATA_KEY, JSON.stringify({
//         ...data,
//         timestamp: Date.now(),
//       }));
//     } catch (error) {
//       console.warn('Failed to save cache metadata');
//     }
//   };

//   const batchCacheOperations = async (videos, seed, metadata) => {
//     try {
//       const operations = [
//         AsyncStorage.setItem(CACHE_KEY, JSON.stringify(videos)),
//         AsyncStorage.setItem(SHUFFLE_SEED_KEY, seed.toString()),
//         setCacheMetadata(metadata)
//       ];
      
//       await Promise.all(operations);
//     } catch (error) {
//       console.warn('Batch cache operations failed:', error);
//     }
//   };

//   const loadOptimizedCache = async () => {
//     try {
//       const [cachedVideos, savedSeed, metadata] = await Promise.all([
//         AsyncStorage.getItem(CACHE_KEY),
//         AsyncStorage.getItem(SHUFFLE_SEED_KEY),
//         getCacheMetadata()
//       ]);

//       if (cachedVideos) {
//         const videos = JSON.parse(cachedVideos);
//         const seed = savedSeed ? parseInt(savedSeed) : Date.now();
        
//         const isFresh = metadata && (Date.now() - metadata.timestamp) < CACHE_DURATION;
        
//         if (videos.length > 0) {
//           shuffleSeed.current = seed;
//           const shuffled = seededShuffle(videos, seed);
//           setLocalVideos(shuffled);
//           setIsInitialized(true);
          
//           console.log(`📱 Loaded ${videos.length} videos from cache (${isFresh ? 'fresh' : 'stale'})`);
//           return { videos: shuffled, metadata, isFresh };
//         }
//       }
      
//       return null;
//     } catch (error) {
//       console.warn('Cache loading failed:', error);
//       return null;
//     }
//   };

//   // Initialize with cache-first approach
//   useEffect(() => {
//     const initializeVideos = async () => {
//       const cacheResult = await loadOptimizedCache();
      
//       if (cacheResult) {
//         return;
//       }
      
//       if (videos && videos.length > 0) {
//         const seed = Date.now();
//         shuffleSeed.current = seed;
//         const shuffled = seededShuffle([...videos], seed);
//         setLocalVideos(shuffled);
//         setIsInitialized(true);
        
//         await batchCacheOperations(videos, seed, {
//           totalCount: videos.length,
//           lastFetch: Date.now(),
//           maxCacheItems: maxCacheItems || 100
//         });
        
//         console.log(`🔄 Initialized ${videos.length} videos from context`);
//       }
//     };

//     initializeVideos();
//   }, [videos, maxCacheItems]);

//   // Efficient filtering with memoization
//   const filterVideos = useCallback((videos) => {
//     if (priceFilter === 'All' && roomFilter === 'All' && typeFilter === 'All') {
//       return videos;
//     }

//     return videos.filter(video => {
//       // Price filter
//       if (priceFilter !== 'All') {
//         const price = parseInt(video.price);
//         const priceInRange = (() => {
//           switch (priceFilter) {
//             case 'below_4000': return price < 4000;
//             case '4000_5000': return price >= 4000 && price <= 5000;
//             case '5000_8000': return price >= 5000 && price <= 8000;
//             case '8000_12000': return price > 8000 && price <= 12000;
//             case 'above_12000': return price > 12000;
//             default: return true;
//           }
//         })();
//         if (!priceInRange) return false;
//       }

//       // Room filter
//       if (roomFilter !== 'All' && video.roomType !== roomFilter) {
//         return false;
//       }

//       // Type filter
//       if (typeFilter !== 'All' && video.hostelType?.toLowerCase() !== typeFilter.toLowerCase()) {
//         return false;
//       }

//       return true;
//     });
//   }, [priceFilter, roomFilter, typeFilter]);

//   // Apply filters efficiently
//   useEffect(() => {
//     if (localVideos.length > 0) {
//       const filtered = filterVideos(localVideos);
//       setFilteredVideos(filtered);
//     }
//   }, [localVideos, filterVideos]);

//   // Smart refresh with minimal API calls
//   const handleSmartRefresh = async () => {
//     if (isRefreshing) return;
    
//     setIsRefreshing(true);
    
//     try {
//       const metadata = await getCacheMetadata();
//       const now = Date.now();
      
//       const shouldAPIRefresh = !metadata || 
//         !metadata.lastAPIRefresh || 
//         (now - metadata.lastAPIRefresh) >= REFRESH_INTERVAL;
      
//       if (shouldAPIRefresh) {
//         console.log('🌐 API refresh needed (60+ days)');
//         await refreshFeeds();
        
//         await setCacheMetadata({
//           ...metadata,
//           lastAPIRefresh: now,
//           lastReshuffle: now
//         });
//       } else {
//         console.log('🔀 Reshuffling cached content');
//         if (localVideos.length > 0) {
//           const newSeed = Date.now();
//           shuffleSeed.current = newSeed;
//           const reshuffled = seededShuffle([...localVideos], newSeed);
//           setLocalVideos(reshuffled);
          
//           await AsyncStorage.setItem(SHUFFLE_SEED_KEY, newSeed.toString());
//           await setCacheMetadata({
//             ...metadata,
//             lastReshuffle: now
//           });
//         }
//       }
//     } catch (error) {
//       console.error('Smart refresh failed:', error);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   // CRITICAL: Optimized end reached with cache completion check
//   const handleEndReached = useCallback(async () => {
//     const now = Date.now();
//     const stats = getStats();
    
//     // Debounce rapid calls
//     if (now - lastFetchTime.current < 1000) {
//       console.log('⏱️ Debouncing end reached call');
//       return;
//     }
    
//     // CRITICAL: Don't fetch if cache is complete
//     if (cacheComplete) {
//       console.log('🛑 Cache is complete, no more fetches needed');
//       return;
//     }
    
//     // CRITICAL: Don't fetch if we've reached max cache items
//     if (stats && stats.totalFeeds >= (maxCacheItems || 100)) {
//       console.log(`🛑 Maximum cache items reached (${stats.totalFeeds}/${maxCacheItems || 100})`);
//       return;
//     }
    
//     // Don't fetch if already fetching, no more data, or too many failures
//     if (isFetching.current || !hasMoreData || fetchAttempts >= MAX_FAILED_ATTEMPTS) {
//       console.log('⏹️ Skipping fetch - fetching:', isFetching.current, 'hasMoreData:', hasMoreData, 'attempts:', fetchAttempts);
//       return;
//     }
    
//     console.log(`🎯 End reached - attempting to fetch more... (${stats?.totalFeeds || 0}/${maxCacheItems || 100} cached)`);
//     setShowLoader(true);
    
//     isFetching.current = true;
//     lastFetchTime.current = now;
    
//     try {
//       await fetchMoreFeeds();
//       setFetchAttempts(0);
//       console.log('✅ Fetch more completed successfully');
//     } catch (error) {
//       console.warn('❌ Fetch more failed:', error);
//       setFetchAttempts(prev => prev + 1);
//     } finally {
//       isFetching.current = false;
      
//       setTimeout(() => {
//         setShowLoader(false);
//       }, 800);
//     }
//   }, [hasMoreData, fetchMoreFeeds, fetchAttempts, cacheComplete, maxCacheItems, getStats]);

//   // Efficient viewable item tracking
//   const onViewableItemsChanged = useCallback(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       const newIndex = viewableItems[0].index;
//       if (newIndex !== currentIndex) {
//         setCurrentIndex(newIndex);
//       }
//     }
//   }, [currentIndex]);

//   const viewabilityConfig = {
//     itemVisiblePercentThreshold: 60,
//     minimumViewTime: 100,
//   };

//   const renderItem = useCallback(({ item, index }) => (
//     <VideoItem
//       item={item}
//       index={index}
//       isActive={index === currentIndex}
//       shouldRestart={index === currentIndex}
//     />
//   ), [currentIndex]);

//   // Smart loading footer - only show when actually loading and can load more
//   const renderFooter = useCallback(() => {
//     // Don't show footer if cache is complete
//     if (cacheComplete) {
//       return (
//         <View style={styles.footerContainer}>
//           <Text style={styles.completionText}>
//             All videos loaded ({filteredVideos.length} videos)
//           </Text>
//         </View>
//       );
//     }
    
//     // Don't show footer if no more data available
//     if (!hasMoreData && !contextLoading && !showLoader) {
//       return null;
//     }

//     // Show loading footer only when actually loading
//     if (showLoader || contextLoading || (hasMoreData && filteredVideos.length > 0)) {
//       const stats = getStats();
//       return (
//         <Animated.View 
//           style={[
//             styles.footerContainer,
//             {
//               transform: [{
//                 translateY: springAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [0, -20],
//                 }),
//               }],
//             },
//           ]}
//         >
//           <ActivityIndicator size="large" color="#fff" />
//           <Text style={styles.loadingText}>
//             Loading more videos... ({stats?.totalFeeds || 0}/{maxCacheItems || 100} cached)
//           </Text>
//         </Animated.View>
//       );
//     }

//     return null;
//   }, [springAnim, hasMoreData, contextLoading, showLoader, filteredVideos.length, cacheComplete, getStats, maxCacheItems]);

//   // Loading animation effect
//   useEffect(() => {
//     if ((showLoader || contextLoading) && (hasMoreData || contextLoading) && !cacheComplete) {
//       Animated.sequence([
//         Animated.timing(springAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.spring(springAnim, {
//           toValue: 0,
//           tension: 100,
//           friction: 8,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     } else {
//       springAnim.setValue(0);
//     }
//   }, [showLoader, contextLoading, hasMoreData, springAnim, cacheComplete]);

//   if (!isInitialized) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#fff" />
//         <Text style={styles.loadingText}>Initializing...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor="black"
//         translucent={true}
//         hidden={false}
//       />

//       <CustomFilterBar
//         priceFilter={priceFilter}
//         setPriceFilter={setPriceFilter}
//         roomFilter={roomFilter}
//         setRoomFilter={setRoomFilter}
//         typeFilter={typeFilter}
//         setTypeFilter={setTypeFilter}
//       />

//       {filteredVideos.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>
//             No videos available matching your filters.
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredVideos}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id}
//           refreshControl={
//             <RefreshControl
//               refreshing={isRefreshing}
//               onRefresh={handleSmartRefresh}
//               tintColor="white"
//             />
//           }
//           // Optimized FlatList props
//           pagingEnabled={true}
//           showsVerticalScrollIndicator={false}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//           getItemLayout={(data, index) => ({
//             length: SCREEN_HEIGHT,
//             offset: SCREEN_HEIGHT * index,
//             index,
//           })}
//           removeClippedSubviews={true}
//           maxToRenderPerBatch={1}
//           windowSize={2}
//           initialNumToRender={1}
//           decelerationRate="fast"
//           onEndReachedThreshold={0.8}
//           onEndReached={handleEndReached}
//           snapToInterval={SCREEN_HEIGHT}
//           snapToAlignment="start"
//           ListFooterComponent={renderFooter}
//           updateCellsBatchingPeriod={100}
//           maintainVisibleContentPosition={{
//             minIndexForVisible: 0,
//           }}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'black',
//   },
//   emptyText: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//     opacity: 0.8,
//   },
//   footerContainer: {
//     height: SCREEN_HEIGHT,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//     paddingHorizontal: 20,
//   },
//   loadingText: {
//     color: 'white',
//     fontSize: 16,
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   completionText: {
//     color: '#4CAF50',
//     fontSize: 16,
//     textAlign: 'center',
//     fontWeight: '600',
//   },
// });

// export default VideoFeed;