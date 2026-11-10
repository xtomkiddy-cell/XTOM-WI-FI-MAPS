// src/services/wifiService.ts
// Data layer kwa "hotspots" collection kwenye Firestore.
//
// Muundo wa document (collection: "hotspots"):
// {
//   ssid: string,            // jina la network
//   password: string,        // password (angalia firestore.rules - tu wamiliki wanaweza kusoma field hii moja kwa moja kwenye client ikiwa unataka kuificha zaidi, lakini kwa app kama hii kusudi ni kuonyesha)
//   location: GeoPoint,      // latitude/longitude
//   placeName: string,       // mf. "Cafe Java - Masaki"
//   addedBy: string,         // uid wa mtumiaji aliyeongeza
//   addedAt: Timestamp,
//   upvotes: number,
//   downvotes: number,
//   verifiedCount: number,
// }

import {
  collection,
  addDoc,
  GeoPoint,
  serverTimestamp,
  query,
  getDocs,
  doc,
  updateDoc,
  increment,
  deleteDoc,
  orderBy,
  limit as fsLimit,
} from "firebase/firestore";
import { db } from "./firebase";

export type Hotspot = {
  id: string;
  ssid: string;
  password: string;
  placeName: string;
  latitude: number;
  longitude: number;
  addedBy: string;
  upvotes: number;
  downvotes: number;
};

const HOTSPOTS = "hotspots";

/**
 * Pata hotspots zote. Kwa app ya uzalishaji, tumia GeoFirestore au
 * geohash-based bounding-box query ili kupata tu zile za karibu na
 * mtumiaji badala ya kupakua collection nzima.
 */
export async function fetchAllHotspots(): Promise<Hotspot[]> {
  const q = query(collection(db, HOTSPOTS), orderBy("addedAt", "desc"), fsLimit(500));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data: any = d.data();
    return {
      id: d.id,
      ssid: data.ssid,
      password: data.password,
      placeName: data.placeName,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
      addedBy: data.addedBy,
      upvotes: data.upvotes ?? 0,
      downvotes: data.downvotes ?? 0,
    };
  });
}

export async function addHotspot(params: {
  ssid: string;
  password: string;
  placeName: string;
  latitude: number;
  longitude: number;
  addedBy: string;
}) {
  return addDoc(collection(db, HOTSPOTS), {
    ssid: params.ssid.trim(),
    password: params.password,
    placeName: params.placeName.trim(),
    location: new GeoPoint(params.latitude, params.longitude),
    addedBy: params.addedBy,
    addedAt: serverTimestamp(),
    upvotes: 0,
    downvotes: 0,
    verifiedCount: 0,
  });
}

export async function voteHotspot(id: string, kind: "up" | "down") {
  const ref = doc(db, HOTSPOTS, id);
  await updateDoc(ref, {
    [kind === "up" ? "upvotes" : "downvotes"]: increment(1),
  });
}

export async function deleteHotspot(id: string) {
  await deleteDoc(doc(db, HOTSPOTS, id));
}

/** Umbali (km) kati ya pointi mbili - formula ya Haversine. */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
