// context/LocationContext.js
import React, { createContext, useState } from "react";
import * as Location from "expo-location";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [status, setStatus] = useState("idle"); // idle | requesting | granted | denied | error
  const [error, setError] = useState(null);

  const requestLocation = async () => {
    try {
      setStatus("requesting");
      setError(null);

      // Check existing permission
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();
      let finalStatus = existingStatus;

      // Ask if not yet granted
      if (existingStatus !== "granted") {
        const { status: requestedStatus } =
          await Location.requestForegroundPermissionsAsync();
        finalStatus = requestedStatus;
      }

      if (finalStatus !== "granted") {
        setStatus("denied");
        setError("Location permission not granted.");
        return null;
      }

      // Get current position
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };

      setLocation(coords);
      setStatus("granted");
      return coords;
    } catch (e) {
      console.warn("Error getting location", e);
      setStatus("error");
      setError("Failed to get location.");
      return null;
    }
  };

  return (
    <LocationContext.Provider
      value={{ location, status, error, requestLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};
