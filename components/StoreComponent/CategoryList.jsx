import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import CategoryItem from "./CategoryItem";

const CategoryList = ({ categories, pricing, onSelectCategory, selectedCategories }) => {
    return (
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <CategoryItem
            key={category}
            category={category}
            price={pricing[category]}
            selected={selectedCategories.includes(category)}
            onPress={onSelectCategory}
          />
        ))}
      </View>
    );
  };
  

export default CategoryList;

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
