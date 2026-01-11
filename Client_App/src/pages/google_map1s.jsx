

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const Routing = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      lineOptions: { styles: [{ color: "blue", weight: 4 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, start, end]);

  return null;
};

export const RouteMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState({ lat: -0.4561, lng: 39.6582 }); // Garissa

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        // fallback to Nairobi if geolocation fails
        setUserLocation({ lat: -1.2921, lng: 36.8219 });
      }
    );
  }, []);

  if (!userLocation) return <div className="text-center p-8">Loading Map...</div>;

  return (
    <div className="flex-1 relative h-[600px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={userLocation}
        zoom={7}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={userLocation} />
        <Marker position={destination} />
        <Routing start={userLocation} end={destination} />
      </MapContainer>
    </div>
  );
};

//export default RouteMap;
