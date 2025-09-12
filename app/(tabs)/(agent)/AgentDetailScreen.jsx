import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserContext } from '../../../context/UserContext';

import { AgentContext } from '../../../context/AgentContext'; // ✅ NEW

import AddReviewModal from '../../../components/AgentComponents/AddReviewModal';
import ProfileSection from '../../../components/AgentComponents/ProfileSection';
import QuickStats from '../../../components/AgentComponents/QuickStats';
import AboutSection from '../../../components/AgentComponents/AboutSection';
import ContactInfo from '../../../components/AgentComponents/ContactInfo';
import ReviewsSection from '../../../components/AgentComponents/ReviewsSection';
import AddReviewButton from '../../../components/AgentComponents/AddReviewButton';
import AgentNotFound from '../../../components/AgentComponents/AgentNotFound';
import { db } from '../../../app/firebase/FirebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const AgentDetailScreen = () => {
  const { agentId } = useLocalSearchParams();
  const { agents } = useContext(AgentContext); // ✅ Get agent data from context
  const { userInfo } = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId || !agents) return;

    const foundAgent = agents.find(a => a.id === agentId);
    setAgent(foundAgent);
    setLoading(false);
  }, [agentId, agents]);

  const handleAddReview = async (rating, reviewText) => {
    // Check if the user has already reviewed this agent
    if (agent.reviews && agent.reviews.some(review => review.userId === userInfo.id)) {
      Alert.alert("You've already given a review to this agent.");
      return;
    }

    // Prepare the review data
    const newReview = {
      userId: userInfo.id,
      userName: `${userInfo.firstName} ${userInfo.surname}`,
      rating,
      reviewText,
      createdAt: new Date(),
    };

    try {
      // Update the agent's document by adding the new review
      const agentDocRef = doc(db, 'Employees', agent.id);
      await updateDoc(agentDocRef, {
        reviews: arrayUnion(newReview),
      });

      // Optionally update the agent context and local state if needed
      setModalVisible(false);
      // Update the reviews list locally as well (optional)
      setAgent(prevAgent => ({
        ...prevAgent,
        reviews: [...prevAgent.reviews, newReview], // add the new review to local state
      }));

      Alert.alert("Your review has been submitted successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      Alert.alert("There was an error submitting your review. Please try again later.");
    }
  };

  if (loading) {
    return null; // Optionally replace with a loading indicator
  }

  if (!agent) {
    return <AgentNotFound />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection agent={agent} />
        <QuickStats agent={agent} />
        <AboutSection bio={agent.expectations} />
        <ContactInfo phone={agent.phone} email={agent.email} />
        <ReviewsSection reviews={agent.reviews || []} />
        <AddReviewButton onPress={() => setModalVisible(true)} />
        
        <AddReviewModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleAddReview}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});

export default AgentDetailScreen;
