import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { voteHotspot } from "../services/wifiService";

type Props = NativeStackScreenProps<RootStackParamList, "WifiDetail">;

export default function WifiDetailScreen({ route }: Props) {
  const { hotspot } = route.params;
  const [revealed, setRevealed] = useState(false);
  const [upvotes, setUpvotes] = useState(hotspot.upvotes);
  const [downvotes, setDownvotes] = useState(hotspot.downvotes);

  const copyPassword = async () => {
    await Clipboard.setStringAsync(hotspot.password);
    Alert.alert("Imenakiliwa", "Password imenakiliwa. Nenda kwenye settings za Wi-Fi kubandika.");
  };

  const vote = async (kind: "up" | "down") => {
    try {
      await voteHotspot(hotspot.id, kind);
      if (kind === "up") setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
    } catch {
      Alert.alert("Hitilafu", "Imeshindwa kutuma kura yako.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.place}>{hotspot.placeName}</Text>
      <Text style={styles.ssid}>📶 {hotspot.ssid}</Text>

      <View style={styles.passwordBox}>
        <Text style={styles.passwordLabel}>Password</Text>
        <Text style={styles.password}>{revealed ? hotspot.password : "••••••••••"}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btnOutline} onPress={() => setRevealed((r) => !r)}>
            <Text style={styles.btnOutlineText}>{revealed ? "Ficha" : "Onyesha"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={copyPassword}>
            <Text style={styles.btnPrimaryText}>Nakili</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.voteRow}>
        <TouchableOpacity style={styles.voteBtn} onPress={() => vote("up")}>
          <Text>👍 Inafanya kazi ({upvotes})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.voteBtn} onPress={() => vote("down")}>
          <Text>👎 Haifanyi kazi ({downvotes})</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        Kumbuka: Tumia tu mitandao hii kwa heshima. Usiongeze password ya mtu bila ridhaa yake.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  place: { fontSize: 14, color: "#666", marginBottom: 4 },
  ssid: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  passwordBox: { backgroundColor: "#F2F6FC", borderRadius: 12, padding: 16, marginBottom: 20 },
  passwordLabel: { fontSize: 12, color: "#888", marginBottom: 6 },
  password: { fontSize: 20, fontWeight: "600", letterSpacing: 1, marginBottom: 14 },
  row: { flexDirection: "row", gap: 10 },
  btnOutline: { borderWidth: 1, borderColor: "#1E88E5", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnOutlineText: { color: "#1E88E5", fontWeight: "600" },
  btnPrimary: { backgroundColor: "#1E88E5", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnPrimaryText: { color: "#fff", fontWeight: "600" },
  voteRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  voteBtn: { backgroundColor: "#eee", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  note: { fontSize: 12, color: "#999", textAlign: "center" },
});
