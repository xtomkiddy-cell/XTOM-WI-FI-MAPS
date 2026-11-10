import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { addHotspot } from "../services/wifiService";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "AddWifi">;

export default function AddWifiScreen({ route, navigation }: Props) {
  const { user } = useAuth();
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [saving, setSaving] = useState(false);

  const coords = route.params ?? { latitude: -6.7924, longitude: 39.2083 };

  const submit = async () => {
    if (!ssid.trim() || !password.trim() || !placeName.trim()) {
      Alert.alert("Jaza taarifa zote", "Tafadhali jaza jina la mtandao, password, na jina la mahali.");
      return;
    }
    if (!user) {
      Alert.alert("Subiri", "Bado tunakuthibitisha, jaribu tena baada ya sekunde chache.");
      return;
    }
    setSaving(true);
    try {
      await addHotspot({
        ssid,
        password,
        placeName,
        latitude: coords.latitude,
        longitude: coords.longitude,
        addedBy: user.uid,
      });
      Alert.alert("Asante!", "Umeongeza Wi-Fi kwenye ramani.", [
        { text: "Sawa", onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert("Hitilafu", e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.warning}>
        Ongeza password tu ya mtandao ambao una ruhusa ya kuushiriki (mf. WiFi ya biashara yako, hoteli
        inayoruhusu wageni, au mtandao wako binafsi). Usiongeze password ya mtu mwingine bila idhini yake.
      </Text>

      <Text style={styles.label}>Jina la Mtandao (SSID)</Text>
      <TextInput style={styles.input} value={ssid} onChangeText={setSsid} placeholder="mf. CafeJava_Guest" />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" />

      <Text style={styles.label}>Jina la Mahali</Text>
      <TextInput
        style={styles.input}
        value={placeName}
        onChangeText={setPlaceName}
        placeholder="mf. Cafe Java - Masaki"
      />

      <Text style={styles.coords}>
        Eneo litakalohifadhiwa: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
      </Text>

      <TouchableOpacity style={styles.btn} onPress={submit} disabled={saving}>
        <Text style={styles.btnText}>{saving ? "Inahifadhi..." : "Hifadhi kwenye Ramani"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  warning: { fontSize: 12, color: "#B45309", backgroundColor: "#FEF3C7", padding: 10, borderRadius: 8, marginBottom: 20 },
  label: { fontSize: 13, color: "#555", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16 },
  coords: { fontSize: 12, color: "#888", marginTop: 16 },
  btn: { backgroundColor: "#1E88E5", padding: 16, borderRadius: 10, marginTop: 24, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
