import React, { useMemo } from 'react';
import VideoFeed from '../../../components/VideoFeedComponents/VideoFeed';
import { useFeeds } from '../../../context/FeedsContext';
import { ActivityIndicator, View, Text } from 'react-native';

export default function VideosScreen() {
  const {
    hostelDocuments, // Now receiving hostel documents instead of individual videos
    loading,
    hasMoreData,
    isInitialized,
    fetchMoreFeeds,
    refreshFeeds,
    checkForNewItems,
    integratePendingItems,
    newItemsAvailable,
    maxCacheItems
  } = useFeeds();

  // Transform hostel documents into individual video feeds with complete hostel information
  const flattenedVideoFeeds = useMemo(() => {
    const videoFeeds = [];
    
    hostelDocuments.forEach(hostelDoc => {
      // Only process hostels that have videos
      if (hostelDoc.videos && Array.isArray(hostelDoc.videos) && hostelDoc.videos.length > 0) {
        hostelDoc.videos.forEach((video) => {
          // Create a complete video feed object with all hostel information
          const videoFeed = {
            // Video-specific information
            id: `${hostelDoc.id}_${video.id}`, // Unique video ID
            videoId: video.id,
            videoUrl: video.videoUrl,
            videoCreatedAt: video.createdAt,
            videoUpdatedAt: video.updatedAt,
            price: video.price,
            roomType: video.roomType,
            roomDescription: video.roomDescription,
            views: video.views,
            randomOrder: video.randomOrder,
            isVideoActive: video.isActive,
            
            // Hostel information
            hostelId: hostelDoc.id,
            hostelName: hostelDoc.hostelName,
            institution: hostelDoc.institution,
            frontImage: hostelDoc.frontImage,
            hostelType: hostelDoc.type,
            isHostelActive: hostelDoc.isActive,
            hostelCreatedAt: hostelDoc.createdAt,
            hostelUpdatedAt: hostelDoc.updatedAt,
            
            // Location information
            location: {
              address: hostelDoc.location?.address,
              coordinates: {
                latitude: hostelDoc.location?.coordinates?.latitude,
                longitude: hostelDoc.location?.coordinates?.longitude
              }
            },
            
            // Porter contact information
            porter: {
              name: hostelDoc.porter?.name,
              number: hostelDoc.porter?.number
            }
          };
          
          videoFeeds.push(videoFeed);
        });
      }
    });
    
    // Sort by video creation time (newest first) or by randomOrder for variety
for (let i = videoFeeds.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [videoFeeds[i], videoFeeds[j]] = [videoFeeds[j], videoFeeds[i]];
}
    
    console.log(`🎥 Flattened ${hostelDocuments.length} hostels into ${videoFeeds.length} video feeds`);
    
    return videoFeeds;
  }, [hostelDocuments]);

  // Loading state
  if (!isInitialized || (loading && hostelDocuments.length === 0)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading videos...</Text>
      </View>
    );
  }

  // No videos state
  if (flattenedVideoFeeds.length === 0 && !loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No videos available</Text>
      </View>
    );
  }

  // Enhanced refresh function that handles the new return format
  const handleRefresh = async () => {
    const result = await refreshFeeds();
    return result;
  };

  // Stats for debugging (optional)
  const getEnhancedStats = () => ({
    totalHostels: hostelDocuments.length,
    totalVideos: flattenedVideoFeeds.length,
    maxHostels: maxCacheItems,
    hasMoreData,
    loading,
    newItemsAvailable,
    avgVideosPerHostel: hostelDocuments.length > 0 ? 
      (flattenedVideoFeeds.length / hostelDocuments.length).toFixed(1) : 0
  });

  return (
    <VideoFeed
      videos={flattenedVideoFeeds}
      loading={loading}
      hasMoreData={hasMoreData}
      fetchMoreFeeds={fetchMoreFeeds}
      refreshFeeds={handleRefresh}
      checkForNewItems={checkForNewItems}
      integratePendingItems={integratePendingItems}
      newItemsAvailable={newItemsAvailable}
      getStats={getEnhancedStats}
    />
  );
}