import React, { useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  Animated,
} from 'react-native';
import COLORS from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TopTabBar = ({ tabs, activeTab, onTabPress }) => {
  const scrollRef = useRef();
  const tabRefs = useRef({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loaded, setLoaded] = useState(false);

  // Fade-in animation on component mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setLoaded(true));
  }, []);

  // Scroll to active tab
  useEffect(() => {
    if (tabRefs.current[activeTab] && loaded) {
      tabRefs.current[activeTab].measureLayout(
        scrollRef.current,
        (x, y, tabWidth) => {
          scrollRef.current.scrollTo({
            x: x - SCREEN_WIDTH / 2 + tabWidth / 2,
            animated: true,
          });
        }
      );
    }
  }, [activeTab, loaded]);

  // Get icon for tab
  const getTabIcon = (tabKey) => {
    const icons = {
      'all': 'home',
      'popular': 'star',
      'top': 'trending-up',
      'nearby': 'map-marker',
      'lastminute': 'clock',
      'homestel': 'home',
    };
    return icons[tabKey] || 'tag';
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
          style={styles.tabBar}
          decelerationRate="fast"
          snapToAlignment="center"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                ref={(ref) => (tabRefs.current[tab.key] = ref)}
                style={[
                  styles.tabItem,
                  {
                    backgroundColor: isActive ? COLORS.background : '#fff',
                    borderColor: isActive ? COLORS.background : 'rgba(0,0,0,0.06)',
                  },
                  isActive && styles.activeTabShadow,
                ]}
                onPress={() => onTabPress(tab.key)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={getTabIcon(tab.key)}
                  size={16}
                  color={isActive ? '#fff' : COLORS.darkest}
                  style={styles.tabIcon}
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? '#fff' : COLORS.darkest,
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.gradientOverlay} />
        <View style={[styles.gradientOverlay, styles.gradientOverlayRight]} />
      </View>
    </Animated.View>
  );
};

export default TopTabBar;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  tabBarContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1,
  },
  activeTabShadow: {
    shadowColor: COLORS.darkest,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  tabIcon: {
    marginRight: 6,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  gradientOverlayRight: {
    left: 'auto',
    right: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
});