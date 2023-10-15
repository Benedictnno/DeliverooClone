import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import MapView from "react-native-maps";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";

export default function LocationSearch() {
  const navigation = useNavigation();
  const [location, setLocation] = useState({
    latitude: 51.5078788,
    longitude: -0.0877321,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          const Point = details?.geometry?.location;
          if (!Point) return;
          setLocation({
            ...location,
            latitude: Point.lat,
            longitude: Point.lng,
          });
          console.log(data, details);
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "en",
        }}
        renderLeftButton={() => (
          <View style={styles.boxIcon}>
            <Ionicons name="search-outline" size={20} color={Colors.medium} />
          </View>
        )}
        styles={{
          container: { flex: 0 },
          textInput: { backgroundColor: Colors.grey, paddingLeft: 35 },
          textInputContainer: { backgroundColor: "#fff", padding: 8 },
        }}
      />
      <MapView showsUserLocation={true} style={styles.map} region={location} />
      <View style={styles.absoluteBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  boxIcon: {
    position: "absolute",
    left: 15,
    top: 18,
    zIndex: 1,
  },
});
