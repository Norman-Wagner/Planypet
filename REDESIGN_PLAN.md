# Planypet v2.0 Redesign Implementation Plan

## Overview
Complete redesign of Planypet app based on 8 mockup screens with color-coded features, premium UI, and full feature integration.

## Screens to Implement

### 1. Dashboard (Blue #1E5A96)
- Pet profile with photo
- Gamification level (e.g., "Level 4: Abenteurer")
- Quick stats: Feeding (2/3), Walks (45min/60min), Health (✓)
- Navigation icons at bottom

### 2. KI-Symptom-Analyse (Purple #7B3FF2)
- Pet selector (Dog/Cat/Luna)
- Symptom description input
- Duration slider
- Severity slider (Mild/Mittel/Schwer)
- AI assessment with urgency level
- Expert recommendations
- Liability disclaimer

### 3. GPS-Tracking (Green #2ECC71)
- Live map with route visualization
- Start/Pause/Stop buttons
- Distance, Duration, Tempo display
- Weather integration (rain warning for Luna)
- Route history

### 4. Gesundheitsakten (Red #E74C3C)
- Vaccination status (Tollwut, Staupe, Parvovirose)
- Vet appointments (upcoming)
- Health status indicator
- Vet mode toggle
- Liability disclaimer

### 5. KI-Rassenschanner (Purple #7B3FF2)
- Camera integration
- AI breed detection with confidence
- Breed details (size, weight, temperament)
- Share functionality

### 6. Community & Freunde (Blue #3498DB)
- Friend list with online status
- Activity feed
- Photo sharing
- Like/comment functionality
- Notifications

### 7. Marktplatz (Orange #F39C12)
- Filter tabs (Tierarzt, Trainer, Groomer, Telemedizin)
- Provider cards with ratings
- Distance display
- Price range
- Contact buttons

### 8. Smart-Geräte (Dark Blue #1A3A52)
- Connected devices list
- Battery status
- Last activity/location
- Device status indicators
- Add device button

## Color Scheme
- Dashboard: #1E5A96 (Blue)
- KI-Symptom: #7B3FF2 (Purple)
- GPS-Tracking: #2ECC71 (Green)
- Health: #E74C3C (Red)
- Breed Scanner: #7B3FF2 (Purple)
- Community: #3498DB (Light Blue)
- Marketplace: #F39C12 (Orange)
- Smart Devices: #1A3A52 (Dark Blue)

## Icon Integration
- Planypet paw icon (white on blue) visible on all screens
- No emojis - use SF Symbols / Material Icons
- Professional, clean design

## Features
- Wetter integration (OpenWeatherMap for Android, WeatherKit for iOS)
- GPS tracking with Google Maps (Android) / Apple Maps (iOS)
- AI-powered symptom analysis & breed detection
- Community social features
- Marketplace integration
- Smart device management

## Liability Disclaimers
- Health screens: "Nicht als Ersatz für Tierarzt"
- AI features: "KI-Einschätzung nicht bindend"
- GPS tracking: "Datenschutz-konform"
- All screens: DSGVO compliance

## Implementation Order
1. Create color-coded theme
2. Build each screen component
3. Integrate APIs (Weather, Maps, AI)
4. Add navigation
5. Test all flows
6. Create checkpoint
7. Deploy to EAS Build
