import { useState, useEffect } from "react";
import { Polyline } from "react-native-maps";
import { getDirections } from "../../utils/mapUtils";

const DirectionsLine = ({ origin, destination }) => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    const fetchDirections = async () => {
      const coords = await getDirections(origin, destination);
      setRouteCoordinates(coords);
    };
    
    fetchDirections();
  }, [origin.latitude, origin.longitude, destination.latitude, destination.longitude]);

  return <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="#4285F4" />;
};

export default DirectionsLine;