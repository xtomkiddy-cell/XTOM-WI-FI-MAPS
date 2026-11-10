# Xtom Wi-Fi Maps 📶🗺️

App ya mfano (MVP) ya "crowdsourced Wi-Fi sharing" — kama Instabridge / WiFi Map — iliyojengwa kwa
**React Native (Expo) + Firebase + Google Maps**. Watumiaji wanaoshiriki password za mitandao
wanazoziruhusu wanaweka kwenye ramani, na wengine wanaweza kuona mitandao iliyo karibu nao popote
walipo wakiwa online.

> ⚠️ **Muhimu kiusalama/kisheria**: App hii inafanya kazi tu kwa mitandao ambayo wamiliki/watumiaji
> wameamua kuishiriki wenyewe (mf. WiFi ya mkahawa, hoteli, ofisi inayoruhusu wageni, au mtandao wako
> binafsi). Haina uwezo wa "kuvunja" au kudukua password za mtu bila ridhaa yake — hilo si halali.
> Hakikisha matumizi ya app yanaendana na sheria za nchi unakofanyia kazi na sera za faragha (GDPR,
> Sheria ya Ulinzi wa Taarifa Binafsi Tanzania, n.k.).

## Muundo wa Mradi

```
xtom-wifi-maps/
├── App.tsx                      # Entry point
├── app.json                     # Config ya Expo (jina, icons, Google Maps API keys)
├── package.json
├── firestore.rules              # Kanuni za usalama za database
└── src/
    ├── context/AuthContext.tsx  # Anonymous auth ya kiotomatiki
    ├── navigation/AppNavigator.tsx
    ├── screens/
    │   ├── MapScreen.tsx        # Ramani kuu + alama za Wi-Fi
    │   ├── WifiDetailScreen.tsx # Onyesha/nakili password, piga kura
    │   └── AddWifiScreen.tsx    # Changia mtandao mpya
    └── services/
        ├── firebase.ts          # Firebase init
        └── wifiService.ts       # CRUD ya "hotspots" collection
```

## Hatua za Kuanzisha (Setup)

### 1. Tengeneza mradi wa Firebase
1. Nenda [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → ite jina `xtom-wifi-maps`.
2. Kwenye **Build → Authentication → Sign-in method**, washa **Anonymous** (na Email/Password ukitaka
   watumiaji wawe na akaunti baadaye).
3. Kwenye **Build → Firestore Database**, bonyeza **Create database** (anza na *test mode*, kisha
   badilisha kwa `firestore.rules` iliyopo humu kabla ya kuzindua rasmi).
4. Kwenye **Project settings → General → Your apps**, bonyeza `</>` (Web app) ili kupata `firebaseConfig`
   object, kisha ibandike kwenye `src/services/firebase.ts`.
5. Deploy rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # chagua project yako
   firebase deploy --only firestore:rules
   ```

### 2. Pata Google Maps API Key
1. Nenda [Google Cloud Console](https://console.cloud.google.com/) → washa **Maps SDK for Android** na
   **Maps SDK for iOS**.
2. Tengeneza API key, kisha ibandike kwenye `app.json` sehemu za
   `ios.config.googleMapsApiKey` na `android.config.googleMaps.apiKey`.
3. Weka vikwazo (restrictions) kwenye key hiyo kulingana na package name/bundle ID ili isitumike
   vibaya na watu wengine.

### 3. Install na Run
```bash
cd xtom-wifi-maps
npm install
npx expo start
```
- Bonyeza `a` kufungua kwenye Android emulator, `i` kwa iOS simulator, au scan QR code kwa simu yako
  halisi ukitumia **Expo Go** app.

> `react-native-maps` inahitaji *development build* (si Expo Go tu) ikiwa unataka features zote za
> Google Maps kwenye Android — tumia `npx expo run:android` / `npx expo run:ios` kwa build kamili, au
> `eas build` kwa APK/IPA ya kusambaza.

## Jinsi Mfumo Unavyofanya Kazi

1. **Ruhusa ya eneo**: app inauliza GPS permission, kisha inaonyesha ramani ikianzia eneo la mtumiaji.
2. **Kuona mitandao**: `fetchAllHotspots()` inasoma collection ya `hotspots` kwenye Firestore na
   kuonyesha kila moja kama *marker* kwenye ramani.
3. **Kuangalia password**: ukibonyeza marker, unaenda `WifiDetailScreen` ambapo unaweza kuonyesha au
   kunakili password moja kwa moja kwenye clipboard.
4. **Kuchangia**: mtumiaji yeyote (hata bila akaunti — anatumika *anonymous auth*) anaweza kuongeza
   mtandao mpya kupitia `AddWifiScreen`, ambayo inahifadhi SSID, password, jina la mahali, na
   GPS coordinates.
5. **Kura (votes)**: watumiaji wanaweza kupiga kura "inafanya kazi" au "haifanyi kazi" kusaidia
   kuthibitisha usahihi wa taarifa.

## Nyongeza Zinazopendekezwa Kabla ya Kuzindua Rasmi

- [ ] **Geohashing / bounding-box queries** (mf. kwa `geofire-common`) badala ya kupakua hotspots zote —
      muhimu ukifika maelfu ya rekodi.
- [ ] **Uthibitisho wa mchango** (moderation) kabla mtandao haujaonekana kwa umma, kuzuia spam/taarifa za
      uongo.
- [ ] **Ripoti/flagging** ya mitandao yenye taarifa za uongo au zisizo na ridhaa, na utaratibu wa
      kuziondoa haraka.
- [ ] **Sera ya faragha na masharti ya matumizi** wazi ndani ya app, inayoeleza kuwa watumiaji
      wanawajibika kushiriki tu mitandao wana ruhusa nayo.
- [ ] **Clustering ya alama** (`react-native-map-clustering`) ukiwa na mitandao mingi eneo moja.
- [ ] **Akaunti za email/password** kwa watumiaji wanaotaka kuhariri/kufuta michango yao popote walipo.

## Teknolojia Zilizotumika
- **React Native + Expo** — msingi wa app ya mobile (Android & iOS kutoka codebase moja)
- **Firebase Auth** — utambulisho wa watumiaji (anonymous kwa default)
- **Cloud Firestore** — database ya real-time ya mitandao ya Wi-Fi
- **react-native-maps (Google Maps provider)** — ramani na alama
- **React Navigation** — mwendo kati ya screens
