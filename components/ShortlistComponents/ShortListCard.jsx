import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import React, { useState,useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db,auth } from '../../app/FirebaseConfig';


const ShortListCard = ({ hostelName, location, ImageUrl, availability, isLastItem, onCardPress,hostelId }) => {
  const [isStarred, setIsStarred] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchStarStatus = async () => {
      try {
        const docRef = doc(db, `Student_Users/${user.uid}/shortlist`, hostelId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setIsStarred(docSnap.data().isStarred);
        }
      } catch (error) {
        console.error("Error fetching star status:", error);
      }
    };

    fetchStarStatus();
  }, [hostelId, user.uid]);

  const toggleStar = async () => {
    const newStarStatus = !isStarred;
    setIsStarred(newStarStatus);

    try {
      const docRef = doc(db, `Student_Users/${user.uid}/shortlist`, hostelId);

      if (newStarStatus) {
        await setDoc(docRef, { isStarred: true, hostelId });
      } else {
        await deleteDoc(docRef);
      }
    } catch (error) {
      console.error("Error updating star status:", error);
    }
  };

  
  return (
    <View style={styles.container}>
      {/* Separator line */}

      <TouchableWithoutFeedback onPress={onCardPress}>
        <View style={[styles.cardAlign, isLastItem ? styles.lastCard : null]}>
          <Image source={ImageUrl} style={styles.img} />
          <View style={styles.textAlign}>
            <Text style={styles.txt}>{hostelName}</Text>
            <Text style={styles.locText}>{location}</Text>

            <View style={styles.availabilityAlignContainer}>
            {/* availability section */}
            <View style={[styles.availabilityContainer, availability === true ? styles.available : styles.full]}>
              <Text style={styles.availabilityText}>{availability ? "Available" : "Full" }</Text>
            </View>
              <View>
              <TouchableWithoutFeedback onPress={toggleStar}>
                <Ionicons name={isStarred ? "star" : "star-outline"} size={30
                } color={'#9a0b0d'}  style
                ={styles.starIcon} />
              </TouchableWithoutFeedback>
              </View>
            </View>

         

          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.separator} />
    </View>
  );
};

export default ShortListCard;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#d3d3d3',
    width: '100%',
    position: 'absolute',
    top: 10,
  },
  img: {
    height: 140,
    width: 180,
    borderRadius: 10,
  },
  cardAlign: {
    flexDirection: 'row',
  },
  textAlign: {
    marginLeft: 18,
    marginTop: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
availabilityContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10, 
  },
  available: {
    backgroundColor: 'green',
  },
  full: {
    backgroundColor: COLORS.background,
    width: 75,
    alignItems: 'center',
  },
  availabilityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  availabilityAlignContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },


  starIcon: {
    marginBottom: 30,
  },
});
