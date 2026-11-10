import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchAllHotspots, Hotspot } from "../services/wifiService";

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

export default function MapScreen({ navigation }: Props) {
  const [region, setRegion] = useState<Region | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHotspots = useCallback(async () => {
    try {
      const data = await fetchAllHotspots();
      setHotspots(data);
    } catch (e: any) {
      Alert.alert("Hitilafu", "Imeshindwa kupakua data ya Wi-Fi: " + e.message);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Ruhusa ya eneo inahitajika",
          "Xtom Wi-Fi Maps inahitaji eneo lako ili kukuonyesha mitandao iliyo karibu."
        );
        setRegion({ latitude: -6.7924, longitude: 39.2083, latitudeDelta: 0.5, longitudeDelta: 0.5 }); // Dar es Salaam default
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
      await loadHotspots();
      setLoading(false);
    })();
  }, [loadHotspots]);

  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Inapakia ramani...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {hotspots.map((h) => (
          <Marker
            key={h.id}
            coordinate={{ latitude: h.latitude, longitude: h.longitude }}
            title={h.ssid}
            description={h.placeName}
            pinColor="#1E88E5"
            onPress={() => navigation.navigate("WifiDetail", { hotspot: h })}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("AddWifi", {
            latitude: region.latitude,
            longitude: region.longitude,
          })
        }
      >
        <Text style={styles.fabText}>+ Ongeza Wi-Fi</Text>
      </TouchableOpacity>

      <View style={styles.counter}>
        <Text style={styles.counterText}>{hotspots.length} mitandao karibu</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  fab: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: "#1E88E5",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  counter: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: { color: "#fff", fontSize: 12 },
});
