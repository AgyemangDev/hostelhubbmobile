import { View, Text, FlatList, Image, TouchableOpacity, Alert } from "react-native";

const servicesData = [
  {
    id: 1,
    name: "Laundry Services",
    description: "Get your clothes cleaned and delivered on time.",
    image: "https://img.freepik.com/premium-photo/black-afro-woman-smiling-cheerfully-feeling-happy-showing-concept-copy-space-with-palm-hand-housekeeping-concept-household-concept_1194-212717.jpg?ga=GA1.1.307588626.1711624851&semt=ais_hybrid",
  },
  {
    id: 2,
    name: "Restaurants",
    description: "Discover premium dining experiences near you.",
    image: "https://dining.umd.edu/sites/default/files/styles/optimized/public/2024-07/For%20Students_Web_Resident%20Dining__DiningServices_05072019_5731.jpg?itok=-ibX4ZSq",
  },
  {
    id: 3,
    name: "Stores",
    description: "Exclusive discounts on premium stores.",
    image: "https://miro.medium.com/v2/da:true/resize:fit:1200/0*8HaV1Eoqz_8DuO1X",
  },
];

export default function Services() {
  const handleButtonPress = () => {
    Alert.alert("Stay Tuned!", "We're in the process of perfecting this feature to ensure it meets your needs. Launching soon!");
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Services
      </Text>
      <FlatList
        data={servicesData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 16,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#f9f9f9",
              elevation: 5,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: 200 }}
            />
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14, color: "#555", marginVertical: 8 }}>
                {item.description}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#610b0c",
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
                onPress={handleButtonPress}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Explore Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
