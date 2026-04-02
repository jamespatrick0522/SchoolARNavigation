# School AR Navigation (Android MVP)

Local-first ARCore prototype for thesis mock-defense demos.

## Stack
- React Native CLI `0.76.3` (TypeScript)
- Android only
- `@reactvision/react-viro@2.41.6` for AR scenes and image marker anchoring
- React Navigation (native stack)
- AsyncStorage repository layer (replaceable later with SQLite/backend sync)

## Core Features
- Marker-first calibration with fixed `START-001` image target
- Guided waypoint placement and destination placement
- Local persistence for marker origin, routes, and destination metadata
- Destination list/search/edit/delete
- Re-scan marker and render AR route arrows
- Tracking status banner + recovery message flow
- Utilities screen with demo seed and reset

## Project Structure
```text
src/
  app/
  ar/
    components/
    hooks/
    scenes/
    utils/
  components/
  constants/
  navigation/
  screens/
  services/
  state/
  storage/
  types/
  utils/
  assets/
    markers/
```

## Setup (Windows + Android)
1. Install Android Studio, SDK 34+, and Java 17.
2. Start emulator OR connect physical Android phone with USB debugging.
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Start Metro:
   ```powershell
   npm start
   ```
5. Run app:
   ```powershell
   npm run android
   ```

## Marker Asset
`src/assets/markers/start_marker.png`

Replace this with your real printed marker image, keeping the same filename.

Default physical width is configured as `0.155` meters in:
- `src/constants/marker.ts`
- `src/ar/utils/viroTargets.ts`

## Demo Flow
1. Home -> `Start Calibration`
2. Scan printed marker
3. Fill destination details
4. Place waypoints and destination
5. Save route
6. Home -> `Navigate` -> choose destination
7. Re-scan marker and follow AR arrows

## Notes
- This prototype intentionally avoids claiming high-precision indoor localization.
- Positions are marker-relative for repeatability during presentations.
- If AR tracking degrades, UI asks user to re-scan the start marker.
