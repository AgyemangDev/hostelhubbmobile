import React, { useState } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, Platform,StatusBar} from 'react-native';
import ShopHeader from '../../../components/Headers/ShopHeader';
import ProductCard from '../../../components/Cards/VerticalScroll/ProductCard';
import { useProducts } from '../../../context/ProductContext';
import CartHeader from '../../../components/ProductComponent/CartHeader';

const Index = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <ProductCard product={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ShopHeader onSearch={setSearchQuery} onFilter={setCategoryFilter} />

        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.cartWrapper}>
          <CartHeader />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  cardWrapper: {
    flex: 1,
    margin: 0,
  },
  cartWrapper: {
    position: 'absolute',
    bottom: 50,
    left: 20,
  },
});

