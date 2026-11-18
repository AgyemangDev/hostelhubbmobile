import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, ListRow, SearchField, Sheet } from "../../ui";
import { colors, space } from "../../../constants/theme";

const CATEGORIES = ["All", "Hostel & Lifestyle Essentials", "Electronics & Gadgets", "Apparel & Fashion", "Health & Fitness"];

/** Shop search plus a category filter sheet. */
export default function ShopHeader({ onSearch, onFilter }) {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All");
  const [filterVisible, setFilterVisible] = useState(false);

  const handleSearchChange = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  const handleCategorySelect = (next) => {
    setCategory(next);
    onFilter(next);
    setFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <SearchField variant="filled" placeholder="Search products..." value={searchText} onChangeText={handleSearchChange} />
      </View>
      <IconButton icon="options-outline" variant="tonal" accessibilityLabel="Filter products" onPress={() => setFilterVisible(true)} />

      <Sheet visible={filterVisible} onClose={() => setFilterVisible(false)} title="Filter by category">
        {CATEGORIES.map((c, i) => (
          <ListRow key={c} title={c} selected={c === category} last={i === CATEGORIES.length - 1} onPress={() => handleCategorySelect(c)} />
        ))}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: space.xs, paddingHorizontal: space.sm, paddingVertical: 10, backgroundColor: colors.background },
  search: { flex: 1 },
});
