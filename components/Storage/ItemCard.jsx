import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";

export default function ItemCard({
  item,
  selectedItem,
  onSelect,
  onIncrease,
  onDecrease,
}) {
  const [preview, setPreview] = useState(false);
  const isSelected = !!selectedItem;

  return (
    <>
      <Pressable
        onPress={onSelect}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
        ]}
      >
        {/* Image */}
        <Pressable onPress={() => setPreview(true)}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </Pressable>

        {/* Content */}
        <View style={styles.content}>
          {/* Top row */}
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.price}>₵{item.price}</Text>
          </View>

          {/* Counter */}
          {isSelected && (
            <View style={styles.counter}>
              <Pressable onPress={onDecrease} style={styles.control}>
                <Text style={styles.controlText}>−</Text>
              </Pressable>

              <Text style={styles.qty}>{selectedItem.quantity}</Text>

              <Pressable onPress={onIncrease} style={styles.control}>
                <Text style={styles.controlText}>+</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>

      {/* Image Preview */}
      <Modal visible={preview} transparent>
        <Pressable style={styles.modal} onPress={() => setPreview(false)}>
          <Image source={{ uri: item.image }} style={styles.fullImage} />
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  selectedCard: {
    borderColor: "#2e7dff",
    backgroundColor: "#f4f8ff",
  },

  image: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    flex: 1,
    marginRight: 10,
  },

  price: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2e7dff",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  control: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#2e7dff",
    justifyContent: "center",
    alignItems: "center",
  },

  controlText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  qty: {
    marginHorizontal: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
});