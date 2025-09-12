import { StyleSheet, Text, View , FlatList, Image} from 'react-native'
import React from 'react'


const data = [
    { id: '1', uri: 'https://media.istockphoto.com/id/1464143895/photo/hostel-dormitory-beds-at-cheap-room.jpg?s=1024x1024&w=is&k=20&c=bpCrGR4tZkLMbgwJ9wlIrDxYxT5SX7YqPzzJY2Ykfio=' },
    { id: '2', uri: 'https://media.istockphoto.com/id/182498079/photo/youth-hostel-dorm-room.webp?b=1&s=170667a&w=0&k=20&c=aXELokDxcTCvmDEil6_O91AJcxxHdzGdDmWKgPs49bA=' },
    { id: '3', uri: 'https://media.istockphoto.com/id/1475783143/photo/young-people-in-dormitory-spending-free-time-brazilian-girl-with-curly-hair-sitting-on-bunk.webp?b=1&s=170667a&w=0&k=20&c=NBvI185z6FJBRUgKZCVNIsLU9Fl0Ud3-swF0ncgsqO4=' },
    { id: '4', uri: 'https://media.istockphoto.com/id/1814658543/photo/young-man-showing-something-on-his-cell-phone-to-his-roommates-in-room-at-hostel.webp?b=1&s=170667a&w=0&k=20&c=t6OeOJJN9x0XOjjh0QDUu9bFs_DLg2mMM9r6VEWfz3s=' },
    { id: '5', uri: 'https://media.istockphoto.com/id/1807514677/photo/talking-to-my-new-roommate.webp?b=1&s=170667a&w=0&k=20&c=GmywFe2BZdA2IuKPFdRaHywJtY__qE4MM8jG9keMbC8=' },
  ];

const HorizontalScroll = () => {
    const renderItem = ({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.image} />
      );
    
      return (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
  )
}

export default HorizontalScroll

const styles = StyleSheet.create({
    image: {
      width: 220,
      height: 150,
      borderRadius: 10,
      marginHorizontal: 5, // Optional: Adds spacing between images
    },
  });