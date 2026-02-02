import { View,StyleSheet } from 'react-native'
import ShortListCardList from '../components/ShortlistComponents/ShortListCardList'

const Shortlist = () => {

  return (
    <View style={styles.container}>
    
    <ShortListCardList/>
    </View>
  )
}

export default Shortlist

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