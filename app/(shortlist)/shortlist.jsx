import { View,StyleSheet } from 'react-native'
import React from 'react'
import ShortListCardList from '../../components/ShortlistComponents/ShortListCardList'

const Explore = () => {

  return (
    <View style={styles.container}>
    
    <ShortListCardList/>
    </View>
  )
}

export default Explore

const styles = StyleSheet.create({
  container:{
    flexGrow: 1,
    backgroundColor: '#fff',
    
  },
  animatedHeader: {
    zIndex: 1,
    backgroundColor: '#fff',
  },
})