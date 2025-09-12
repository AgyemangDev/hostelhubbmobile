import { decode } from "@mapbox/polyline";

export const getDirections = async (startLoc, destinationLoc, mode = "driving") => {
  try {
    const apiKey = "AIzaSyAbLuhuszsrZAUNH31HH3pc1T9P7rl9UHM";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&mode=${mode}&key=${apiKey}`
    );
    const json = await response.json();

    if (json.routes.length) {
      const points = decode(json.routes[0].overview_polyline.points);
      const coords = points.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      return coords;
    }
    return [];
  } catch (error) {
    console.error("Error fetching directions:", error);
    return [];
  }
};
