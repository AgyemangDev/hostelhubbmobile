import { Marker } from "react-native-maps";
import { Image, Text, View } from "react-native";

const HostelMarkers = ({ hostels, onMarkerPress }) => {
  return (
    <>
      {hostels.map((hostel) => {
        let iconSource;
        switch (hostel.category) {
          case "hotel":
            iconSource = require("../../assets/images/hotel.png");
            break;
          case "apartment":
            iconSource = require("../../assets/images/hotel.png");
            break;
          case "guest house":
            iconSource = require("../../assets/images/guesthouse.png");
            break;
          case "homestel":
            iconSource = require("../../assets/images/homstel.png");
            break;
          default:
            iconSource = require("../../assets/images/hostel.png");
            break;
        }

        const namePreview = hostel.hostelName?.split(" ").slice(0, 2).join(" ");

        return (
          <Marker
            key={hostel.id}
            coordinate={{
              latitude: parseFloat(hostel.latitude),
              longitude: parseFloat(hostel.longitude),
            }}
            title={null}
            description={null}
            onPress={() => onMarkerPress(hostel)}
          >
            <View style={{ alignItems: "center" }}>
              <Image
                source={iconSource}
                style={{ width: 35, height: 35 }}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: "600", fontSize: 12, marginTop: 2 }}>
                {namePreview}
              </Text>
            </View>
          </Marker>
        );
      })}
    </>
  );
};

export default HostelMarkers;
