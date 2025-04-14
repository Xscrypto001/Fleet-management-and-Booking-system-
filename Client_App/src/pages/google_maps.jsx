import React, { useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  DirectionsRenderer
} from "@react-google-maps/api";
import { MapPin } from "lucide-react";

const center = { lat: -1.2921, lng: 36.8219 }; // Nairobi

const RouteMap = () => {
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY_HERE", // ⬅️ replace this
    libraries: ["places"]
  });

  const onLoad = useCallback((map) => {
    mapRef.current = map;

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
      map
    });

    directionsRendererRef.current = directionsRenderer;

    directionsService.route(
      {
        origin: "Nairobi, Kenya",
        destination: "Garissa, Kenya",
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  }, []);

  if (!isLoaded) return <div className="text-center p-8">Loading Map...</div>;

  return (
    <div className="flex-1 relative h-[600px] rounded-xl overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={7}
        onLoad={onLoad}
      />
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg z-10">
        <MapPin size={24} className="text-blue-600" />
      </div>
    </div>
  );
};

export default RouteMap;
