import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import EmptyCategoryPage from '../../../components/CategoriesComponents/EmptyCategoryPage'

const _layout = () => {
  return (
    <View style={styles.container}>
      <EmptyCategoryPage category={"Hotels"} />
    </View>
  );
};
export default _layout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});